import { Token, SwapStep, QuoteRequest, QuoteResult, QuoteResults } from '@/types'
import { ContractFunctionParameters, Address, Hex, encodeFunctionData } from 'viem'
import { Exchange } from './base'
import { SwapType } from '@/constants'
import { NATIVE_WRAPPER_ABI } from '@/constants/wrapper'

export class NativeWrapper extends Exchange {
  public static buildSwapStepsFromTokens(from: Token, to: Token): SwapStep[] {
    return [
      {
        tokenIn: from,
        tokenOut: to,
        extra: {}, // No extra data needed for native wrapper
      },
    ]
  }

  public static async getQuote(quoteRequest: QuoteRequest): Promise<QuoteResults | undefined> {
    const { amount, smallAmount, swapRoute } = quoteRequest

    // update the swapType based on the swapRoute
    const { isFromNative } = swapRoute
    let swapType
    if (isFromNative) {
      swapType = SwapType.WRAP
    } else {
      swapType = SwapType.UNWRAP
    }

    const createQuoteResult = (quoteAmount: bigint): QuoteResult => ({
      swapType,
      amountIn: quoteAmount,
      amountOut: quoteAmount,
      swapRoute,
      validUntil: Math.floor(Date.now() / 1000) + 30,
    })

    const quoteResult = createQuoteResult(amount)
    const smallQuoteResult = createQuoteResult(smallAmount)

    return {
      regularQuote: quoteResult,
      smallQuote: smallQuoteResult,
    }
  }

  public static getFormattedQuoteResult(quoteRequest: QuoteRequest, result: any): QuoteResult {
    // For native wrapper, we can directly return the quote result as it's already formatted
    return result.bestQuoteResult
  }

  public static getQuoteContractCalls(quoteRequest: QuoteRequest): ContractFunctionParameters[] {
    // Native wrapper doesn't require any contract calls for quoting
    return []
  }

  public static getSwapCalldataFromQuoteResult(quoteResult: QuoteResult, recipient: Address, slippage: number): Hex {
    const { isFromNative } = quoteResult.swapRoute
    const amount = quoteResult.amountIn

    if (isFromNative) {
      // Native to Wrapped Native (deposit)
      return encodeFunctionData({
        abi: NATIVE_WRAPPER_ABI,
        functionName: 'deposit',
        args: [],
      })
    } else {
      // Wrapped Native to Native (withdraw)
      return encodeFunctionData({
        abi: NATIVE_WRAPPER_ABI,
        functionName: 'withdraw',
        args: [amount],
      })
    }
  }
}

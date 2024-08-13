import { publicClient } from '../../../wagmi.config'
import { Exchange } from './base'
import { Token, SwapStep, SwapRoute, QuoteRequest, QuoteResult, QuoteResults } from '@/types'
import { SwapType, CONTRACT_ADDRRESSES, TOKEN_ADDRESSES } from '@/constants'
import { ROUTER02_ABI } from '@/constants/uniswap/v2'
import { Address, Hex, ContractFunctionParameters, encodeFunctionData, ReadContractParameters } from 'viem'

enum QuoteFunctionName {
  getAmountsOut = 'getAmountsOut',
  getAmountsIn = 'getAmountsIn',
}

enum SwapFunctionName {
  swapExactTokensForTokens = 'swapExactTokensForTokens',
  swapTokensForExactTokens = 'swapTokensForExactTokens',
  swapExactETHForTokens = 'swapExactETHForTokens',
  swapTokensForExactETH = 'swapTokensForExactETH',
  swapExactTokensForETH = 'swapExactTokensForETH',
  swapETHForExactTokens = 'swapETHForExactTokens',
}

export class UniswapV2 extends Exchange {
  /**
   * inherited and overriden from Exchange
   */
  public static buildSwapStepsFromTokens(from: Token, to: Token): SwapStep[] {
    return [
      {
        tokenIn: from,
        tokenOut: to,
        extra: {},
      },
    ]
  }

  /**
   * Get the quote
   * @param quoteRequest The quote request
   * @returns The quote
   */
  public static async getQuote(quoteRequest: QuoteRequest): Promise<QuoteResults | undefined> {
    try {
      const calls = this.getQuoteContractCalls(quoteRequest)
      const results = await Promise.all(calls.map((call) => this.readContract(call)))

      const processQuote = (amount: bigint, result: bigint[]) =>
        this.getFormattedQuoteResult({ ...quoteRequest, amount }, result)

      const [regularQuote, smallQuote] = results.map((res, index) =>
        processQuote(index === 0 ? quoteRequest.amount : quoteRequest.smallAmount, res)
      )

      return { regularQuote, smallQuote }
    } catch (error: any) {
      return undefined
    }
  }

  /**
   * Get the formatted quote result
   * @param quoteRequest The quote request
   * @param result The result
   * @returns The formatted quote result
   */
  public static getFormattedQuoteResult(quoteRequest: QuoteRequest, result: bigint[]): QuoteResult {
    return {
      swapType: quoteRequest.swapType,
      amountIn: quoteRequest.swapType === SwapType.EXACT_IN ? quoteRequest.amount : result[0],
      amountOut: quoteRequest.swapType === SwapType.EXACT_OUT ? quoteRequest.amount : result[result.length - 1],
      swapRoute: quoteRequest.swapRoute,
      validUntil: Date.now() + 20 * 1000, //20 seconds
    }
  }

  /**
   * Get the quote contract calls
   * @param quoteRequest The quote request
   * @returns The quote contract calls
   */
  public static getQuoteContractCalls(quoteRequest: QuoteRequest): ContractFunctionParameters[] {
    const path = this._getPath(quoteRequest.swapRoute)
    const routerAddress = CONTRACT_ADDRRESSES[quoteRequest.swapRoute.chainId].UNISWAPV2.router

    const regularCall = {
      address: routerAddress,
      abi: ROUTER02_ABI,
      functionName: this._getQuoteFunctionName(quoteRequest),
      args: [quoteRequest.amount, path],
    }

    const smallCall = {
      ...regularCall,
      args: [quoteRequest.smallAmount, path],
    }

    return [regularCall, smallCall]
  }

  /**
   * Get the swap calldata from the quote result
   * @param quoteResult The quote result
   * @param recipient The recipient address
   * @param slippage The slippage tolerance
   * @returns The swap calldata
   */
  public static getSwapCalldataFromQuoteResult(quoteResult: QuoteResult, recipient: Address, slippage: number): Hex {
    const path = this._getPath(quoteResult.swapRoute)
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200) // 20 minutes from now

    const functionName = this._getSwapFunctionName(quoteResult)
    const args = this._getSwapFunctionParameters(quoteResult, recipient, slippage, path, deadline)

    console.log('functionName', functionName)
    console.log('args', args)

    return encodeFunctionData({
      abi: ROUTER02_ABI,
      functionName,
      args,
    })
  }

  /**
   * Read contract method for UniswapV2
   * @param call The contract call parameters
   * @returns The result of the contract read
   */
  protected static async readContract(call: ReadContractParameters): Promise<bigint[]> {
    return publicClient.readContract({
      address: call.address as Address,
      abi: call.abi,
      functionName: call.functionName as any,
      args: call.args,
    }) as Promise<bigint[]>
  }

  /**
   * Get the quote function name based on the swap type
   * @param quoteRequest The quote request
   * @returns The quote function name
   */
  protected static _getQuoteFunctionName(quoteRequest: QuoteRequest): QuoteFunctionName {
    return quoteRequest.swapType === SwapType.EXACT_IN
      ? QuoteFunctionName.getAmountsOut
      : QuoteFunctionName.getAmountsIn
  }

  /**
   * Get the swap function name based on the quote result
   * @param quoteResult The quote result
   * @returns The swap function name
   */
  protected static _getSwapFunctionName(quoteResult: QuoteResult): SwapFunctionName {
    const { swapType, swapRoute } = quoteResult
    const { isFromNative, isToNative } = swapRoute

    if (swapType === SwapType.EXACT_IN) {
      if (isFromNative) return SwapFunctionName.swapExactETHForTokens
      if (isToNative) return SwapFunctionName.swapExactTokensForETH
      return SwapFunctionName.swapExactTokensForTokens
    } else {
      if (isFromNative) return SwapFunctionName.swapETHForExactTokens
      if (isToNative) return SwapFunctionName.swapTokensForExactETH
      return SwapFunctionName.swapTokensForExactTokens
    }
  }

  /**
   * Get the swap function parameters based on the quote result
   * @param quoteResult The quote result
   * @param recipient The recipient address
   * @param slippage The slippage tolerance
   * @param path The token path
   * @param deadline The transaction deadline
   * @returns The swap function parameters
   */
  protected static _getSwapFunctionParameters(
    quoteResult: QuoteResult,
    recipient: Address,
    slippage: number,
    path: Address[],
    deadline: bigint
  ): any[] {
    const { swapType, amountIn, amountOut } = quoteResult

    switch (this._getSwapFunctionName(quoteResult)) {
      case SwapFunctionName.swapExactETHForTokens:
      case SwapFunctionName.swapETHForExactTokens:
        return [
          swapType === SwapType.EXACT_IN ? this._amountWithSlippage(amountOut, slippage, false) : amountOut,
          path,
          recipient,
          deadline,
        ]
      case SwapFunctionName.swapExactTokensForETH:
      case SwapFunctionName.swapTokensForExactETH:
      case SwapFunctionName.swapExactTokensForTokens:
      case SwapFunctionName.swapTokensForExactTokens:
        return [
          swapType === SwapType.EXACT_IN ? amountIn : amountOut,
          swapType === SwapType.EXACT_IN
            ? this._amountWithSlippage(amountOut, slippage, false)
            : this._amountWithSlippage(amountIn, slippage, true),
          path,
          recipient,
          deadline,
        ]
    }
  }

  /**
   * Get the path for the swap
   * @param route The swap route
   * @returns The path for the swap
   */
  private static _getPath(route: SwapRoute): Address[] {
    const path: Address[] = []

    // Add the first token
    path.push(route.swapSteps[0].tokenIn.address as Address)

    // Add all intermediate and final tokens
    route.swapSteps.forEach((step) => {
      path.push(step.tokenOut.address as Address)
    })

    // Ensure the path always has at least two elements
    if (path.length < 2) {
      throw new Error('UniswapV2 path must contain at least two token addresses')
    }

    return path
  }
}

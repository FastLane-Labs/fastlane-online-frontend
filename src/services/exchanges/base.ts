import { Token, SwapStep, QuoteRequest, QuoteResult, QuoteResults } from '@/types'
import { SwapIntent } from '@/types/atlas'
import { ContractFunctionParameters, Address, Hex, zeroAddress } from 'viem'

/**
 * Base class for exchanges. All exchanges should extend this class and implement the required methods.
 * @abstract
 */
export abstract class Exchange {
  /**
   * Build the possible swap steps for a pair of tokens
   * @param from The token to swap from
   * @param to The token to swap to
   * @returns The possible swap steps for this pair of tokens
   */
  public static buildSwapStepsFromTokens(from: Token, to: Token): SwapStep[] {
    throw new Error('Method not implemented.')
  }

  /**
   * Get a quote for a swap
   * @param quoteRequest The quote request
   * @returns The quote result
   * @dev Use this method to quote a single candidate route swap
   */
  public static async getQuote(quoteRequest: QuoteRequest): Promise<QuoteResults | undefined> {
    throw new Error('Method not implemented.')
  }

  /**
   * Get a formatted quote result from a raw onchain result
   * @param quoteRequest The quote request
   * @param result The raw quote result
   * @returns The formatted quote result
   */
  public static getFormattedQuoteResult(quoteRequest: QuoteRequest, result: any): QuoteResult {
    throw new Error('Method not implemented.')
  }

  /**
   * Get the contract call parameters from a formatted quote request
   * @param quoteRequest The quote request
   * @returns The contract call parameters
   */
  public static getQuoteContractCalls(quoteRequest: QuoteRequest): ContractFunctionParameters[] {
    throw new Error('Method not implemented.')
  }

  /**
   * Get the swap calldata from a quote result
   * @param quoteResult The quote result
   * @param recipient The recipient of the swap
   * @param slippage The allowed slippage in basis points
   * @returns The swap calldata
   */
  public static getSwapCalldataFromQuoteResult(quoteResult: QuoteResult, recipient: Address, slippage: number): Hex {
    throw new Error('Method not implemented.')
  }

  /**
   * Get the swap intent from a quote result
   * @param quoteResult The quote result
   * @param slippage The allowed slippage in basis points
   * @returns The swap intent
   */
  public static getSwapIntent(quoteResult: QuoteResult, slippage: number): SwapIntent {
    const { isFromNative, isToNative, swapSteps } = quoteResult.swapRoute
    const tokenUserSells = isFromNative ? zeroAddress : swapSteps[0].tokenIn.address //From token
    const tokenUserBuys = isToNative ? zeroAddress : swapSteps[swapSteps.length - 1].tokenOut.address //To token

    return {
      tokenUserBuys: tokenUserBuys,
      minAmountUserBuys: this._amountWithSlippage(quoteResult.amountOut, slippage, false),
      tokenUserSells: tokenUserSells,
      amountUserSells: quoteResult.amountIn,
    }
  }

  /**
   * Compute the slippage amount
   * @param amount The amount
   * @param slippage The slippage in basis points
   * @returns The slippage amount
   */
  protected static _amountWithSlippage(amount: bigint, slippage: number, positive: boolean): bigint {
    const _slippage = (amount * BigInt(slippage)) / BigInt(10000)
    return positive ? amount + _slippage : amount - _slippage
  }
}

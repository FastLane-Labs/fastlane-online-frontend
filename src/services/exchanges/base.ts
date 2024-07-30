import { Token, SwapStep, QuoteRequest, QuoteResult } from '@/types'
import { ContractFunctionParameters } from 'viem'

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
  public static async getQuote(quoteRequest: QuoteRequest): Promise<QuoteResult | undefined> {
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
  public static getQuoteContractCall(quoteRequest: QuoteRequest): ContractFunctionParameters {
    throw new Error('Method not implemented.')
  }
}

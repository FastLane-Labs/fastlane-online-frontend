import { config } from '../../wagmi.config'
import { SwapType } from '@/constants'
import { QuoteRequest, QuoteResult, SwapRoute } from '@/types'
import { getExchange } from '@/services/exchanges'
import { multicall } from '@wagmi/core'
import { tokenCmp } from '@/utils/token'
import { ContractFunctionParameters, Address, Hex } from 'viem'

interface IBaseSwapService {
  getBestQuoteExactIn(amountIn: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined>
  getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined>
  getSwapCalldataFromQuoteResult(quoteResult: QuoteResult, recipient: Address, allowedSlippage: number): Hex
}

export class BaseSwapService implements IBaseSwapService {
  /**
   * Get the best quote from a list of candidates routes for an exact input swap
   * @param amountIn The exact amount in
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  async getBestQuoteExactIn(amountIn: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined> {
    return this.getBestQuote(SwapType.EXACT_IN, amountIn, candidates)
  }

  /**
   * Get the best quote from a list of candidates routes for an exact output swap
   * @param amountOut The exact amount out
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  async getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined> {
    return this.getBestQuote(SwapType.EXACT_OUT, amountOut, candidates)
  }

  /**
   * Get the swap calldata from a quote result
   * @param quoteResult The quote result
   * @param recipient The recipient of the swap
   * @param slippage The allowed slippage
   * @returns The swap calldata
   */
  getSwapCalldataFromQuoteResult(quoteResult: QuoteResult, recipient: Address, slippage: number): Hex {
    return getExchange(quoteResult.swapRoute.exchange).getSwapCalldataFromQuoteResult(quoteResult, recipient, slippage)
  }

  /**
   * Validate swap route candidates
   * @param candidates The swap route candidates
   * @throws Error if the candidates are invalid
   * @dev This method isn't part of the interface, it is public for unit testing purposes only
   */
  validateSwapRouteCandidates(candidates: SwapRoute[]) {
    if (!candidates.length) {
      throw new Error('validateSwapRouteCandidates: no swap route candidates provided')
    }

    // All routes must start and end with the same tokens
    const tokenIn = candidates[0].swapSteps[0].tokenIn
    const tokenOut = candidates[0].swapSteps[candidates[0].swapSteps.length - 1].tokenOut

    if (tokenCmp(tokenIn, tokenOut)) {
      throw new Error('validateSwapRouteCandidates: invalid route, tokenIn and tokenOut are the same')
    }

    for (const candidate of candidates) {
      if (!tokenCmp(candidate.swapSteps[0].tokenIn, tokenIn)) {
        throw new Error('validateSwapRouteCandidates: invalid route, tokenIn mismatch')
      }

      if (!tokenCmp(candidate.swapSteps[candidate.swapSteps.length - 1].tokenOut, tokenOut)) {
        throw new Error('validateSwapRouteCandidates: invalid route, tokenOut mismatch')
      }
    }
  }

  /**
   * Get the best quote from a list of candidates routes
   * @param swapType The swap type (EXACT_IN or EXACT_OUT)
   * @param amount The amount in or out depending on the swap type
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  protected async getBestQuote(
    swapType: SwapType,
    amount: bigint,
    candidates: SwapRoute[]
  ): Promise<QuoteResult | undefined> {
    try {
      this.validateSwapRouteCandidates(candidates)
    } catch (error: any) {
      console.error(error)
      return
    }

    if (candidates.length === 1) {
      // Single candidate, direct quote call
      const quoteRequest: QuoteRequest = {
        swapType,
        amount,
        swapRoute: candidates[0],
      }

      return getExchange(candidates[0].exchange).getQuote(quoteRequest)
    }

    // Multicall when more than one candidate
    let quoteRequests: QuoteRequest[] = []
    let calls: ContractFunctionParameters[] = []

    for (const candidate of candidates) {
      const quoteRequest: QuoteRequest = {
        swapType,
        amount,
        swapRoute: candidate,
      }

      quoteRequests.push(quoteRequest)
      calls.push(getExchange(candidate.exchange).getQuoteContractCall(quoteRequest))
    }

    const results = await multicall(config, {
      allowFailure: true,
      contracts: calls,
    })

    let bestAmount = BigInt(0)
    let bestQuoteResult: QuoteResult | undefined

    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'failure') {
        continue
      }

      const quoteResult = getExchange(candidates[i].exchange).getFormattedQuoteResult(
        quoteRequests[i],
        results[i].result
      )

      if (!quoteResult || !quoteResult.amountOut || !quoteResult.amountIn) {
        continue
      }

      switch (swapType) {
        case SwapType.EXACT_IN:
          if (quoteResult.amountOut > bestAmount) {
            bestAmount = quoteResult.amountOut
            bestQuoteResult = quoteResult
          }
          break
        case SwapType.EXACT_OUT:
          if (quoteResult.amountIn < bestAmount || bestAmount === BigInt(0)) {
            bestAmount = quoteResult.amountIn
            bestQuoteResult = quoteResult
          }
          break
      }
    }

    return bestQuoteResult
  }
}

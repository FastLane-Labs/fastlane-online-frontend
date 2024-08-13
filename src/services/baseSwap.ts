import { config } from '../../wagmi.config'
import { SwapType } from '@/constants'
import { QuoteRequest, QuoteResult, QuoteResultWithPriceImpact, SwapRoute } from '@/types'
import { getExchange } from '@/services/exchanges'
import { multicall } from '@wagmi/core'
import { tokenCmp } from '@/utils/token'
import { ContractFunctionParameters, Address, Hex } from 'viem'
import { SwapIntent } from '@/types/atlas'
import { calculateQuotePriceImpact } from '@/utils/calculatePriceImpact'

interface IBaseSwapService {
  getBestQuoteExactIn(amountIn: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined>
  getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined>
  getSwapCalldataFromQuoteResult(quoteResult: QuoteResult, recipient: Address, allowedSlippage: number): Hex
  getSwapIntent(quoteResult: QuoteResult, slippage: number): SwapIntent
}

export class BaseSwapService implements IBaseSwapService {
  private static instance: BaseSwapService

  /**
   * Get the instance of the BaseSwapService
   * @returns The instance of the BaseSwapService
   */
  public static getInstance(): BaseSwapService {
    if (!BaseSwapService.instance) {
      BaseSwapService.instance = new BaseSwapService()
    }

    return BaseSwapService.instance
  }

  /**
   * Get the best quote from a list of candidates routes for an exact input swap
   * @param amountIn The exact amount in
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  async getBestQuoteExactIn(
    amountIn: bigint,
    candidates: SwapRoute[]
  ): Promise<QuoteResultWithPriceImpact | undefined> {
    return this.getBestQuote(SwapType.EXACT_IN, amountIn, candidates)
  }

  /**
   * Get the best quote from a list of candidates routes for an exact output swap
   * @param amountOut The exact amount out
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  async getBestQuoteExactOut(
    amountOut: bigint,
    candidates: SwapRoute[]
  ): Promise<QuoteResultWithPriceImpact | undefined> {
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
   * Get the swap intent from a quote result
   * @param quoteResult The quote result
   * @param slippage The allowed slippage
   * @returns The swap intent
   */
  getSwapIntent(quoteResult: QuoteResult, slippage: number): SwapIntent {
    return getExchange(quoteResult.swapRoute.exchange).getSwapIntent(quoteResult, slippage)
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

    const referenceTokenIn = candidates[0].swapSteps[0].tokenIn
    const referenceTokenOut = candidates[0].swapSteps[candidates[0].swapSteps.length - 1].tokenOut

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i]

      // Ensure each candidate has at least one swap step
      if (candidate.swapSteps.length === 0) {
        throw new Error(`validateSwapRouteCandidates: candidate ${i} has no swap steps`)
      }

      const firstTokenIn = candidate.swapSteps[0].tokenIn
      const lastTokenOut = candidate.swapSteps[candidate.swapSteps.length - 1].tokenOut

      // Ensure all candidates have the same first tokenIn and last tokenOut
      if (!tokenCmp(referenceTokenIn, firstTokenIn)) {
        throw new Error(
          `validateSwapRouteCandidates: candidate ${i} has a different first tokenIn (${firstTokenIn.symbol}) than the reference (${referenceTokenIn.symbol})`
        )
      }

      if (!tokenCmp(referenceTokenOut, lastTokenOut)) {
        throw new Error(
          `validateSwapRouteCandidates: candidate ${i} has a different last tokenOut (${lastTokenOut.symbol}) than the reference (${referenceTokenOut.symbol})`
        )
      }

      // Check that the first and last tokens are different within the candidate
      if (tokenCmp(firstTokenIn, lastTokenOut)) {
        throw new Error(
          `validateSwapRouteCandidates: invalid route in candidate ${i}, first tokenIn (${firstTokenIn.symbol}) and last tokenOut (${lastTokenOut.symbol}) are the same`
        )
      }

      // Check each swap step within this candidate
      for (let j = 0; j < candidate.swapSteps.length; j++) {
        const step = candidate.swapSteps[j]

        // Each step's tokenIn and tokenOut should be different
        if (tokenCmp(step.tokenIn, step.tokenOut)) {
          throw new Error(
            `validateSwapRouteCandidates: invalid step ${j} in candidate ${i}, tokenIn (${step.tokenIn.symbol}) and tokenOut (${step.tokenOut.symbol}) are the same`
          )
        }

        // Check connection between steps within this candidate
        if (j < candidate.swapSteps.length - 1) {
          const nextStep = candidate.swapSteps[j + 1]
          if (!tokenCmp(step.tokenOut, nextStep.tokenIn)) {
            throw new Error(
              `validateSwapRouteCandidates: invalid route in candidate ${i}, step ${j} tokenOut (${step.tokenOut.symbol}) doesn't match step ${j + 1} tokenIn (${nextStep.tokenIn.symbol})`
            )
          }
        }
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
  ): Promise<QuoteResultWithPriceImpact | undefined> {
    try {
      this.validateSwapRouteCandidates(candidates)
    } catch (error: any) {
      console.error(error)
      return
    }

    const smallAmountPercentage = 1 // 1% of the regular amount
    const smallAmount = (amount * BigInt(smallAmountPercentage)) / BigInt(100)

    if (candidates.length === 1) {
      const quoteRequest: QuoteRequest = {
        swapType,
        amount,
        smallAmount,
        swapRoute: candidates[0],
      }

      const exchange = getExchange(candidates[0].exchange)
      const quotes = await exchange.getQuote(quoteRequest)

      if (!quotes) return undefined

      const { regularQuote, smallQuote } = quotes
      const fromToken = regularQuote.swapRoute.swapSteps[0].tokenIn
      const toToken = regularQuote.swapRoute.swapSteps[regularQuote.swapRoute.swapSteps.length - 1].tokenOut
      const priceImpact = calculateQuotePriceImpact(
        fromToken,
        toToken,
        regularQuote.amountIn.toString(),
        regularQuote.amountOut.toString(),
        smallQuote.amountIn.toString(),
        smallQuote.amountOut.toString()
      )
      return { ...regularQuote, priceImpact }
    }

    // Multicall when more than one candidate
    let quoteRequests: QuoteRequest[] = []
    let calls: ContractFunctionParameters[] = []

    for (const candidate of candidates) {
      const quoteRequest: QuoteRequest = {
        swapType,
        amount,
        smallAmount,
        swapRoute: candidate,
      }

      quoteRequests.push(quoteRequest)
      calls.push(...getExchange(candidate.exchange).getQuoteContractCalls(quoteRequest))
    }

    const results = await multicall(config, {
      allowFailure: true,
      contracts: calls,
    })

    let bestQuote: QuoteResult | undefined
    let bestPriceImpact: string | undefined

    for (let i = 0; i < candidates.length; i++) {
      const exchange = getExchange(candidates[i].exchange)

      const regularQuoteResult = results[i * 2]
      const smallQuoteResult = results[i * 2 + 1]

      // Check for success status and process only successful results
      if (regularQuoteResult.status !== 'success' || smallQuoteResult.status !== 'success') {
        continue
      }

      const regularQuote = exchange.getFormattedQuoteResult(quoteRequests[i], regularQuoteResult.result)
      const smallQuote = exchange.getFormattedQuoteResult(
        { ...quoteRequests[i], amount: quoteRequests[i].smallAmount },
        smallQuoteResult.result
      )

      const fromToken = regularQuote.swapRoute.swapSteps[0].tokenIn
      const toToken = regularQuote.swapRoute.swapSteps[regularQuote.swapRoute.swapSteps.length - 1].tokenOut

      const priceImpact = calculateQuotePriceImpact(
        fromToken,
        toToken,
        regularQuote.amountIn.toString(),
        regularQuote.amountOut.toString(),
        smallQuote.amountIn.toString(),
        smallQuote.amountOut.toString()
      )

      if (
        !bestQuote ||
        (swapType === SwapType.EXACT_IN
          ? regularQuote.amountOut > bestQuote.amountOut
          : regularQuote.amountIn < bestQuote.amountIn)
      ) {
        bestQuote = regularQuote
        bestPriceImpact = priceImpact
      }
    }

    return bestQuote && bestPriceImpact ? { ...bestQuote, priceImpact: bestPriceImpact } : undefined
  }
}

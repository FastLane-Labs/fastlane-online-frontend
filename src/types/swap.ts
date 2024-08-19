import { ChainId, Exchange, SwapType } from '@/constants'
import { Token } from './token'
import { UserOperation } from '@/core/operations'
import { BaselineCall } from './atlas'
import { TransactionParams } from './transactions'

export interface SwapRoute {
  chainId: ChainId
  exchange: Exchange
  swapSteps: SwapStep[]
  direction?: SwapDirection
  isFromNative: boolean
  isToNative: boolean
}

export type SwapDirection = 'buy' | 'sell'

export interface SwapStep {
  tokenIn: Token
  tokenOut: Token
  extra: any // Extra data needed for the swap (e.g. UniswapV3 pool fee)
}

export interface QuoteRequest {
  swapType: SwapType
  amount: bigint // Regular amount (in or out depending on swapType)
  smallAmount: bigint // Small amount for price impact calculation
  swapRoute: SwapRoute
}

export interface QuoteResult {
  swapType: SwapType
  amountIn: bigint
  amountOut: bigint
  amountOutMin?: bigint
  swapRoute: SwapRoute
  validUntil: number
}

export interface QuoteResults {
  regularQuote: QuoteResult
  smallQuote: QuoteResult
}

export interface QuoteResultWithPriceImpact extends QuoteResult {
  priceImpact: string
}

export interface SwapCallData {
  userOperation: UserOperation
  baselineCallData: BaselineCall
  minAmountOut: bigint
  gasSurcharge: bigint
  gasLimit: bigint
  isSigned: boolean
}

export interface SwapResult {
  transaction: TransactionParams
}

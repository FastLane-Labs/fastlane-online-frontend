import { ChainId, Exchange, SwapType } from '@/constants'
import { Token } from './token'

export interface SwapRoute {
  fromChainId?: number
  toChainId?: number
  fromTokenAddress?: string
  toTokenAddress?: string
  destinationAddress?: string
  direction?: SwapDirection
}

export type SwapDirection = 'buy' | 'sell'

export interface SwapStep {
  tokenIn: Token
  tokenOut: Token
  extra: any // Extra data needed for the swap (e.g. UniswapV3 pool fee)
}

export interface SwapRoute {
  chainId: ChainId
  exchange: Exchange
  swapSteps: SwapStep[]
}

export interface QuoteRequest {
  swapType: SwapType
  amount: bigint // in or out depending on swapType
  swapRoute: SwapRoute
}

export interface QuoteResult {
  swapType: SwapType
  amountIn: bigint
  amountOut: bigint
  swapRoute: SwapRoute
  validUntil: number
}

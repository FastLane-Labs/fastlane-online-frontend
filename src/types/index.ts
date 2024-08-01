import { ChainId, SwapType, Exchange } from '@/constants'
import { Address } from 'viem'
import { Token } from '@/types'
export * from './transactions'
export * from './swap'
export * from './config'
export * from './token'
export * from './transactions'

export interface Settings {
  slippageTolerance: number
  transactionDeadline: number
}

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

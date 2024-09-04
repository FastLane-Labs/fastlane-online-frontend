export type SwapEvent = {
  amountIn: string
  amountOut: string
  tokenIn: string
  tokenOut: string
}

export type AnalyticsEvent =
  | { type: 'VISITOR_UNIQUE' }
  | { type: 'VISITOR_CONNECTED_WALLET'; walletAddress: string }
  | { type: 'QUOTE_SHOWN'; quoteEvent: SwapEvent }
  | { type: 'SWAP_ATTEMPTED'; swapEvent: SwapEvent }
  | { type: 'SWAP_COMPLETED'; swapEvent: SwapEvent }
  | { type: 'SWAP_FAILED'; swapEvent: SwapEvent }
  | { type: 'GEOBLOCKED'; country: string }
  | { type: 'AVERAGE_SWAP_SIZE'; size: number }
  | { type: 'FUNNEL'; step: string; details?: string }
  | { type: 'SIGNATURE_FAILED' }
  | { type: 'SWAP_BOOSTED'; swapEvent: SwapEvent; boostedAmount: string }

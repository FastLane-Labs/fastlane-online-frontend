import { useMemo } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BaseSwapService } from '@/services/baseSwap'
import { SwapPathService } from '@/services/swapPath'
import { Exchange, SwapType } from '@/constants'
import { toBigInt } from '@/utils/format'
import { keys } from '@/core/queries/query-keys'
import { QuoteResult, QuoteResultWithPriceImpact, Token } from '@/types'

const getTokenIdentifier = (token: Token | null) => (token ? token : ({} as Token))
export const useBaselineQuote = (
  address: string | undefined,
  fromToken: Token | null,
  toToken: Token | null,
  swapDirection: 'buy' | 'sell',
  amount: string,
  chainId: number | undefined,
  enabled: boolean
) => {
  const baselineSwapService = useMemo(() => new BaseSwapService(), [])
  const swapPathService = useMemo(() => new SwapPathService(), [])

  const queryOptions: UseQueryOptions<QuoteResultWithPriceImpact | null, Error> = useMemo(
    () => ({
      queryKey: keys({ address }).swapQuote(
        getTokenIdentifier(fromToken),
        getTokenIdentifier(toToken),
        swapDirection,
        amount
      ),
      queryFn: async (): Promise<QuoteResultWithPriceImpact | null> => {
        if (!fromToken || !toToken || !chainId) return null

        const swapRoutes = await swapPathService.getSwapRoutes(fromToken, toToken, chainId, Exchange.UNISWAPV2)

        if (swapRoutes.length === 0) return null

        const relevantAmountBigInt = toBigInt(amount, swapDirection === 'sell' ? fromToken.decimals : toToken.decimals)

        const quoteResult =
          swapDirection === 'sell'
            ? await baselineSwapService.getBestQuoteExactIn(relevantAmountBigInt, swapRoutes)
            : await baselineSwapService.getBestQuoteExactOut(relevantAmountBigInt, swapRoutes)

        return quoteResult || null
      },
      enabled: enabled && !!fromToken && !!toToken && !!chainId && !!amount,
      refetchOnWindowFocus: true,
      refetchInterval: 20000,
      refetchIntervalInBackground: false,
      keepPreviousData: true,
    }),
    [address, fromToken, toToken, swapDirection, amount, chainId, enabled, swapPathService, baselineSwapService]
  )

  return useQuery<QuoteResultWithPriceImpact | null, Error>(queryOptions)
}

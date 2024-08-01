import { useEffect, useMemo } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useSwapContext } from '@/context/SwapContext'
import { BaseSwapService } from '@/services/baseSwap'
import { SwapPathService } from '@/services/swapPath'
import { useAccount } from 'wagmi'
import { Exchange, SwapType } from '@/constants'
import { formatBalance, toBigInt } from '@/utils/format'
import useDebounce from '@/hooks/useDebounce'
import { keys } from '@/core/queries/query-keys'
import { QuoteResult, SwapRoute, Token } from '@/types'

const getTokenIdentifier = (token: Token | null) => (token ? token : ({} as Token))
export const useBaselineQuote = (): boolean => {
  const {
    fromToken,
    fromAmount,
    toToken,
    toAmount,
    setToAmount,
    setFromAmount,
    setQuoteLoading,
    swapDirection,
    setQuote,
  } = useSwapContext()
  const { address, chainId } = useAccount()

  const debouncedAmount = useDebounce(swapDirection === 'sell' ? fromAmount : toAmount, 500)

  const baselineSwapService = useMemo(() => new BaseSwapService(), [])
  const swapPathService = useMemo(() => new SwapPathService(), [])

  const isSwapReady = useMemo(() => {
    return !!fromToken && !!toToken && !!chainId && !!debouncedAmount
  }, [fromToken, toToken, chainId, debouncedAmount])

  useEffect(() => {
    setQuoteLoading(isSwapReady)
  }, [isSwapReady, setQuoteLoading])

  // Query for swap path
  const swapPathOptions: UseQueryOptions<SwapRoute[], Error> = useMemo(
    () => ({
      queryKey: keys({ address }).swapPath(getTokenIdentifier(fromToken), getTokenIdentifier(toToken)),
      queryFn: () => {
        if (!isSwapReady) return Promise.resolve([])
        if (!fromToken || !toToken || !chainId) {
          throw new Error('Missing required parameters for swap path query')
        }
        return swapPathService.getSwapRoutes(fromToken, toToken, chainId, Exchange.UNISWAPV3)
      },
      enabled: isSwapReady,
      staleTime: Infinity,
    }),
    [address, fromToken, toToken, chainId, swapPathService, isSwapReady]
  )

  const { data: swapRoutes } = useQuery<SwapRoute[], Error>(swapPathOptions)

  // Query for swap quote
  const swapQuoteOptions: UseQueryOptions<QuoteResult | null, Error> = useMemo(
    () => ({
      queryKey: keys({ address }).swapQuote(
        getTokenIdentifier(fromToken),
        getTokenIdentifier(toToken),
        swapDirection,
        debouncedAmount
      ),
      queryFn: async (): Promise<QuoteResult | null> => {
        if (!isSwapReady || !swapRoutes || swapRoutes.length === 0 || !fromToken || !toToken) return null
        console.log('fetching quote')
        const relevantAmountBigInt = toBigInt(
          debouncedAmount,
          swapDirection === 'sell' ? fromToken.decimals : toToken.decimals
        )

        const quote =
          swapDirection === 'sell'
            ? await baselineSwapService.getBestQuoteExactIn(relevantAmountBigInt, swapRoutes)
            : await baselineSwapService.getBestQuoteExactOut(relevantAmountBigInt, swapRoutes)

        return quote || null
      },
      enabled: isSwapReady && !!swapRoutes && swapRoutes.length > 0,
      refetchOnWindowFocus: true,
      refetchInterval: 20000,
      staleTime: 20000,
      refetchIntervalInBackground: false,
      keepPreviousData: true,
    }),
    [address, fromToken, toToken, swapDirection, debouncedAmount, isSwapReady, swapRoutes, baselineSwapService]
  )

  const { data: quoteResult, isLoading: quoteLoading, error } = useQuery<QuoteResult | null, Error>(swapQuoteOptions)

  useEffect(() => {
    if (!isSwapReady) {
      setQuoteLoading(false)
    } else {
      setQuoteLoading(quoteLoading)
    }
  }, [isSwapReady, quoteLoading, setQuoteLoading])

  useEffect(() => {
    if (quoteResult && fromToken && toToken) {
      setQuote(quoteResult)
      if (swapDirection === 'sell') {
        setToAmount(formatBalance(quoteResult.amountOut, toToken.decimals))
      } else {
        setFromAmount(formatBalance(quoteResult.amountIn, fromToken.decimals))
      }
    } else if (error) {
      console.error('Error fetching quote:', error)
      setQuoteLoading(false)
      if (fromToken && toToken) {
        if (swapDirection === 'sell') {
          setToAmount(formatBalance(0n, toToken.decimals))
        } else {
          setFromAmount(formatBalance(0n, fromToken.decimals))
        }
      }
    }
  }, [quoteResult, error, fromToken, toToken, swapDirection, setToAmount, setFromAmount, setQuoteLoading])

  return quoteLoading
}

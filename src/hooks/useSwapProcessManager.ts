import { useEffect, useMemo, useCallback } from 'react'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { useAccount } from 'wagmi'
import { formatBalance } from '@/utils/format'
import useDebounce from '@/hooks/useDebounce'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useFastLaneAddresses } from './useFastLaneAddresses'
import { useAppStore } from '@/store/useAppStore'
import { useBaselineQuote } from './useBaselineQuote'
import { useSwapCallData } from './useSwapCallData'

export const useSwapProcessManager = () => {
  const {
    fromToken,
    fromAmount,
    toToken,
    toAmount,
    setToAmount,
    setFromAmount,
    setIsQuoteing,
    swapDirection,
    setQuote,
    setSwapData,
    setIsSwapDataSigned,
    isSwapping,
    isSigning,
    allowQuoteUpdate,
  } = useSwapStateContext()
  const { address, chainId } = useAccount()
  const { provider } = useEthersProviderContext()
  const { atlasAddress, dappAddress, atlasVerificationAddress } = useFastLaneAddresses()
  const { config } = useAppStore()

  const debouncedAmount = useDebounce(swapDirection === 'sell' ? fromAmount : toAmount, 500)

  // only fetch quote when the user is not isSwapping
  const isQuoteReady = useMemo(() => {
    return Boolean(fromToken && toToken && chainId && debouncedAmount && !isSwapping && !isSigning && allowQuoteUpdate)
  }, [fromToken, toToken, chainId, debouncedAmount, isSwapping, isSigning, allowQuoteUpdate])

  const {
    data: quoteResult,
    isLoading: quoteLoading,
    error: quoteError,
  } = useBaselineQuote(address, fromToken, toToken, swapDirection, debouncedAmount, chainId, isQuoteReady)

  const isReadyForCallDataGeneration = useMemo(() => {
    return Boolean(isQuoteReady && provider && atlasAddress && dappAddress && atlasVerificationAddress && quoteResult)
  }, [isQuoteReady, provider, atlasAddress, dappAddress, atlasVerificationAddress, quoteResult])

  const {
    data: swapCallData,
    isLoading: swapDataLoading,
    error: swapDataError,
  } = useSwapCallData(
    address,
    fromToken,
    toToken,
    swapDirection,
    debouncedAmount,
    quoteResult,
    isReadyForCallDataGeneration,
    provider,
    atlasAddress,
    dappAddress,
    atlasVerificationAddress,
    config,
    chainId
  )

  const updateQuoteLoading = useCallback(() => {
    setIsQuoteing(isQuoteReady && quoteLoading)
  }, [isQuoteReady, quoteLoading, setIsQuoteing])

  const updateQuoteResult = useCallback(() => {
    if (quoteResult && fromToken && toToken) {
      setQuote(quoteResult)
      if (swapDirection === 'sell') {
        setToAmount(formatBalance(quoteResult.amountOut, toToken.decimals))
      } else {
        setFromAmount(formatBalance(quoteResult.amountIn, fromToken.decimals))
      }
    } else if (quoteError) {
      console.error('Error fetching quote:', quoteError)
      setIsQuoteing(false)
      if (fromToken && toToken) {
        if (swapDirection === 'sell') {
          setToAmount(formatBalance(0n, toToken.decimals))
        } else {
          setFromAmount(formatBalance(0n, fromToken.decimals))
        }
      }
    }
  }, [quoteResult, quoteError, fromToken, toToken, swapDirection, setToAmount, setFromAmount, setIsQuoteing, setQuote])

  const updateSwapData = useCallback(() => {
    if (swapCallData) {
      setSwapData(swapCallData)
      setIsSwapDataSigned(false)
    } else if (swapDataError) {
      console.error('Error generating swap data:', swapDataError)
      setSwapData(null)
      setIsSwapDataSigned(false)
    }
  }, [swapCallData, swapDataError, setSwapData, setIsSwapDataSigned])

  useEffect(() => {
    updateQuoteLoading()
  }, [updateQuoteLoading])

  useEffect(() => {
    updateQuoteResult()
  }, [updateQuoteResult])

  useEffect(() => {
    updateSwapData()
  }, [updateSwapData])

  return {
    quoteLoading,
    swapDataLoading,
    quoteError,
    swapDataError,
  }
}

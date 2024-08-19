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
import { useExecutionEnvironment } from './useExecutionEnvironment'
import { Address } from 'viem'

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
    isSwapping,
    isSigning,
    allowQuoteUpdate,
    discardNextQuoteUpdate,
    setDiscardNextQuoteUpdate,
  } = useSwapStateContext()
  const { address, chainId } = useAccount()
  const { provider } = useEthersProviderContext()
  const { atlasAddress, dappAddress, atlasVerificationAddress } = useFastLaneAddresses()
  const { config } = useAppStore()
  const { data: executionEnvironment } = useExecutionEnvironment({
    atlasAddress: atlasAddress as Address,
    userAddress: address as Address,
    dAppControlAddress: dappAddress as Address,
  })

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
    executionEnvironment as Address,
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
      if (discardNextQuoteUpdate) {
        // Discard this update and reset the flag
        setDiscardNextQuoteUpdate(false)
        // Reset quote and amounts
        setQuote(null)
        if (swapDirection === 'sell') {
          setToAmount('')
        } else {
          setFromAmount('')
        }
      } else {
        // Process the quote normally
        setQuote(quoteResult)
        if (swapDirection === 'sell') {
          setToAmount(formatBalance(quoteResult.amountOut, toToken.decimals))
        } else {
          setFromAmount(formatBalance(quoteResult.amountIn, fromToken.decimals))
        }
      }
    } else if (quoteError) {
      console.error('Error fetching quote:', quoteError)
      setIsQuoteing(false)
      setQuote(null)
      if (fromToken && toToken) {
        if (swapDirection === 'sell') {
          setToAmount('')
        } else {
          setFromAmount('')
        }
      }
    }
    // We don't reset discardNextQuoteUpdate here, as it's only reset when actually discarding a quote
  }, [
    quoteResult,
    quoteError,
    fromToken,
    toToken,
    swapDirection,
    setToAmount,
    setFromAmount,
    setIsQuoteing,
    setQuote,
    discardNextQuoteUpdate,
    setDiscardNextQuoteUpdate,
  ])

  const updateSwapData = useCallback(() => {
    if (swapCallData) {
      setSwapData(swapCallData)
    } else if (swapDataError) {
      console.error('Error generating swap data:', swapDataError)
      setSwapData(null)
    }
  }, [swapCallData, swapDataError, setSwapData])

  useEffect(() => {
    updateQuoteLoading()
  }, [updateQuoteLoading, swapDataLoading])

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

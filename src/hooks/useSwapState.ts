import { useState, useEffect, useCallback } from 'react'
import { QuoteResult, SwapDirection, Token } from '@/types'
import { useCurrentTokenList } from './useTokenList'
import { useAccount } from 'wagmi'
import { toBigInt } from '@/utils/format'
import { useFastLaneAddresses } from './useFastLaneAddresses'
import useDebounce from '@/hooks/useDebounce'
import { useAllowanceManager } from './useAllowanceManager'

export interface SwapState {
  // Token and Amount States
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string

  // Quote States
  quote: QuoteResult | null
  quoteLoading: boolean

  // Allowance States
  allowance: bigint
  sufficientAllowance: boolean
  allowanceLoading: boolean

  // Swap Direction
  swapDirection: SwapDirection

  // Swap Data
  swapData: any | null

  // State Setters
  setSwapDirection: (direction: SwapDirection) => void
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setQuote: (quote: QuoteResult | null) => void
  setQuoteLoading: (loading: boolean) => void
  setSufficientAllowance: (sufficientAllowance: boolean) => void
  setSwapData: (data: any | null) => void

  // Actions
  swapTokens: () => void
  resetSelections: () => void
  updateAllowance: () => Promise<void>
}

export const useSwapState = (): SwapState => {
  const { chainId } = useAccount()
  const { tokens } = useCurrentTokenList()

  const [defaultToken, setDefaultToken] = useState<Token | null>(
    tokens.find((token) => token.tags?.includes('default')) as Token
  )

  const [fromToken, setFromToken] = useState<Token | null>(defaultToken)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [swapDirection, setSwapDirection] = useState<SwapDirection>('sell')
  const [quote, setQuote] = useState<QuoteResult | null>(null)
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)
  const [allowance, setAllowance] = useState<bigint>(BigInt(0))
  const [sufficientAllowance, setSufficientAllowance] = useState<boolean>(false)
  const [allowanceLoading, setAllowanceLoading] = useState<boolean>(false)
  const [swapData, setSwapData] = useState<any | null>(null)

  const { address: userAddress } = useAccount()
  const { dappAddress: spenderAddress } = useFastLaneAddresses()
  const { checkAllowance, updateAllowance: updateAllowanceManager, isSufficientAllowance } = useAllowanceManager()

  const debouncedFromAmount = useDebounce(fromAmount, 500) // 500ms delay
  const debouncedToAmount = useDebounce(toAmount, 500) // 500ms delay

  const checkCurrentAllowance = useCallback(async () => {
    if (fromToken && userAddress && spenderAddress) {
      setAllowanceLoading(true)
      const currentAllowance = await checkAllowance(fromToken, userAddress, spenderAddress)
      setAllowance(currentAllowance)
      setSufficientAllowance(
        isSufficientAllowance(fromToken, userAddress, spenderAddress, toBigInt(debouncedFromAmount, fromToken.decimals))
      )
      setAllowanceLoading(false)
    }
  }, [fromToken, userAddress, spenderAddress, debouncedFromAmount, checkAllowance, isSufficientAllowance])

  const updateAllowance = useCallback(async () => {
    if (fromToken && spenderAddress) {
      setAllowanceLoading(true)
      const success = await updateAllowanceManager(
        fromToken,
        spenderAddress,
        toBigInt(debouncedFromAmount, fromToken.decimals)
      )
      if (success) {
        await checkCurrentAllowance()
      }
      setAllowanceLoading(false)
    }
  }, [fromToken, spenderAddress, debouncedFromAmount, updateAllowanceManager, checkCurrentAllowance])

  const resetSelections = useCallback(() => {
    setFromToken(null)
    setToToken(null)
    setFromAmount('')
    setToAmount('')
    setQuote(null)
    setAllowance(BigInt(0))
    setSufficientAllowance(false)
    setSwapData(null)
  }, [])

  useEffect(() => {
    if (chainId && tokens.length > 0) {
      resetSelections()
      setDefaultToken(tokens.find((token) => token.tags?.includes('default')) as Token)
      setFromToken(defaultToken)
    }
  }, [chainId, tokens, defaultToken, resetSelections])

  useEffect(() => {
    checkCurrentAllowance()
  }, [checkCurrentAllowance])

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    setSwapData(null)
  }, [fromToken, toToken, fromAmount, toAmount])

  useEffect(() => {
    resetSelections()
  }, [chainId, resetSelections])

  useEffect(() => {
    if (fromToken && userAddress) {
      checkCurrentAllowance()
    }
  }, [fromToken, debouncedFromAmount, userAddress, checkCurrentAllowance])

  useEffect(() => {
    setSwapData(null)
  }, [fromToken, toToken, fromAmount, toAmount, swapDirection])

  return {
    // Token and Amount States
    fromToken,
    toToken,
    fromAmount,
    toAmount,

    // Quote States
    quote,
    quoteLoading,

    // Allowance States
    allowance,
    sufficientAllowance,
    allowanceLoading,

    // Swap Direction
    swapDirection,

    // Swap Data
    swapData,

    // State Setters
    setSwapDirection,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setQuote,
    setQuoteLoading,
    setSufficientAllowance,
    setSwapData,

    // Actions
    swapTokens: handleSwapTokens,
    resetSelections,
    updateAllowance,
  }
}

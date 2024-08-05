import { useState, useEffect, useCallback, useMemo } from 'react'
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

  // Swap Direction
  swapDirection: SwapDirection

  // Swap Data
  swapData: any | null

  // Allowance State
  hasSufficientAllowance: boolean

  // State Setters
  setSwapDirection: (direction: SwapDirection) => void
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setQuote: (quote: QuoteResult | null) => void
  setQuoteLoading: (loading: boolean) => void
  setSwapData: (data: any | null) => void

  // Actions
  swapTokens: () => void
  resetSelections: () => void

  // Allowance functions (from useAllowanceManager)
  checkAllowance: (token: Token, userAddress: string, spenderAddress: string) => Promise<bigint>
  updateAllowance: (token: Token, spenderAddress: string, amount: bigint) => Promise<boolean>
  isSufficientAllowance: (token: Token, userAddress: string, spenderAddress: string, requiredAmount: bigint) => boolean
  allowances: Record<string, bigint>
  allowanceLoading: Record<string, boolean>
  allowanceError: Record<string, Error | null>
}

export const useSwapState = (): SwapState => {
  const { chainId } = useAccount()
  const { tokens } = useCurrentTokenList()
  const { address: userAddress } = useAccount()
  const { dappAddress: spenderAddress } = useFastLaneAddresses()
  const allowanceManager = useAllowanceManager()

  const defaultToken = useMemo(() => tokens.find((token) => token.tags?.includes('default')) as Token | null, [tokens])

  const [fromToken, setFromToken] = useState<Token | null>(() => defaultToken)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [swapDirection, setSwapDirection] = useState<SwapDirection>('sell')
  const [quote, setQuote] = useState<QuoteResult | null>(null)
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)
  const [swapData, setSwapData] = useState<any | null>(null)

  const debouncedFromAmount = useDebounce(fromAmount, 500) // 500ms delay
  const debouncedToAmount = useDebounce(toAmount, 500) // 500ms delay

  const hasSufficientAllowance = useMemo(() => {
    if (!fromToken || !userAddress || !spenderAddress || !debouncedFromAmount) {
      return false
    }
    const requiredAmount = toBigInt(debouncedFromAmount, fromToken.decimals)
    return allowanceManager.isSufficientAllowance(fromToken, userAddress, spenderAddress, requiredAmount)
  }, [fromToken, userAddress, spenderAddress, debouncedFromAmount, allowanceManager.isSufficientAllowance])

  const resetSelections = useCallback(() => {
    setFromToken(defaultToken)
    setToToken(null)
    setFromAmount('')
    setToAmount('')
    setQuote(null)
    setSwapData(null)
  }, [defaultToken])

  useEffect(() => {
    if (chainId && tokens.length > 0) {
      resetSelections()
    }
  }, [chainId, tokens, resetSelections])

  const checkAllowance = useCallback(() => {
    if (fromToken && userAddress && spenderAddress && debouncedFromAmount) {
      allowanceManager.checkAllowance(fromToken, userAddress, spenderAddress)
    }
  }, [fromToken, userAddress, spenderAddress, debouncedFromAmount, allowanceManager.checkAllowance])

  useEffect(() => {
    checkAllowance()
  }, [checkAllowance])

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    setSwapData(null)
  }, [fromToken, toToken, fromAmount, toAmount])

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

    // Swap Direction
    swapDirection,

    // Swap Data
    swapData,

    // Allowance State
    hasSufficientAllowance,

    // State Setters
    setSwapDirection,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setQuote,
    setQuoteLoading,
    setSwapData,

    // Actions
    swapTokens: handleSwapTokens,
    resetSelections,

    // Allowance functions (from useAllowanceManager)
    checkAllowance: allowanceManager.checkAllowance,
    updateAllowance: allowanceManager.updateAllowance,
    isSufficientAllowance: allowanceManager.isSufficientAllowance,
    allowances: allowanceManager.allowances,
    allowanceLoading: allowanceManager.loading,
    allowanceError: allowanceManager.error,
  }
}

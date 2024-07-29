import { useState, useEffect, useCallback } from 'react'
import { useChainId } from 'wagmi'
import { Token } from '@/types'
import { useCurrentTokenList } from './useTokenList'

interface SwapState {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  quote: any
  quoteLoading: boolean
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setQuote: (quote: any) => void
  setQuoteLoading: (loading: boolean) => void
  swapTokens: () => void
  resetSelections: () => void
}

// useSwapContext over useSwap
export const useSwap = (): SwapState => {
  const chainId = useChainId()
  const tokens = useCurrentTokenList()
  const defaultToken = tokens.find((token) => token.tags?.includes('default')) as Token
  const [fromToken, setFromToken] = useState<Token | null>(defaultToken)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [quote, setQuote] = useState<any>(null)
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }, [fromToken, toToken, fromAmount, toAmount])

  const resetSelections = useCallback(() => {
    setFromToken(null)
    setToToken(null)
    setFromAmount('')
    setToAmount('')
    setQuote(null)
  }, [])

  useEffect(() => {
    resetSelections()
  }, [chainId, resetSelections])

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    quote,
    quoteLoading,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setQuote,
    setQuoteLoading,
    swapTokens: handleSwapTokens,
    resetSelections,
  }
}

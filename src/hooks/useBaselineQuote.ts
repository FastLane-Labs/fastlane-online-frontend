import { useState, useEffect, useCallback } from 'react'
import { useSwapContext } from '@/context/SwapContext'

export const useBaselineQuote = () => {
  const { fromToken, fromAmount, toToken, setToAmount, setQuoteLoading } = useSwapContext()
  const [isQuoteLoading, setIsQuoteLoading] = useState(false)

  const fetchQuote = useCallback(async () => {
    if (!fromToken || !fromAmount || !toToken) return

    setIsQuoteLoading(true)
    setQuoteLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setToAmount('100') // Dummy value, replace with actual quote logic
    } catch (error) {
      console.error('Fetching quote failed', error)
    } finally {
      setIsQuoteLoading(false)
      setQuoteLoading(false)
    }
  }, [fromToken, fromAmount, toToken, setToAmount, setQuoteLoading])

  useEffect(() => {
    fetchQuote()
  }, [fromToken, fromAmount, toToken, fetchQuote])

  return { isQuoteLoading }
}

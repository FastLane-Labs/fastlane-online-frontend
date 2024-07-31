import { useState, useEffect } from 'react'
import { TokenProvider } from '@/providers/StaticTokenListProvider'
import { Token } from '@/types'
import { useAccount } from 'wagmi'

export const useTokenList = (chainId: number) => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchTokens = async () => {
      try {
        setLoading(true)
        setError(null)
        const tokenList = await TokenProvider.getTokensByChainId(chainId)
        if (isMounted) {
          setTokens(tokenList)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred while fetching tokens'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTokens()

    return () => {
      isMounted = false
    }
  }, [chainId])

  return { tokens, loading, error }
}

export const useCurrentTokenList = () => {
  const { chainId } = useAccount()
  const [tokens, setTokens] = useState<Token[]>([])
  const { tokens: fetchedTokens, loading, error } = useTokenList(chainId!)

  useEffect(() => {
    if (chainId !== undefined) {
      setTokens(fetchedTokens)
    } else {
      setTokens([])
    }
  }, [chainId, fetchedTokens])
  return { tokens, loading, error }
}

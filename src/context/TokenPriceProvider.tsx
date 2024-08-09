'use client'

import { TokenPriceService } from '@/services/tokenPrice'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { createContext, useContext, useEffect, useRef, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { ChainId, TOKEN_ADDRESSES } from '@/constants'
import { keys } from '@/core/queries/query-keys'

const TokenPriceContext = createContext<TokenPriceService | null>(null)

export const TokenPriceProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const tokenPriceService = useMemo(() => new TokenPriceService(), [])
  const { address, chainId } = useAccount()
  const queryClient = useQueryClient()
  const updateInterval = useRef<NodeJS.Timeout | null>(null)

  const { data: tokens } = useQuery({
    queryKey: keys({ address }).all,
    queryFn: () => tokenPriceService.getTokens(chainId!),
    enabled: !!chainId,
  })

  const updatePrices = useCallback(async () => {
    if (!tokens || !chainId) return

    const usdcToken = tokens.find((token) => token.address === TOKEN_ADDRESSES[chainId as ChainId].usdc)
    if (!usdcToken) {
      console.error('USDC token not found')
      return
    }

    // Update prices for popular tokens excluding USDC
    const tokensToUpdate = tokens
      .filter((token) => token.address !== TOKEN_ADDRESSES[chainId as ChainId].usdc)
      .filter((token) => token.tags?.includes('popular'))

    for (const token of tokensToUpdate) {
      try {
        const price = await tokenPriceService.getUsdPriceForToken(usdcToken, token)
        queryClient.setQueryData(keys({ address }).tokenPrice(token), { price, lastUpdated: Date.now() })
      } catch (error) {
        console.error(`Failed to update price for ${token.symbol}:`, error)
      }
    }
  }, [tokens, chainId, address, tokenPriceService, queryClient])

  useEffect(() => {
    if (tokens && chainId) {
      updatePrices()
      updateInterval.current = setInterval(updatePrices, 3 * 60 * 1000) // Update every 3 minutes
    }

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current)
      }
    }
  }, [tokens, chainId, updatePrices])

  return <TokenPriceContext.Provider value={tokenPriceService}>{children}</TokenPriceContext.Provider>
}

export const useTokenPriceService = () => {
  const context = useContext(TokenPriceContext)
  if (!context) {
    throw new Error('useTokenPriceService must be used within a TokenPriceProvider')
  }
  return context
}

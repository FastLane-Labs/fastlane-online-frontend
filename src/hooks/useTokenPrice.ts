import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Token } from '@/types'
import { keys } from '@/core/queries/query-keys'
import { useAccount } from 'wagmi'
import { TokenPriceService } from '@/services/tokenPrice'
import { TOKEN_ADDRESSES } from '@/constants'

type TokenPriceData = { price: number; lastUpdated: number } | null

export const useTokenUsdPrice = (token: Token | null) => {
  const { address, chainId } = useAccount()
  const queryClient = useQueryClient()
  const tokenPriceService = new TokenPriceService()

  return useQuery({
    queryKey: token ? keys({ address }).tokenPrice(token) : [],
    queryFn: async (): Promise<TokenPriceData> => {
      if (!token || !chainId) return null

      // Check if the token is USDC
      if (token.address.toLowerCase() === TOKEN_ADDRESSES[chainId].usdc.toLowerCase()) {
        return { price: 1, lastUpdated: Date.now() }
      }

      const cachedData = queryClient.getQueryData<TokenPriceData>(keys({ address }).tokenPrice(token))

      if (cachedData && Date.now() - cachedData.lastUpdated < 3 * 60 * 1000) {
        return cachedData
      }

      // If cache is stale or doesn't exist, fetch new price
      try {
        const usdcToken = await tokenPriceService.getTokenByAddress(TOKEN_ADDRESSES[chainId].usdc, chainId)
        if (!usdcToken) throw new Error('USDC token not found')

        const price = await tokenPriceService.getUsdPriceForToken(usdcToken, token)

        if (price === null) {
          console.warn(`Received null price for ${token.symbol}`)
          return cachedData // Return cached data if available, otherwise null
        }

        const newData = { price, lastUpdated: Date.now() }

        // Update cache with new data
        queryClient.setQueryData(keys({ address }).tokenPrice(token), newData)

        return newData
      } catch (error) {
        console.error(`Failed to fetch price for ${token.symbol}:`, error)
        // If fetch fails, return cached data if available, otherwise null
        return cachedData
      }
    },
    enabled: !!token && !!chainId,
    staleTime: 3 * 60 * 1000, // Consider data stale after 3 minutes
    select: (data: TokenPriceData) => data?.price ?? null,
  })
}

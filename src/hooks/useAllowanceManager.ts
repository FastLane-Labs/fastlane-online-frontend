import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { fetchErc20Allowance } from '@/utils/fetchErc20Allowance'
import { approveErc20Token } from '@/utils/approveErc20Token'
import { Token } from '@/types'
import { nativeEvmTokenAddress } from '@/constants'
import { ethers } from 'ethers'
import { keys } from '@/core/queries/query-keys'

export const useAllowanceManager = () => {
  const { provider, signer } = useEthersProviderContext()
  const queryClient = useQueryClient()

  const checkAllowance = useCallback(
    async (token: Token, userAddress: string, spenderAddress: string): Promise<bigint> => {
      if (!provider || !token || !userAddress || !spenderAddress) return 0n

      const queryKey = keys({ address: userAddress }).allowance(token.address, userAddress, spenderAddress)

      if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        return BigInt(ethers.MaxUint256.toString())
      }

      const allowance = await queryClient.fetchQuery({
        queryKey,
        queryFn: () => fetchErc20Allowance(provider, token.address, userAddress, spenderAddress),
        staleTime: 30000, // Consider data stale after 30 seconds
      })

      return allowance
    },
    [provider, queryClient]
  )

  const updateAllowance = useCallback(
    async (token: Token, spenderAddress: string, amount: bigint): Promise<boolean> => {
      if (!signer || token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        return false
      }

      try {
        await approveErc20Token(signer, token.address, spenderAddress, amount, true)
        const userAddress = await signer.getAddress()

        // Invalidate the query to trigger a refetch
        await queryClient.invalidateQueries({
          queryKey: keys({ address: userAddress }).allowance(token.address, userAddress, spenderAddress),
        })

        return true
      } catch (error) {
        console.error('Error updating allowance:', error)
        return false
      }
    },
    [signer, queryClient]
  )

  const isSufficientAllowance = useCallback(
    async (token: Token, userAddress: string, spenderAddress: string, requiredAmount: bigint): Promise<boolean> => {
      if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        return true
      }

      const allowance = await checkAllowance(token, userAddress, spenderAddress)
      return allowance >= requiredAmount
    },
    [checkAllowance]
  )

  return {
    checkAllowance,
    updateAllowance,
    isSufficientAllowance,
  }
}

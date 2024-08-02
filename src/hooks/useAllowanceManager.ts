// hooks/useAllowanceManager.ts
import { useState, useCallback } from 'react'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { fetchErc20Allowance } from '@/utils/fetchErc20Allowance'
import { approveErc20Token } from '@/utils/approveErc20Token'
import { Token } from '@/types'
import { nativeEvmTokenAddress } from '@/constants'
import { ethers } from 'ethers'

export const useAllowanceManager = () => {
  const { provider, signer } = useEthersProviderContext()
  const [allowances, setAllowances] = useState<Record<string, bigint>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<Record<string, Error | null>>({})

  const checkAllowance = useCallback(
    async (token: Token, userAddress: string, spenderAddress: string) => {
      if (!token || !userAddress || !spenderAddress || !provider) {
        return 0n
      }

      const key = `${token.address}-${userAddress}-${spenderAddress}`
      setLoading((prev) => ({ ...prev, [key]: true }))
      setError((prev) => ({ ...prev, [key]: null }))

      try {
        if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
          return BigInt(ethers.MaxUint256.toString())
        } else {
          const result = await fetchErc20Allowance(provider, token.address, userAddress, spenderAddress)
          setAllowances((prev) => ({ ...prev, [key]: result }))
          return result
        }
      } catch (err) {
        console.error('Error checking allowance:', err)
        setError((prev) => ({ ...prev, [key]: err instanceof Error ? err : new Error('Unknown error occurred') }))
        return 0n
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }))
      }
    },
    [provider]
  )

  const updateAllowance = useCallback(
    async (token: Token, spenderAddress: string, amount: bigint) => {
      if (!signer || !token || token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        return false
      }

      try {
        await approveErc20Token(signer, token.address, spenderAddress, amount, true)
        const userAddress = await signer.getAddress()
        await checkAllowance(token, userAddress, spenderAddress)
        return true
      } catch (error) {
        console.error('Error updating allowance:', error)
        return false
      }
    },
    [signer, checkAllowance]
  )

  const isSufficientAllowance = useCallback(
    (token: Token, userAddress: string, spenderAddress: string, requiredAmount: bigint) => {
      if (!token || token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        return true
      }

      const key = `${token.address}-${userAddress}-${spenderAddress}`
      return allowances[key] >= requiredAmount
    },
    [allowances]
  )

  return {
    checkAllowance,
    updateAllowance,
    isSufficientAllowance,
    allowances,
    loading,
    error,
  }
}

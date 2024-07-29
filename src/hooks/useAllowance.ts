import { useState, useEffect, useCallback } from 'react'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { fetchErc20Allowance } from '@/utils/fetchErc20Allowance'
import { Token } from '@/types'
import { nativeEvmTokenAddress } from '@/constants'
import { ethers } from 'ethers'

type UseAllowanceParams = {
  token?: Token | null
  userAddress: string
  spenderAddress: string
  requiredAmount: bigint
}

const useAllowance = ({ token, userAddress, spenderAddress, requiredAmount }: UseAllowanceParams) => {
  const { provider } = useEthersProviderContext()
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const checkAllowance = useCallback(async () => {
    if (!token || !userAddress || !spenderAddress || !provider) {
      setAllowance(0n)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        setAllowance(BigInt(ethers.MaxUint256.toString()))
      } else {
        const result = await fetchErc20Allowance(provider, token.address, userAddress, spenderAddress)
        setAllowance(result)
      }
    } catch (err) {
      console.error('Error checking allowance:', err)
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
    } finally {
      setLoading(false)
    }
  }, [token, userAddress, spenderAddress, provider])

  useEffect(() => {
    checkAllowance()
  }, [checkAllowance])

  const sufficientAllowance =
    !token || token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase() || allowance >= requiredAmount

  return { allowance, loading, error, sufficientAllowance, refetch: checkAllowance }
}

export default useAllowance

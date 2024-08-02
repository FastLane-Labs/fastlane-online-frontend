import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { keys } from '@/core/queries/query-keys'
import { nativeEvmTokenAddress } from '@/constants'
import { Token } from '@/types'
import { ierc20Abi } from '@/abis'

type UseBalanceParams = {
  token?: Token
  userAddress: string
  enabled?: boolean
}

const createBalanceQueryOptions = ({
  provider,
  token,
  userAddress,
  enabled = true,
}: UseBalanceParams & { provider: ethers.AbstractProvider | null }): UseQueryOptions<bigint, Error> => {
  const queryKey = keys({ address: userAddress }).balance(token?.chainId, token?.address, userAddress)

  const queryFn = async (): Promise<bigint> => {
    if (!provider || !userAddress || !token) return BigInt(0)

    if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
      const balance = await provider.getBalance(userAddress)
      return BigInt(balance.toString())
    } else {
      const contract = new ethers.Contract(token.address, ierc20Abi, provider)
      try {
        const balance = await contract.balanceOf(userAddress)
        return BigInt(balance.toString())
      } catch {
        return 0n
      }
    }
  }

  return {
    queryKey,
    queryFn,
    enabled: !!userAddress && enabled,
    refetchInterval: 20000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    retry: 2,
  }
}

export const useBalance = (params: UseBalanceParams): UseQueryResult<bigint, Error> => {
  const { provider } = useEthersProviderContext()
  const options = createBalanceQueryOptions({ ...params, provider })
  return useQuery<bigint, Error>(options)
}

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { keys } from '@/core/queries/query-keys'
import { nativeEvmTokenAddress } from '@/constants'
import { Token } from '@/types'

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
]

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
}: UseBalanceParams & { provider: ethers.AbstractProvider }): UseQueryOptions<string, Error> => {
  const queryKey = keys({ address: userAddress }).balance(token?.chainId, token?.address, userAddress)

  const queryFn = async (): Promise<string> => {
    if (!userAddress || !token) return '0.0'

    if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
      const balance = await provider.getBalance(userAddress)
      return ethers.formatUnits(balance, token?.decimals)
    } else {
      const contract = new ethers.Contract(token.address, ERC20_ABI, provider)
      try {
        const balance = await contract.balanceOf(userAddress)
        return ethers.formatUnits(balance, token.decimals)
      } catch {
        return '0.0'
      }
    }
  }

  return {
    queryKey,
    queryFn,
    enabled: !!userAddress && enabled,
    refetchInterval: 15000,
    retry: 2,
  }
}

export const useBalance = (params: UseBalanceParams): UseQueryResult<string, Error> => {
  const provider = useEthersProviderContext()
  const options = createBalanceQueryOptions({ ...params, provider })
  return useQuery<string, Error>(options)
}

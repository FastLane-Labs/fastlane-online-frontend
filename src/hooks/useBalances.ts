import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { BigNumberish, ethers } from 'ethers'
import { useMulticallProvider, multiCall } from '@/hooks/useMulticallProvider'
import { Token } from '@/types'
import { nativeEvmTokenAddress } from '@/constants'
import { keys } from '@/core/queries/query-keys'
import { ierc20Abi } from '@/abis'

type UseBalancesParams = {
  tokens: Token[]
  userAddress: string
  enabled?: boolean
}

const fetchBalances = async (
  tokens: Token[],
  userAddress: string,
  multicallProvider: ethers.AbstractProvider | null
): Promise<bigint[]> => {
  if (!multicallProvider) {
    return tokens.map(() => 0n)
  }

  const calls = tokens.map((token) => {
    if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
      return multicallProvider
        .getBalance(userAddress)
        .then((balance) => BigInt(balance.toString())) // return balance as BigInt
        .catch(() => {
          return 0n
        })
    } else {
      const contract = new ethers.Contract(token.address, ierc20Abi, multicallProvider)
      return contract
        .balanceOf(userAddress)
        .then((balance: BigNumberish) => BigInt(balance.toString())) // return balance as BigInt
        .catch(() => {
          return 0n
        })
    }
  })

  return await multiCall(calls, multicallProvider)
}

export const useBalances = ({
  tokens,
  userAddress,
  enabled = true,
}: UseBalancesParams): UseQueryResult<bigint[], Error> => {
  const multicallProvider = useMulticallProvider()

  const queryKey = keys({ address: userAddress }).balances()

  return useQuery<bigint[], Error>({
    queryKey,
    queryFn: () => fetchBalances(tokens, userAddress, multicallProvider),
    enabled: !!userAddress && enabled,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    retry: 2,
  })
}

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { BigNumberish, ethers } from 'ethers'
import { useMulticallProvider, multiCall } from '@/hooks/useMulticallProvider'
import { Token } from '@/types'
import { nativeEvmTokenAddress } from '@/constants'
import { keys } from '@/core/queries/query-keys'

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
]

type UseBalancesParams = {
  tokens: Token[]
  userAddress: string
  enabled?: boolean
}

const fetchBalances = async (
  tokens: Token[],
  userAddress: string,
  multicallProvider: ethers.AbstractProvider
): Promise<string[]> => {
  const calls = tokens.map((token) => {
    if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
      return multicallProvider.getBalance(userAddress).then((balance) => ethers.formatUnits(balance, token.decimals))
    } else {
      const contract = new ethers.Contract(token.address, ERC20_ABI, multicallProvider)
      return contract
        .balanceOf(userAddress)
        .then((balance: BigNumberish) => ethers.formatUnits(balance, token.decimals))
    }
  })

  return await multiCall(calls, multicallProvider)
}

export const useBalances = ({
  tokens,
  userAddress,
  enabled = true,
}: UseBalancesParams): UseQueryResult<string[], Error> => {
  const multicallProvider = useMulticallProvider()

  const queryKey = keys({ address: userAddress }).balances()

  return useQuery<string[], Error>({
    queryKey,
    queryFn: () => fetchBalances(tokens, userAddress, multicallProvider),
    enabled: !!userAddress && enabled,
    refetchInterval: 15000,
    retry: 2,
  })
}

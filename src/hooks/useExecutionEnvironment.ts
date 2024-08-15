import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { keys } from '@/core/queries/query-keys'
import { atlasAbi } from '@/abis'
import { Address } from 'viem'

type UseExecutionEnvironmentParams = {
  atlasAddress: Address
  userAddress: Address
  dAppControlAddress: Address
  enabled?: boolean
}

const createExecutionEnvironmentQueryOptions = ({
  provider,
  atlasAddress,
  userAddress,
  dAppControlAddress,
  enabled = true,
}: UseExecutionEnvironmentParams & { provider: ethers.AbstractProvider | null }): UseQueryOptions<Address, Error> => {
  const queryKey = keys({ address: userAddress }).executionEnvironment(atlasAddress, userAddress, dAppControlAddress)

  const queryFn = async (): Promise<Address> => {
    if (!provider || !atlasAddress || !userAddress || !dAppControlAddress) {
      throw new Error('Missing required parameters')
    }

    const atlas = new ethers.Contract(atlasAddress, atlasAbi, provider)
    const [executionEnvironment, ,] = await atlas
      .getExecutionEnvironment(userAddress, dAppControlAddress)
      .catch((error: Error) => {
        console.error('Error getting execution environment:', error)
        throw error
      })

    return executionEnvironment as Address
  }

  return {
    queryKey,
    queryFn,
    enabled: !!atlasAddress && !!userAddress && !!dAppControlAddress && enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    retry: 2,
  }
}

export const useExecutionEnvironment = (params: UseExecutionEnvironmentParams): UseQueryResult<Address, Error> => {
  const { provider } = useEthersProviderContext()
  const options = createExecutionEnvironmentQueryOptions({ ...params, provider })
  return useQuery<Address, Error>(options)
}

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { keys } from '@/core/queries/query-keys'
import { useFastLaneAddresses } from '@/hooks/useFastLaneAddresses'
import { getExecutionEnvironment } from '@/core/atlas'
import { Address } from 'viem'

type UseExecutionEnvParams = {
  userAddress: string
  enabled?: boolean
}

const createExecutionEnvQueryOptions = ({
  provider,
  userAddress,
  atlasAddress,
  dappAddress,
  enabled = true,
}: UseExecutionEnvParams & {
  provider: ethers.Provider | null
  atlasAddress: string | null
  dappAddress: string | null
}): UseQueryOptions<string, Error> => {
  const queryKey = keys({ address: userAddress }).executionEnv(userAddress)

  const queryFn = async (): Promise<string> => {
    if (!provider || !atlasAddress || !dappAddress || !userAddress) {
      return ''
    }
    return getExecutionEnvironment(
      atlasAddress as Address,
      userAddress as Address,
      dappAddress as Address,
      provider as ethers.AbstractProvider
    )
  }

  return {
    queryKey,
    queryFn,
    enabled: !!userAddress && enabled && !!provider && !!atlasAddress && !!dappAddress,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    retry: 2,
  }
}

export const useExecutionEnv = (userAddress: string): UseQueryResult<string, Error> => {
  const { provider } = useEthersProviderContext()
  const { atlasAddress, dappAddress } = useFastLaneAddresses()
  const options = createExecutionEnvQueryOptions({ userAddress, provider, atlasAddress, dappAddress })
  return useQuery<string, Error>(options)
}

import { ethers } from 'ethers'
import { MulticallWrapper } from 'ethers-multicall-provider'
import { useEthersProviderContext } from '@/context/EthersProviderContext'

export const useMulticallProvider = () => {
  const { provider } = useEthersProviderContext()

  if (!provider) {
    return null
  }

  const multicallProvider = MulticallWrapper.wrap(provider)
  return multicallProvider
}

export const multiCall = async (calls: Array<Promise<any>>, multicallProvider: ethers.AbstractProvider) => {
  if (MulticallWrapper.isMulticallProvider(multicallProvider)) {
    // Calls performed simultaneously are automatically batched
    return Promise.all(calls)
  } else {
    throw new Error('Provided provider is not a multicall provider')
  }
}

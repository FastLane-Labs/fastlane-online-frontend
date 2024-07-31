import { SUPPORTED_CHAIN_IDS } from '@/constants'
import { getDappAddress } from '@/utils/getContractAddress'
import { useAccount } from 'wagmi'

export const useFastLaneOnline = () => {
  const { chainId } = useAccount()

  const fastlaneOnlineAddress = () => {
    const isSupportedChain = chainId ? SUPPORTED_CHAIN_IDS.includes(chainId) : false
    if (!isSupportedChain || chainId === undefined) {
      return ''
    }
    try {
      return getDappAddress(chainId)
    } catch (error) {
      console.error('Error getting dapp address:', error)
      return ''
    }
  }

  return fastlaneOnlineAddress()
}

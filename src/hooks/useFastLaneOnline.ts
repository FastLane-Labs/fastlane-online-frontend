import { SUPPORTED_CHAIN_IDS } from '@/constants'
import { getAtlasAddress, getDappAddress, getAtlasVerificationAddress } from '@/utils/getContractAddress'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useFastLaneOnline = () => {
  const { chainId } = useAccount()

  const fastlaneOnlineAddresses = useMemo(() => {
    const isSupportedChain = chainId ? SUPPORTED_CHAIN_IDS.includes(chainId) : false
    if (!isSupportedChain || chainId === undefined) {
      return { atlasAddress: '', dappAddress: '', verificationAddress: '' }
    }
    try {
      const atlasAddress = getAtlasAddress(chainId)
      const dappAddress = getDappAddress(chainId)
      const atlasVerificationAddress = getAtlasVerificationAddress(chainId)
      return { atlasAddress, dappAddress, atlasVerificationAddress }
    } catch (error) {
      console.error('Error getting dapp addresses:', error)
      return { atlasAddress: '', dappAddress: '', verificationAddress: '' }
    }
  }, [chainId])

  return fastlaneOnlineAddresses
}

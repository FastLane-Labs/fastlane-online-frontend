import { SUPPORTED_CHAIN_IDS } from '@/constants'
import { getAtlasAddress, getDappAddress, getAtlasVerificationAddress } from '@/utils/getContractAddress'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useFastLaneAddresses = () => {
  const { chainId } = useAccount()

  const fastlaneOnlineAddresses = useMemo(() => {
    const isSupportedChain = chainId ? SUPPORTED_CHAIN_IDS.includes(chainId) : false
    const fastlaneAddresses = { atlasAddress: '', dappAddress: '', atlasVerificationAddress: '' }

    if (!isSupportedChain || chainId === undefined) {
      return fastlaneAddresses
    }
    try {
      fastlaneAddresses.atlasAddress = getAtlasAddress(chainId)
      fastlaneAddresses.dappAddress = getDappAddress(chainId)
      fastlaneAddresses.atlasVerificationAddress = getAtlasVerificationAddress(chainId)
      return fastlaneAddresses
    } catch (error) {
      console.error('Error getting dapp addresses for chainId:', chainId, error)
      return fastlaneAddresses
    }
  }, [chainId])

  return fastlaneOnlineAddresses
}

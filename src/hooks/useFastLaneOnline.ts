import { SUPPORTED_CHAIN_IDS } from '@/constants'
import { getDappAddress, getDappVerificationAddress } from '@/utils/getContractAddress'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useFastLaneOnline = () => {
  const { chainId } = useAccount()

  const fastlaneOnlineAddresses = useMemo(() => {
    const isSupportedChain = chainId ? SUPPORTED_CHAIN_IDS.includes(chainId) : false
    if (!isSupportedChain || chainId === undefined) {
      return { dappAddress: '', verificationAddress: '' }
    }
    try {
      const dappAddress = getDappAddress(chainId)
      const verificationAddress = getDappVerificationAddress(chainId)
      return { dappAddress, verificationAddress }
    } catch (error) {
      console.error('Error getting dapp addresses:', error)
      return { dappAddress: '', verificationAddress: '' }
    }
  }, [chainId])

  return fastlaneOnlineAddresses
}

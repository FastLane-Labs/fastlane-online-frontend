import { getDappAddress } from '@/utils/getContractAddress'
import { useMemo } from 'react'
import { useChainId } from 'wagmi'

export const useFastLaneOnline = () => {
  const chainId = useChainId()

  const fastlaneOnlineAddress = useMemo(() => {
    if (!chainId) return ''
    try {
      return getDappAddress(chainId)
    } catch (error) {
      console.error('Error getting dapp address:', error)
      return ''
    }
  }, [chainId])

  return fastlaneOnlineAddress
}

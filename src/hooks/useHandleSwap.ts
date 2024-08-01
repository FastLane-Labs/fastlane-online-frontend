import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useSwapContext } from '@/context/SwapContext'
import { buildSwapIntent, buildBaselineCallData, buildUserOperation, getUserOperationHash } from '@/utils/atlas'
import { useFastLaneOnline } from './useFastLaneOnline'

export const useHandleSwap = () => {
  const { signer, provider } = useEthersProviderContext()
  const { address } = useAccount()
  const { quote, quoteLoading } = useSwapContext()
  const [isSwapping, setIsSwapping] = useState(false)
  const { dappAddress, verificationAddress } = useFastLaneOnline()

  const handleSwap = useCallback(async () => {
    if (!address || !provider || !quote || quoteLoading || !dappAddress || !verificationAddress) {
      console.error('Missing required data for swap')
      return false
    }

    setIsSwapping(true)
    try {
      // Build swap intent
      const swapIntent = buildSwapIntent(quote)

      // Build baseline call data
      const baselineCall = await buildBaselineCallData(quote)

      // Prepare other parameters for user operation
      const block = await provider.getBlock('latest')
      const maxFeePerGas = block?.baseFeePerGas! * 2n // Example: set max fee to 2x current base fee
      const deadline = Date.now() + 3600000 // Example: set deadline to 1 hour from now
      const gas = 500000n // Example gas limit, adjust as needed

      // Build user operation
      const userOperation = await buildUserOperation(
        address,
        swapIntent,
        baselineCall,
        deadline,
        gas,
        maxFeePerGas,
        dappAddress,
        provider
      )
      console.log('User operation:', userOperation)

      // 6. Get user operation hash
      const userOpHash = await getUserOperationHash(userOperation, verificationAddress, provider)

      console.log('User operation hash:', userOpHash)

      // Note: Signing and submitting the transaction are commented out for testing

      return true
    } catch (error) {
      console.error('Swap failed', error)
      return false
    } finally {
      setIsSwapping(false)
    }
  }, [address, provider, quote, quoteLoading, dappAddress, verificationAddress])

  return {
    handleSwap,
    isSwapping,
  }
}

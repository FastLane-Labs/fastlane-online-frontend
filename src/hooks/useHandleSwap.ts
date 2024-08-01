import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useSwapContext } from '@/context/SwapContext'
import {
  buildSwapIntent,
  buildBaselineCallData,
  buildUserOperation,
  getUserOperationHash,
  getExecutionEnvironment,
} from '@/utils/atlas'
import { useFastLaneOnline } from './useFastLaneOnline'
import { ethers } from 'ethers'
import { FastlaneOnlineAbi } from '@/abis'
import { Address } from 'viem'
import { getFeeData } from '@/utils/gasFee'
import { getAtlasGasSurcharge } from '@/utils/atlas'

export const useHandleSwap = () => {
  const { signer, provider } = useEthersProviderContext()
  const { address } = useAccount()
  const { quote, quoteLoading } = useSwapContext()
  const [isSwapping, setIsSwapping] = useState(false)
  const { atlasAddress, dappAddress, atlasVerificationAddress } = useFastLaneOnline()

  const handleSwap = useCallback(async () => {
    if (!address || !provider || !quote || quoteLoading || !atlasAddress || !dappAddress || !atlasVerificationAddress) {
      console.error('Missing required data for swap')
      return false
    }

    setIsSwapping(true)
    try {
      // Build swap intent
      const swapIntent = buildSwapIntent(quote)

      const executionEnvironment = await getExecutionEnvironment(
        atlasAddress as Address,
        dappAddress as Address,
        dappAddress as Address, // user is also the dapp address
        provider
      )

      // Build baseline call data
      const baselineCall = await buildBaselineCallData(quote, executionEnvironment)

      const block = await provider.getBlock('latest')
      const feeData = await getFeeData(provider)
      if (!feeData.maxFeePerGas || !feeData.gasPrice) {
        console.error('Missing required data for swap')
        return false
      }

      const maxFeePerGas = feeData.maxFeePerGas * 2n
      const deadline = block?.number! + 200 // Example: set deadline 200 blocks away
      const gas = 2000000n // Example gas limit, adjust as needed

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
      //Get user operation hash
      const userOpHash = await getUserOperationHash(userOperation, atlasVerificationAddress, provider)

      const contract = new ethers.Contract(dappAddress, FastlaneOnlineAbi, signer)
      const tx = await contract.fastOnlineSwap(swapIntent, baselineCall, deadline, gas, maxFeePerGas, userOpHash, {
        gasLimit: gas,
        maxFeePerGas: maxFeePerGas,
        value: getAtlasGasSurcharge(gas * maxFeePerGas),
      })

      console.log('Swap transaction submitted:', tx.hash)
      await tx.wait()
      console.log('Swap transaction confirmed')

      return true
    } catch (error) {
      console.error('Swap failed', error)
      return false
    } finally {
      setIsSwapping(false)
    }
  }, [address, provider, quote, quoteLoading, dappAddress, atlasVerificationAddress])

  return {
    handleSwap,
    isSwapping,
  }
}

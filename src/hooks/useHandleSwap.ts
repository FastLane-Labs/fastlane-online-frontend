import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useSwapStateContext } from '@/context/SwapStateContext'
import {
  buildSwapIntent,
  buildBaselineCallData,
  buildUserOperation,
  getUserOperationHash,
  getExecutionEnvironment,
} from '@/utils/atlas'
import { useFastLaneAddresses } from './useFastLaneAddresses'
import { ethers } from 'ethers'
import { FastlaneOnlineAbi } from '@/abis'
import { Address } from 'viem'
import { getFeeData } from '@/utils/gasFee'
import { getAtlasGasSurcharge } from '@/utils/atlas'
import { useAppStore } from '@/store/useAppStore'
import { calculateDeadlineBlockNumber } from '@/utils/settings'
import { useEstimatedSwapFees } from '@/hooks/useEstimatedSwapFees'
import { SOLVER_GAS_ESTIMATE, SWAP_GAS_ESTIMATE } from '@/constants'

export const useHandleSwap = () => {
  const { signer, provider } = useEthersProviderContext()
  const { address, chainId } = useAccount()
  const { quote, quoteLoading } = useSwapStateContext()
  const { config } = useAppStore()
  const [isSwapping, setIsSwapping] = useState(false)
  const { atlasAddress, dappAddress, atlasVerificationAddress } = useFastLaneAddresses()
  const { data: estimatedFees } = useEstimatedSwapFees()

  const handleSwap = useCallback(async () => {
    // Check if all required data is available
    const hashMissingContractAddress = !atlasVerificationAddress || !dappAddress || !atlasAddress
    const missingWeb3Provider = !address || !provider || !signer || !chainId
    const missingQuote = !quote || quoteLoading

    if (hashMissingContractAddress || missingWeb3Provider || missingQuote) {
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
      const baselineCall = await buildBaselineCallData(quote, executionEnvironment, config.slippage)

      const block = await provider.getBlock('latest')
      const feeData = await getFeeData(provider)
      if (!feeData.maxFeePerGas || !feeData.gasPrice) {
        console.error('Missing required data for swap')
        return false
      }

      const maxFeePerGas = feeData.maxFeePerGas * 2n // Multiply by 2 convert to wei
      const deadline = calculateDeadlineBlockNumber(config.deadline, block?.number!, chainId)
      const gas = SWAP_GAS_ESTIMATE + SOLVER_GAS_ESTIMATE

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
  }, [
    address,
    quote,
    quoteLoading,
    dappAddress,
    atlasVerificationAddress,
    config.slippage,
    config.deadline,
    atlasAddress,
    chainId,
    signer,
    provider,
  ])

  return {
    handleSwap,
    isSwapping,
  }
}

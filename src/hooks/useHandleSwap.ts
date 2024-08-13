import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { useFastLaneAddresses } from './useFastLaneAddresses'
import { useAppStore } from '@/store/useAppStore'
import { SOLVER_GAS_ESTIMATE, SWAP_GAS_ESTIMATE } from '@/constants'
import { signUserOperation } from '@/core/atlas'
import { getEip712Domain } from '@/utils/getContractAddress'
import { getAtlasGasSurcharge, getFeeData } from '@/utils/gasFee'
import { ethers } from 'ethers'
import { FastlaneOnlineAbi } from '@/abis'
import { TransactionParams, TransactionStatus } from '@/types'

export const useHandleSwap = () => {
  const { signer, provider } = useEthersProviderContext()
  const { address, chainId } = useAccount()
  const {
    quote,
    isQuoteing,
    swapData,
    isSwapping,
    setIsSwapping,
    isSigning,
    hasUserOperationSignature,
    setIsSigning,
    setSwapDataSigned,
    setSwapResult,
  } = useSwapStateContext()
  const { config } = useAppStore()
  const { atlasAddress, dappAddress, atlasVerificationAddress } = useFastLaneAddresses()

  const handleSignature = useCallback(async () => {
    if (!swapData?.userOperation || !signer || !chainId) {
      console.error('Missing required data for signature')
      return false
    }

    setIsSigning(true)
    try {
      await signUserOperation(swapData.userOperation, signer, getEip712Domain(chainId))
      setSwapDataSigned(true)
      return true
    } catch (error) {
      console.error('Signature generation failed', error)
      setSwapDataSigned(false)
      return false
    } finally {
      setIsSigning(false)
    }
  }, [swapData?.userOperation, signer, chainId, setIsSigning, setSwapDataSigned])

  const handleSwap = useCallback(async () => {
    // Check if all required data is available
    const hashMissingContractAddress = !atlasVerificationAddress || !dappAddress || !atlasAddress
    const missingWeb3Provider = !address || !provider || !signer || !chainId
    const missingQuote = !quote || isQuoteing
    const missingUserOperation = !swapData?.userOperation

    if (
      hashMissingContractAddress ||
      missingWeb3Provider ||
      missingQuote ||
      missingUserOperation ||
      !hasUserOperationSignature
    ) {
      return false
    }

    setIsSwapping(true)
    try {
      const feeData = await getFeeData(provider)
      if (!feeData.maxFeePerGas || !feeData.gasPrice) {
        console.error('Missing required data for swap')
        console.log('feeData', feeData)
        return false
      }

      const { isFromNative } = quote.swapRoute
      const value = isFromNative ? 0n : quote.amountIn

      const maxFeePerGas = feeData.maxFeePerGas
      const gas = SWAP_GAS_ESTIMATE + SOLVER_GAS_ESTIMATE

      const contract = new ethers.Contract(dappAddress, FastlaneOnlineAbi, signer)
      const tx = await contract.fastOnlineSwap(swapData.userOperation.toStruct(), {
        gasLimit: gas,
        value: value + getAtlasGasSurcharge(gas * maxFeePerGas),
      })

      const transactionParams: TransactionParams = {
        routeType: 'swap', // Assuming this is a swap transaction
        chainId: chainId,
        txHash: tx.hash,
        timestamp: Date.now(),
        status: 'pending' as TransactionStatus,
        fromAddress: address,
      }

      setSwapResult({ transaction: transactionParams })

      console.log('Swap transaction submitted:', tx.hash)
      await tx.wait()
      console.log('Swap transaction confirmed')

      // Update transaction status to 'success'
      const updatedTransactionParams: TransactionParams = {
        ...transactionParams,
        status: 'success' as TransactionStatus,
      }
      setSwapResult({ transaction: updatedTransactionParams })

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
    isQuoteing,
    dappAddress,
    atlasVerificationAddress,
    swapData?.userOperation,
    atlasAddress,
    chainId,
    signer,
    provider,
    setIsSwapping,
    setSwapResult,
    hasUserOperationSignature,
  ])

  return {
    handleSignature,
    handleSwap,
    isSwapping,
    isSigning,
  }
}

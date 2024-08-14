import { useCallback, useState } from 'react'
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
import { useNotifications } from '@/context/Notifications'

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
  const { addTransaction, updateTransactionStatus, addNotification } = useNotifications()

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
    let transactionParams: TransactionParams | null = null
    try {
      const feeData = await getFeeData(provider)
      if (!feeData.maxFeePerGas || !feeData.gasPrice) {
        console.error('Missing required data for swap')
        console.log('feeData', feeData)
        addNotification('Swap failed: Missing fee data', { type: 'error' })
        return false
      }

      const { isFromNative, swapSteps } = quote.swapRoute
      const fromToken = swapSteps[0].tokenIn
      const toToken = swapSteps[swapSteps.length - 1].tokenOut

      const value = isFromNative ? quote.amountIn : 0n

      const maxFeePerGas = feeData.maxFeePerGas
      const gas = SWAP_GAS_ESTIMATE + SOLVER_GAS_ESTIMATE

      // Create transaction parameters before sending the transaction
      transactionParams = {
        routeType: 'swap',
        chainId: chainId,
        txHash: '', // Will be updated with actual hash
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: quote.amountIn.toString(),
        toAmount: quote.amountOut.toString(),
        timestamp: Date.now(),
        status: 'pending' as TransactionStatus,
        fromAddress: address,
      }

      const contract = new ethers.Contract(dappAddress, FastlaneOnlineAbi, signer)
      const tx = await contract.fastOnlineSwap(swapData.userOperation.toStruct(), {
        gasLimit: gas,
        value: value + getAtlasGasSurcharge(gas * maxFeePerGas),
      })

      // Update transaction with actual hash
      transactionParams.txHash = tx.hash

      addTransaction(transactionParams)
      addNotification(`Swap submitted: ${tx.hash}`, { type: 'info' })

      setSwapResult({ transaction: transactionParams })

      console.log('Swap transaction submitted:', tx.hash)
      await tx.wait()
      console.log('Swap transaction confirmed')

      // Update transaction status to 'confirmed'
      updateTransactionStatus(tx.hash, 'confirmed')
      addNotification('Swap transaction confirmed', { type: 'success' })

      const updatedTransactionParams: TransactionParams = {
        ...transactionParams,
        status: 'confirmed' as TransactionStatus,
      }
      setSwapResult({ transaction: updatedTransactionParams })

      return true
    } catch (error: any) {
      console.error('Swap failed', error)

      if (transactionParams?.txHash) {
        // If we have a transaction hash, update its status to failed
        updateTransactionStatus(transactionParams.txHash, 'failed')
        addNotification(`Swap failed: ${error.message || 'Unknown error occurred'}`, { type: 'error' })
      } else {
        // If we don't have a transaction hash, just show an error notification
        addNotification('Swap failed to submit', { type: 'error' })
      }

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
    addTransaction,
    updateTransactionStatus,
    addNotification,
  ])

  return {
    handleSignature,
    handleSwap,
    isSwapping,
    isSigning,
  }
}

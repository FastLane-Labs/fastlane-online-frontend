import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { useFastLaneAddresses } from './useFastLaneAddresses'
import { nativeEvmTokenAddress, SOLVER_GAS_ESTIMATE, SWAP_GAS_ESTIMATE } from '@/constants'
import { signUserOperation } from '@/core/atlas'
import { getEip712Domain } from '@/utils/getContractAddress'
import { getAtlasGasSurcharge, getFeeData } from '@/utils/gasFee'
import { ethers, formatUnits, parseEther } from 'ethers'
import { FastlaneOnlineAbi } from '@/abis'
import { Token, TransactionParams, TransactionStatus } from '@/types'
import { useNotifications } from '@/context/Notifications'
import { getBlockExplorerUrl } from '@/utils/getBlockExplorerUrl'
import { TokenProvider } from '@/providers'
import { useErrorNotification } from './useErrorNotification'
import { parseTransactionReceipt } from '@/utils/parseTransactionReceipt'
import { shortFormat } from '@/utils/format'
import { capitalize } from '@/utils/helpers/formatTools'

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
    swapMode,
  } = useSwapStateContext()

  const { atlasAddress, dappAddress, atlasVerificationAddress } = useFastLaneAddresses()
  const { sendNotification } = useNotifications()
  const { handleProviderError } = useErrorNotification()

  const handleSignature = useCallback(async () => {
    if (!swapData?.userOperation || !signer || !chainId || swapData.type !== 'swap') {
      console.error('Missing required data for signature')
      return false
    }

    setIsSigning(true)
    try {
      await signUserOperation(swapData.userOperation, signer, getEip712Domain(chainId))
      setSwapDataSigned(true)
      return true
    } catch (error: any) {
      handleProviderError(error)
      setSwapDataSigned(false)
      return false
    } finally {
      setIsSigning(false)
    }
  }, [swapData?.userOperation, swapData?.type, signer, chainId, setIsSigning, setSwapDataSigned, handleProviderError])

  const handleDappContractSwap = useCallback(async () => {
    // Check if all required data is available
    const hashMissingContractAddress = !atlasVerificationAddress || !dappAddress || !atlasAddress
    const missingWeb3Provider = !address || !provider || !signer || !chainId
    const missingQuote = !quote || isQuoteing
    const missingUserOperation = !swapData?.userOperation || swapData.type !== 'swap'

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
    const { isFromNative, isToNative, swapSteps } = quote.swapRoute
    const nativeToken = (await TokenProvider.getTokensByChainId(chainId)).find(
      (token: Token) => token.address === nativeEvmTokenAddress
    )

    // Update the from and to tokens if we have a native token only used for notifications
    const fromToken = isFromNative ? nativeToken || swapSteps[0].tokenIn : swapSteps[0].tokenIn
    const toToken = isToNative
      ? nativeToken || swapSteps[swapSteps.length - 1].tokenOut
      : swapSteps[swapSteps.length - 1].tokenOut

    const baseUrl = getBlockExplorerUrl(chainId)
    try {
      const feeData = await getFeeData(provider)
      if (!feeData.maxFeePerGas || !feeData.gasPrice) {
        console.error('Missing required data for swap')
        sendNotification('Swap failed: Missing fee data', { type: 'error' })
        return false
      }

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
        boosted: false,
      }

      const contract = new ethers.Contract(dappAddress, FastlaneOnlineAbi, signer)
      const tx = await contract.fastOnlineSwap(swapData.userOperation?.toStruct(), {
        gasLimit: gas,
        value: value + getAtlasGasSurcharge(gas * maxFeePerGas),
      })

      // Update transaction with actual hash
      transactionParams.txHash = tx.hash

      sendNotification(`Submitting Swap from ${fromToken.symbol} to ${toToken.symbol}`, {
        type: 'info',
        href: `${baseUrl}tx/${tx.hash}`,
        transactionParams: transactionParams,
      })

      setSwapResult({ transaction: transactionParams })

      const receipt = await tx.wait()
      const parsedReceipt = parseTransactionReceipt(receipt, address, isToNative)

      const receivedAmount = parsedReceipt.userReceivedAmount || BigInt(quote.amountOut)
      const baselineAmount = parsedReceipt.baselineAmountOut || BigInt(quote.amountOut)

      const isBoosted = parsedReceipt.isSolverTxSuccessful && receivedAmount > baselineAmount

      if (isBoosted) {
        const boostedAmount = receivedAmount - baselineAmount
        sendNotification(
          `Swap ${fromToken.symbol} to ${toToken.symbol} Boosted successful. Received: ${shortFormat(receivedAmount, toToken.decimals, 4)} ${toToken.symbol} Boosted by ${shortFormat(boostedAmount, toToken.decimals, 4)} ${toToken.symbol}`,
          {
            type: 'success',
            href: `${baseUrl}tx/${tx.hash}`,
            transactionHash: tx.hash,
            transactionStatus: 'confirmed',
            boosted: true,
            receivedAmount: receivedAmount.toString(),
            boostedAmount: boostedAmount.toString(),
          }
        )
      } else {
        sendNotification(
          `Swap ${fromToken.symbol} to ${toToken.symbol} successful. Received: ${shortFormat(receivedAmount, toToken.decimals, 4)} ${toToken.symbol}`,
          {
            type: 'success',
            href: `${baseUrl}tx/${tx.hash}`,
            transactionHash: tx.hash,
            transactionStatus: 'confirmed',
            boosted: false,
            receivedAmount: receivedAmount.toString(),
          }
        )
      }

      const updatedTransactionParams: TransactionParams = {
        ...transactionParams,
        status: 'confirmed' as TransactionStatus,
        toAmount: receivedAmount.toString(),
        boosted: isBoosted,
        boostedAmount: isBoosted ? (receivedAmount - baselineAmount).toString() : '0',
      }
      setSwapResult({ transaction: updatedTransactionParams })

      return true
    } catch (error: any) {
      if (transactionParams?.txHash) {
        // If we have a transaction hash, update its status to failed
        sendNotification(`Swap ${fromToken.symbol} to ${toToken.symbol} failed`, {
          type: 'error',
          href: `${baseUrl}tx/${transactionParams.txHash}`,
          transactionHash: transactionParams.txHash,
          transactionStatus: 'failed',
        })
      } else {
        handleProviderError(error)
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
    swapData?.type,
    atlasAddress,
    chainId,
    signer,
    provider,
    setIsSwapping,
    setSwapResult,
    hasUserOperationSignature,
    sendNotification,
    handleProviderError,
  ])

  const handleWrap = useCallback(async () => {
    if (
      !swapData ||
      swapData.type !== 'wrap' ||
      !swapData.baselineCall ||
      !provider ||
      !signer ||
      !address ||
      !chainId ||
      !quote
    ) {
      console.error('Missing required data for wrap')
      return false
    }

    setIsSwapping(true)
    let transactionParams: TransactionParams | null = null
    const { isFromNative, isToNative, swapSteps } = quote.swapRoute
    const nativeToken = (await TokenProvider.getTokensByChainId(chainId)).find(
      (token: Token) => token.address === nativeEvmTokenAddress
    )

    // Update the from and to tokens if we have a native token only used for notifications
    const fromToken = isFromNative ? nativeToken || swapSteps[0].tokenIn : swapSteps[0].tokenIn
    const toToken = isToNative
      ? nativeToken || swapSteps[swapSteps.length - 1].tokenOut
      : swapSteps[swapSteps.length - 1].tokenOut

    const baseUrl = getBlockExplorerUrl(chainId)
    try {
      const feeData = await getFeeData(provider)
      if (!feeData.maxFeePerGas || !feeData.gasPrice) {
        console.error('Missing required fee data for wrap')
        sendNotification(`${capitalize(swapMode)} failed: Missing fee data`, { type: 'error' })
        return false
      }

      const value = isFromNative ? quote.amountIn : 0n
      const gas = SWAP_GAS_ESTIMATE // Adjust this if wrap requires different gas

      transactionParams = {
        routeType: swapMode,
        chainId: chainId,
        txHash: '',
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: quote.amountIn.toString(),
        toAmount: quote.amountOut.toString(),
        timestamp: Date.now(),
        status: 'pending' as TransactionStatus,
        fromAddress: address,
        boosted: false,
      }

      const tx = await signer.sendTransaction({
        to: swapData.baselineCall.to,
        data: swapData.baselineCall.data,
        value: value,
        gasLimit: gas,
      })

      transactionParams.txHash = tx.hash

      sendNotification(`Submitting ${fromToken.symbol} Token ${capitalize(swapMode)}`, {
        type: 'info',
        href: `${baseUrl}tx/${tx.hash}`,
        transactionParams: transactionParams,
      })

      setSwapResult({ transaction: transactionParams })

      await tx.wait()

      sendNotification(
        `${fromToken.symbol} ${swapData.type} successful. Received: ${shortFormat(quote.amountOut, toToken.decimals, 4)} ${toToken.symbol}`,
        {
          type: 'success',
          href: `${baseUrl}tx/${tx.hash}`,
          transactionHash: tx.hash,
          transactionStatus: 'confirmed',
          boosted: false,
          receivedAmount: quote.amountOut.toString(),
        }
      )

      const updatedTransactionParams: TransactionParams = {
        ...transactionParams,
        status: 'confirmed' as TransactionStatus,
      }
      setSwapResult({ transaction: updatedTransactionParams })

      return true
    } catch (error: any) {
      if (transactionParams?.txHash) {
        sendNotification(`${fromToken.symbol} ${capitalize(swapMode)} failed`, {
          type: 'error',
          href: `${baseUrl}tx/${transactionParams.txHash}`,
          transactionHash: transactionParams.txHash,
          transactionStatus: 'failed',
        })
      } else {
        handleProviderError(error)
      }
      return false
    } finally {
      setIsSwapping(false)
    }
  }, [
    swapData,
    provider,
    signer,
    quote,
    address,
    chainId,
    swapMode,
    setIsSwapping,
    setSwapResult,
    sendNotification,
    handleProviderError,
  ])

  const handleSwap = useCallback(async () => {
    if (!swapData || !swapMode) {
      console.error('Missing swap data or swap mode')
      return false
    }

    if (swapMode === 'wrap' || swapMode === 'unwrap') {
      return handleWrap()
    } else if (swapMode === 'swap') {
      if (!hasUserOperationSignature) {
        console.error('Missing user operation signature for swap')
        return false
      }
      return handleDappContractSwap()
    } else {
      console.error('Invalid swap mode')
      return false
    }
  }, [handleDappContractSwap, handleWrap, swapData, swapMode, hasUserOperationSignature])

  return {
    handleSignature,
    handleSwap,
    handleDappContractSwap,
    isSwapping,
    isSigning,
  }
}

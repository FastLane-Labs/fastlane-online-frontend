'use client'
import { ethers } from 'ethers'
import { useState } from 'react'

export interface SwapParameters {
  sellToken: string
  buyToken: string
  sellAmount: string
  slippageTolerance: number
  transactionDeadline: number
  address?: string
  chainId: number
  provider: ethers.AbstractProvider
  operationsRelayUrl: string
  dapp: string
  control: string
}

export interface SwapResult {
  status: 'success' | 'error'
  message: string
}

const useAtlas = () => {
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSwap = async ({
    sellToken,
    buyToken,
    sellAmount,
    slippageTolerance,
    transactionDeadline,
    address,
    chainId,
    provider,
    operationsRelayUrl,
    dapp,
    control,
  }: SwapParameters): Promise<SwapResult> => {
    setIsSwapping(true)
    setError(null)

    try {
      // Init atlas operation relay
      // todo:
      // replace FastlaneOperationsRelay with import {fastlaneBackend} from atlas-sdk
      // const operationsRelay = new FastlaneOperationsRelay({
      //   basePath: operationsRelayUrl,
      // })

      // Init atlas sdk
      // const atlasSdk = new AtlasSdk(provider, chainId, BaseOperationRelay)

      const userOperation = {}
      const callConfig = {}
      const hints = {}

      // let [userOpHash, solverOperations] = await atlasSdk.submitUserOperation(userOperation, callConfig, hints)

      console.log('Swap executed successfully', {
        sellToken,
        buyToken,
        sellAmount,
        slippageTolerance,
        transactionDeadline,
        address,
        chainId,
        provider,
        operationsRelayUrl,
        dapp,
        control,
      })

      return {
        status: 'success',
        message: 'Swap executed successfully',
      }
    } catch (error: any) {
      setError(error.message)
      return {
        status: 'error',
        message: error.message,
      }
    } finally {
      setIsSwapping(false)
    }
  }

  return { handleSwap, isSwapping, error }
}

export default useAtlas

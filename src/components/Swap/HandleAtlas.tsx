'use client'
// This component is the same as HandleSwap.js,
// except it calls the useAtlas() hook instead of
// POST request to '/api/swap'
// for better error handling and readability.

import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { getDappAddress, getControlAddress } from '@/utils/getContractAddress'
import SwapButton from '../Buttons/SwapButton'
import useAtlas, { SwapParameters } from '@/hooks/useAtlas'

interface HandleAtlasProps {
  sellToken: string
  buyToken: string
  sellAmount: string
  slippageTolerance: number
  transactionDeadline: number
}

const HandleAtlas: React.FC<HandleAtlasProps> = ({
  sellToken,
  buyToken,
  sellAmount,
  slippageTolerance,
  transactionDeadline,
}) => {
  const { data: walletClient, isError, isLoading } = useWalletClient()
  const { address: account, chain: chainInfo } = useAccount()
  const { handleSwap, isSwapping, error } = useAtlas()

  const handleSwapClick = async () => {
    if (!chainInfo) {
      console.error('Swap failed', 'Chain information is not available')
      return
    }

    /////////////////////////////////////////////////
    // Atlas Parameters:
    const chain = chainInfo.id
    const provider = walletClient
    const operationsRelayUrl = 'https://eth-sepolia.atlas-operations-relay.fastlane.xyz'
    const dapp = getDappAddress(chain)
    const control = getControlAddress(chain)
    let value, gasEstimate, deadline, data
    /////////////////////////////////////////////////

    const swapParams = {
      sellToken,
      buyToken,
      sellAmount,
      slippageTolerance,
      transactionDeadline,
      address: account,
      chainId: chain,
      provider,
      operationsRelayUrl,
      dapp,
      control,
    } as SwapParameters

    const response = await handleSwap(swapParams)

    if (response.status === 'success') {
      console.log('Swap successful', response)
    } else {
      console.error('Swap failed', response.message)
    }
  }

  return (
    <SwapButton
      isConnected={!!account}
      sellAmount={sellAmount}
      buyToken={buyToken}
      handleSwap={handleSwapClick}
      isLoading={isSwapping || isLoading || !walletClient}
    />
  )
}

export default HandleAtlas

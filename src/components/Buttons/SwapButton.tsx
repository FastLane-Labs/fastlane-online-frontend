import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useBalance } from '@/hooks/useBalance'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { toBigInt } from '@/utils/format'
import SwapModal from '@/components/Modals/SwapModal'
import { useFastLaneAddresses } from '@/hooks/useFastLaneAddresses'
import { SUPPORTED_CHAIN_IDS } from '@/constants'
import { useAllowanceManager } from '@/hooks/useAllowanceManager'
import SwapDetails from '@/components/Buttons/SwapDetails'
import { useHandleSwap } from '@/hooks/useHandleSwap'

interface SwapButtonProps {
  handleSwap: () => Promise<boolean>
  isLoading: boolean
}

const LOADING_SPINNER = <span className='loading loading-spinner'></span>

const SwapButton: React.FC<SwapButtonProps> = ({ handleSwap, isLoading }) => {
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const { fromToken, toToken, fromAmount, setSwapDataSigned } = useSwapStateContext()
  const { address: userAddress, status, isConnected, chainId } = useAccount()
  const [isSupportedChain, setIsSupportedChain] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const { data: balance, isLoading: balanceLoading } = useBalance({ token: fromToken!, userAddress: userAddress! })
  const { dappAddress: spenderAddress } = useFastLaneAddresses()
  const { updateAllowance, checkAllowance, isSufficientAllowance } = useAllowanceManager()
  const { handleSignature } = useHandleSwap()

  useEffect(() => {
    if (chainId) {
      setIsSupportedChain(SUPPORTED_CHAIN_IDS.includes(chainId))
    }
  }, [chainId])

  useEffect(() => {
    if (status !== 'connecting') {
      setInitialized(true)
    }
  }, [status])

  const handleApprove = useCallback(async () => {
    if (!fromToken || !userAddress || !spenderAddress) return false
    try {
      const amount = toBigInt(fromAmount, fromToken.decimals)
      const success = await updateAllowance(fromToken, spenderAddress, amount)
      if (success) {
        await checkAllowance(fromToken, userAddress, spenderAddress)
      }
      return success
    } catch (error) {
      console.error('Approval Error:', error)
      return false
    }
  }, [fromToken, userAddress, spenderAddress, fromAmount, updateAllowance, checkAllowance])

  const handleSign = useCallback(async () => {
    try {
      const success = await handleSignature()
      if (success) {
        setSwapDataSigned(true)
      }
      return success
    } catch (error) {
      console.error('Signing Error:', error)
      return false
    }
  }, [handleSignature, setSwapDataSigned])

  const handleSwapConfirm = useCallback(async () => {
    setLocalLoading(true)
    const success = await handleSwap()
    setLocalLoading(false)
    return success
  }, [handleSwap])

  const hasSufficientBalance = useMemo(() => {
    return balance && fromToken && toBigInt(fromAmount, fromToken.decimals) <= BigInt(balance.toString())
  }, [balance, fromToken, fromAmount])

  const isMissingUserInput = useMemo(() => {
    return !fromToken || !toToken || !fromAmount || !hasSufficientBalance
  }, [fromToken, toToken, fromAmount, hasSufficientBalance])

  const isDisabled = useMemo(() => {
    return (
      status === 'reconnecting' || !initialized || (isSupportedChain && (isMissingUserInput || !hasSufficientBalance))
    )
  }, [status, initialized, isSupportedChain, isMissingUserInput, hasSufficientBalance])

  const getButtonText = useCallback(() => {
    if (!isConnected) return 'Connect wallet'
    if (isConnected && !isSupportedChain) return 'Unsupported network'
    if (status === 'reconnecting') return 'Reconnecting to Wallet'
    if (!initialized) return 'Initializing'
    if (!fromToken || !toToken) return 'Select Tokens'
    if (!fromAmount) return 'Enter an amount'
    if (!hasSufficientBalance) return `Insufficient ${fromToken.symbol} balance`
    if (localLoading) return <>{LOADING_SPINNER} Initiating swap</>
    return 'Swap'
  }, [
    isConnected,
    isSupportedChain,
    status,
    initialized,
    fromToken,
    toToken,
    fromAmount,
    hasSufficientBalance,
    localLoading,
  ])

  const handleButtonClick = useCallback(() => {
    if (!isConnected) {
      openConnectModal?.()
    } else if (isConnected && !isSupportedChain) {
      openChainModal?.()
    } else if (!isDisabled) {
      setIsSwapModalOpen(true)
    }
  }, [isConnected, isSupportedChain, isDisabled, openConnectModal, openChainModal])

  return (
    <>
      <button className='btn' onClick={handleButtonClick} disabled={isDisabled}>
        {getButtonText()}
      </button>
      {!isDisabled && <SwapDetails />}
      <SwapModal
        isVisible={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSwap={handleSwapConfirm}
        onSign={handleSign}
        onApprove={handleApprove}
      />
    </>
  )
}

export default SwapButton

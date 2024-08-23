'use client'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useBalance } from '@/hooks/useBalance'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { toBigInt } from '@/utils/format'
import { SANCTIONED_ADDRESSES } from '@/constants'
import SwapModal from '@/components/Modals/SwapModal'
import { SUPPORTED_CHAIN_IDS } from '@/constants'
import SwapDetails from '@/components/Buttons/SwapDetails'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useFastLaneAddresses } from '@/hooks/useFastLaneAddresses'
import { capitalize } from '@/utils/helpers/formatTools'

interface SwapButtonProps {
  handleSwap: () => Promise<boolean>
  isLoading: boolean
}

const LOADING_SPINNER = <span className='loading loading-spinner'></span>

const SwapButton: React.FC<SwapButtonProps> = ({ handleSwap, isLoading }) => {
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const {
    fromToken,
    toToken,
    fromAmount,
    setSwapDataSigned,
    swapData,
    setAllowQuoteUpdate,
    updateAllowance,
    checkAllowance,
    swapMode,
  } = useSwapStateContext()
  const { address: userAddress, status, isConnected, chainId } = useAccount()
  const [isSupportedChain, setIsSupportedChain] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [userBlocked, setUserBlocked] = useState(false)
  const { data: balance, isLoading: balanceLoading } = useBalance({ token: fromToken!, userAddress: userAddress! })
  const { atlasAddress: spenderAddress } = useFastLaneAddresses()
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

  useEffect(() => {
    setUserBlocked(SANCTIONED_ADDRESSES.includes(userAddress!))
  }, [userAddress])

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
      setSwapDataSigned(false)
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

  const isMissingSwapData = useMemo(() => {
    const result = swapData === null || swapData === undefined
    return result
  }, [swapData])

  const isDisabled = useMemo(() => {
    if (userBlocked) {
      return true
    }
    if (status === 'reconnecting') {
      return true
    }
    if (!initialized) {
      return true
    }
    if (isSupportedChain) {
      if (isMissingUserInput) {
        return true
      }
      if (!hasSufficientBalance) {
        return true
      }
      if (isMissingSwapData) {
        return true
      }
    }
    return false
  }, [status, initialized, isSupportedChain, isMissingUserInput, hasSufficientBalance, isMissingSwapData, userBlocked])

  const getButtonText = useCallback(() => {
    if (userBlocked) return 'You are not allowed to use this app'
    if (!isConnected) return 'Connect wallet'
    if (isConnected && !isSupportedChain) return 'Unsupported network'
    if (status === 'reconnecting') return 'Reconnecting to Wallet'
    if (!initialized) return 'Initializing'
    if (!fromToken || !toToken) return 'Select Tokens'
    if (!fromAmount) return 'Enter an amount'
    if (!hasSufficientBalance) return `Insufficient ${fromToken.symbol} balance`
    if (localLoading)
      return (
        <>
          {LOADING_SPINNER} Initiating {capitalize(swapMode)}
        </>
      )

    return capitalize(swapMode)
  }, [
    userBlocked,
    isConnected,
    isSupportedChain,
    status,
    initialized,
    fromToken,
    toToken,
    fromAmount,
    hasSufficientBalance,
    localLoading,
    swapMode,
  ])

  const handleButtonClick = useCallback(() => {
    if (!isConnected) {
      openConnectModal?.()
    } else if (isConnected && !isSupportedChain) {
      openChainModal?.()
    } else if (!isDisabled) {
      setIsSwapModalOpen(true)
      setAllowQuoteUpdate(false)
    }
  }, [
    isConnected,
    isSupportedChain,
    isDisabled,
    openConnectModal,
    openChainModal,
    setIsSwapModalOpen,
    setAllowQuoteUpdate,
  ])

  const handleSwapModalClose = useCallback(() => {
    setIsSwapModalOpen(false)
    setAllowQuoteUpdate(true) // Reset allowQuoteUpdate to true when modal is closed
  }, [setIsSwapModalOpen, setAllowQuoteUpdate])

  return (
    <>
      <button className='btn' onClick={handleButtonClick} disabled={isDisabled}>
        {getButtonText()}
      </button>
      <SwapDetails />
      <SwapModal
        isVisible={isSwapModalOpen}
        onClose={handleSwapModalClose}
        onSwap={handleSwapConfirm}
        onSign={handleSign}
        onApprove={handleApprove}
      />
    </>
  )
}

export default SwapButton

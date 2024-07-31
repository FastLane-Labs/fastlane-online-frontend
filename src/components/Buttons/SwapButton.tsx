import React, { useState, useEffect } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSwitchChain } from 'wagmi'
import { useBalance } from '@/hooks/useBalance'
import { useSwapContext } from '@/context/SwapContext'
import { toBigInt } from '@/utils/format'
import SwapModal from '@/components/Modals/SwapModal'
import { approveErc20Token } from '@/utils/approveErc20Token'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useFastLaneOnline } from '@/hooks/useFastLaneOnline'
import { SUPPORTED_CHAIN_IDS } from '@/constants'

interface SwapButtonProps {
  handleSwap: () => Promise<boolean>
  isLoading: boolean
}

const SwapButton: React.FC<SwapButtonProps> = ({ handleSwap, isLoading }) => {
  const { openConnectModal } = useConnectModal()
  const { fromToken, toToken, fromAmount, updateAllowance, setSufficientAllowance } = useSwapContext()
  const { address: userAddress, status, isConnected, chainId } = useAccount()
  const [isSupportedChain, setIsSupportedChain] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const { data: balance, isLoading: balanceLoading } = useBalance({ token: fromToken!, userAddress: userAddress! })
  const { signer } = useEthersProviderContext()
  const spenderAddress = useFastLaneOnline()

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

  const handleApprove = async () => {
    if (!fromToken) return false
    try {
      if (!signer || !spenderAddress) return false
      await approveErc20Token(signer, fromToken.address, spenderAddress, toBigInt(fromAmount, fromToken.decimals), true)
      updateAllowance()
      setSufficientAllowance(true)
      return true
    } catch (error) {
      console.error('Approval Error:', error)
      return false
    }
  }

  const handleSwapConfirm = async () => {
    setLocalLoading(true)
    const success = await handleSwap()
    setLocalLoading(false)
    return success
  }

  const hasSufficientBalance =
    balance && fromToken && toBigInt(fromAmount, fromToken.decimals) <= BigInt(balance.toString())

  const isDisabled =
    status === 'reconnecting' || !initialized || !fromToken || !toToken || !fromAmount || !hasSufficientBalance

  const getButtonText = () => {
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
          <span className='loading loading-spinner'></span> Initiating swap
        </>
      )
    return 'Swap'
  }

  const handleButtonClick = () => {
    if (!isConnected) {
      openConnectModal?.()
    } else if (isConnected && !isSupportedChain) {
      console.log('switching chain')
    } else if (!isDisabled) {
      setIsSwapModalOpen(true)
    }
  }

  return (
    <>
      <button className='btn rounded-2xl w-full' onClick={handleButtonClick} disabled={isDisabled}>
        {getButtonText()}
      </button>
      <SwapModal
        isVisible={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSwap={handleSwapConfirm}
        onApprove={handleApprove}
      />
    </>
  )
}

export default SwapButton

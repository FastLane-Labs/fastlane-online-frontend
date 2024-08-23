import React, { useState, useCallback, useEffect } from 'react'
import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import SwapStep from '@/components/Swap/SwapStep'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { getBlockExplorerUrl } from '@/utils/getBlockExplorerUrl'

interface SwapModalProps {
  isVisible: boolean
  onClose: () => void
  onSwap: () => Promise<boolean>
  onApprove: () => Promise<boolean>
  onSign: () => Promise<boolean>
}

const SwapModal: React.FC<SwapModalProps> = ({ isVisible, onClose, onSwap, onApprove, onSign }) => {
  const [step, setStep] = useState<'approve' | 'sign' | 'swap' | 'success'>('approve')
  const [error, setError] = useState<Error | null>(null)
  const [txBlockExplorerUrl, setTxBlockExplorerUrl] = useState<string | undefined>(undefined)

  const {
    isSwapping,
    isSigning,
    isApproving,
    setIsSigning,
    setIsSwapping,
    setIsApproving,
    swapResult,
    setSwapData,
    setHasUserOperationSignature,
    swapMode,
  } = useSwapStateContext()

  useEffect(() => {
    if (swapResult?.transaction?.txHash) {
      const baseUrl = getBlockExplorerUrl(swapResult.transaction.chainId)
      const txHash = swapResult.transaction.txHash
      setTxBlockExplorerUrl(`${baseUrl}/tx/${txHash}`)
    }
  }, [swapResult])

  const handleAction = useCallback(
    async (action: 'approve' | 'sign' | 'swap') => {
      setError(null)
      let success = false
      try {
        switch (action) {
          case 'approve':
            setIsApproving(true)
            success = await onApprove()
            if (success) setStep('sign')
            break
          case 'sign':
            setIsSigning(true)
            success = await onSign()
            if (success) setStep('swap')
            break
          case 'swap':
            setIsSwapping(true)
            success = await onSwap()
            if (success) {
              setStep('success')
            }
            break
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setIsApproving(false)
        setIsSigning(false)
        setIsSwapping(false)
      }
      return success
    },
    [onApprove, onSign, onSwap, setIsApproving, setIsSigning, setIsSwapping]
  )

  const handleClose = useCallback(() => {
    if (step === 'success') {
      setStep('approve')
      setSwapData(null)
      setError(null)
      setHasUserOperationSignature(false)
    } else {
      setError(null)
    }
    onClose()
  }, [step, onClose, setSwapData, setHasUserOperationSignature])

  return (
    <ModalWrapper isVisible={isVisible} onClose={handleClose} style={{ paddingBottom: '28px', overflow: 'visible' }}>
      <SwapStep
        step={step}
        setStep={setStep}
        onAction={handleAction}
        isLoading={isApproving || isSigning || isSwapping}
        txBlockExplorerUrl={txBlockExplorerUrl}
        error={error}
      />
    </ModalWrapper>
  )
}

export default SwapModal

import React, { useState, useCallback } from 'react'
import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import SwapStep from '@/components/Swap/SwapStep'
import { useSwapStateContext } from '@/context/SwapStateContext'

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

  const { hasSufficientAllowance, isSwapping, isSigning, isApproving, setIsSigning, setIsSwapping, setIsApproving } =
    useSwapStateContext()

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
            if (success) setStep('success')
            break
        }
        if (!success) throw new Error(`${action} failed`)
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

  return (
    <ModalWrapper isVisible={isVisible} onClose={onClose}>
      <SwapStep
        step={step}
        setStep={setStep}
        onAction={handleAction}
        isLoading={isApproving || isSigning || isSwapping}
        error={error}
      />
    </ModalWrapper>
  )
}

export default SwapModal

import React, { useState } from 'react'
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleAction = async (action: 'approve' | 'sign' | 'swap') => {
    setIsLoading(true)
    setError(null)
    let success = false
    try {
      switch (action) {
        case 'approve':
          success = await onApprove()
          if (success) setStep('sign')
          break
        case 'sign':
          success = await onSign()
          if (success) setStep('swap')
          break
        case 'swap':
          success = await onSwap()
          if (success) setStep('success')
          break
      }
      if (!success) throw new Error(`${action} failed`)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
    } finally {
      setIsLoading(false)
    }
    return Promise.resolve(success)
  }

  return (
    <ModalWrapper isVisible={isVisible} onClose={onClose}>
      <SwapStep step={step} onAction={handleAction} isLoading={isLoading} error={error} />
    </ModalWrapper>
  )
}

export default SwapModal

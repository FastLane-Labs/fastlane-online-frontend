'use client'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import { useAppStore } from '@/store/useAppStore'
import { basisPointsToPercent, percentToBasisPoints } from '@/utils/settings'

interface SettingsModalProps {
  isVisible: boolean
  onClose: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose }) => {
  const { config, updateConfig } = useAppStore()
  const [localSlippage, setLocalSlippage] = useState<number>(config.slippage)
  const [customSlippage, setCustomSlippage] = useState<string>('')
  const [localDeadline, setLocalDeadline] = useState<number | undefined>(config.deadline)
  const [localTokenApproval, setLocalTokenApproval] = useState<'exact' | 'max'>(config.tokenApproval)

  useEffect(() => {
    setLocalSlippage(config.slippage)
    setLocalDeadline(config.deadline)
    setCustomSlippage('')
    setLocalTokenApproval(config.tokenApproval)
  }, [config, isVisible])

  const handleSlippageChange = useCallback((basisPoints: number) => {
    setLocalSlippage(basisPoints)
    setCustomSlippage('')
  }, [])

  const handleCustomSlippageChange = useCallback((value: string) => {
    setCustomSlippage(value)
    if (value === '') {
      setLocalSlippage(0)
      return
    }
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue <= 10) {
      setLocalSlippage(percentToBasisPoints(numValue))
    }
  }, [])

  const handleDeadlineChange = useCallback((value: string) => {
    const deadline = parseInt(value)
    setLocalDeadline(isNaN(deadline) ? undefined : deadline)
  }, [])

  const handleTokenApprovalChange = () => {
    setLocalTokenApproval((prev) => (prev === 'exact' ? 'max' : 'exact'))
  }

  const slippagePercent = useMemo(() => {
    if (customSlippage) {
      return parseFloat(customSlippage)
    }
    return basisPointsToPercent(localSlippage)
  }, [localSlippage, customSlippage])

  const isHighSlippage = slippagePercent > 5 // More than 5%
  const isVeryHighSlippage = slippagePercent > 10 // More than 10%

  const slippageWarning = useMemo(() => {
    if (isVeryHighSlippage) return 'Slippage is too high, max allowed slippage is 10%'
    if (isHighSlippage) return 'Slippage is high, transactions may be frontrun'
    return ''
  }, [isHighSlippage, isVeryHighSlippage])

  const isSaveDisabled = isVeryHighSlippage

  const closeModal = () => {
    setLocalSlippage(config.slippage)
    setLocalDeadline(config.deadline)
    setCustomSlippage('')
    onClose()
  }

  const handleSave = () => {
    if (!isSaveDisabled) {
      updateConfig({
        slippage: localSlippage,
        deadline: localDeadline,
        tokenApproval: localTokenApproval,
      })
      onClose()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave()
    }
  }

  return (
    <ModalWrapper isVisible={isVisible} onClose={closeModal} style={{ paddingBottom: '28px' }}>
      <h3 className='text-lg my-4 font-semibold text-center leading-tight'>Swap Settings</h3>
      <div className='flex flex-col gap-6 leading-none'>
        {/* Slippage Tolerance */}
        <div className='flex flex-col gap-2'>
          <h1>Slippage tolerance</h1>
          <div className='flex space-x-2'>
            {[0.1, 0.5, 1].map((percent) => (
              <button
                key={percent}
                onClick={() => handleSlippageChange(percentToBasisPoints(percent))}
                className={`btn btn-settings ${
                  localSlippage === percentToBasisPoints(percent) ? 'bg-secondary' : 'bg-gray-700'
                }`}>
                {percent}%
              </button>
            ))}
            <div className='relative flex items-center'>
              <input
                type='number'
                placeholder='0.50'
                value={customSlippage || slippagePercent || ''}
                onChange={(e) => handleCustomSlippageChange(e.target.value)}
                onKeyDown={handleKeyDown}
                min='0'
                max='10'
                step='0.1'
                className={`input !outline-none bg-neutral text-neutral-content px-3 py-1 rounded-md w-20 pr-6  ${
                  isHighSlippage ? 'text-yellow-500' : isVeryHighSlippage ? 'text-red-500' : ''
                }`}
              />
              <span className='absolute right-2 text-neutral-content text-lg'>%</span>
            </div>
          </div>
          {slippageWarning && (
            <p className={`${isVeryHighSlippage ? 'text-red-500' : 'text-yellow-500'}`}>{slippageWarning}</p>
          )}
        </div>

        {/* Transaction Deadline */}
        <div className='flex flex-col gap-2'>
          <h1>Transaction deadline</h1>
          <div className='flex items-center'>
            <input
              type='number'
              value={localDeadline || ''}
              placeholder='10'
              onChange={(e) => handleDeadlineChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className='input bg-neutral !outline-none px-3 py-1 rounded-md w-20'
            />
            <span className='ml-2 text-lg'>minutes</span>
          </div>
        </div>

        {/* Token Approval */}
        <div className='flex flex-col gap-2'>
          <h1>Token Approval</h1>
          <div className='flex items-center justify-between'>
            <span>Allow Infinite approval</span>
            <button
              onClick={handleTokenApprovalChange}
              className={`relative inline-flex h-4 w-9 items-center rounded-full ${
                localTokenApproval === 'max' ? 'bg-secondary' : 'bg-gray-700'
              }`}>
              <span className='sr-only'>Allow Infinite approval</span>
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                  localTokenApproval === 'max' ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className='mb-6 -mt-0.5 text-sm gray-text'>
            {localTokenApproval === 'max'
              ? 'Lower gas fees, fewer transactions'
              : 'Higher security, approve per transaction'}
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`btn ${isSaveDisabled ? 'btn-disabled opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSaveDisabled}>
        Save
      </button>
    </ModalWrapper>
  )
}

export default SettingsModal

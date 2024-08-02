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

  useEffect(() => {
    setLocalSlippage(config.slippage)
    setLocalDeadline(config.deadline)
    setCustomSlippage('')
  }, [config, isVisible])

  const handleSlippageChange = useCallback((basisPoints: number) => {
    setLocalSlippage(basisPoints)
    setCustomSlippage('')
  }, [])

  const handleCustomSlippageChange = useCallback((value: string) => {
    setCustomSlippage(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue <= 10) {
      setLocalSlippage(percentToBasisPoints(numValue))
    }
  }, [])

  const handleDeadlineChange = useCallback((value: string) => {
    const deadline = parseInt(value)
    setLocalDeadline(isNaN(deadline) ? undefined : deadline)
  }, [])

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
      })
      onClose()
    }
  }

  return (
    <ModalWrapper isVisible={isVisible} onClose={closeModal} style={{ paddingBottom: '28px' }}>
      <h3 className='label text-lg my-4'>Transaction Settings</h3>

      {/* Slippage Tolerance */}
      <div className='mb-4'>
        <label className='label block mb-2 text-sm'>Slippage tolerance</label>
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
              min='0'
              max='10'
              step='0.1'
              className={`input input-bordered bg-gray-700 text-white px-3 py-1 rounded-md w-20 pr-6 ${
                isHighSlippage ? 'text-yellow-500' : isVeryHighSlippage ? 'text-red-500' : ''
              }`}
            />
            <span className='absolute right-2 text-white'>%</span>
          </div>
        </div>
        {slippageWarning && (
          <p className={`mt-2 text-sm ${isVeryHighSlippage ? 'text-red-500' : 'text-yellow-500'}`}>{slippageWarning}</p>
        )}
      </div>

      {/* Transaction Deadline */}
      <div className='mb-4'>
        <label className='label block mb-2 text-sm'>Transaction deadline</label>
        <div className='flex items-center'>
          <input
            type='number'
            value={localDeadline || ''}
            placeholder='20'
            onChange={(e) => handleDeadlineChange(e.target.value)}
            className='input input-bordered bg-gray-700 px-3 py-1 rounded-md w-20'
          />
          <span className='ml-2'>minutes</span>
        </div>
      </div>
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

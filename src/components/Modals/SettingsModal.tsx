import React from 'react'
import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import { SlippageOption } from '@/types/config'
import { useAppStore } from '@/store/useAppStore'

interface SettingsModalProps {
  isVisible: boolean
  onClose: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose }) => {
  const { config, updateConfig } = useAppStore()

  const handleSlippageChange = (value: SlippageOption | number) => {
    updateConfig({ slippage: value as SlippageOption })
  }

  const handleDeadlineChange = (value: string) => {
    updateConfig({ deadline: parseInt(value) || 20 })
  }

  const handleSave = () => {
    if (typeof config.slippage === 'number' && config.slippage > 100) {
      alert('Slippage tolerance cannot be more than 100%')
      return
    }
    onClose()
  }

  return (
    <ModalWrapper isVisible={isVisible} onClose={onClose} style={{ paddingBottom: '28px' }}>
      <h3 className='label text-lg my-4'>Transaction Settings</h3>

      {/* Slippage Tolerance */}
      <div className='mb-4'>
        <label className='label block mb-2 text-sm'>Slippage tolerance</label>
        <div className='flex space-x-2'>
          {[0.1, 0.5, 1].map((tolerance) => (
            <button
              key={tolerance}
              onClick={() => handleSlippageChange(tolerance)}
              className={`btn btn-settings ${config.slippage === tolerance ? 'bg-secondary' : 'bg-gray-700'}`}>
              {tolerance}%
            </button>
          ))}
          <div className='relative flex items-center'>
            <input
              type='number'
              placeholder='0.50'
              value={typeof config.slippage === 'number' ? config.slippage : ''}
              onChange={(e) => handleSlippageChange(parseFloat(e.target.value))}
              className={`input input-bordered bg-gray-700 text-white px-3 py-1 rounded-md w-20 pr-6 ${
                typeof config.slippage === 'number' && config.slippage > 100 ? 'text-red-500' : ''
              }`}
            />
            <span className='absolute right-2 text-white'>%</span>
          </div>
        </div>
      </div>

      {/* Transaction Deadline */}
      <div className='mb-4'>
        <label className='label block mb-2 text-sm'>Transaction deadline</label>
        <div className='flex items-center'>
          <input
            type='number'
            value={config.deadline || ''}
            placeholder='20'
            onChange={(e) => handleDeadlineChange(e.target.value)}
            className='input input-bordered bg-gray-700 px-3 py-1 rounded-md w-20'
          />
          <span className='ml-2'>minutes</span>
        </div>
      </div>
      <button onClick={handleSave} className='btn'>
        Save
      </button>
    </ModalWrapper>
  )
}

export default SettingsModal

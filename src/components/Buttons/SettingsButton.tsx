import { useAppStore } from '@/store/useAppStore'
import { basisPointsToPercent } from '@/utils/settings'
import React, { useState, useEffect } from 'react'

interface SettingsButtonProps {
  setIsSettingsModalVisible: (visible: boolean) => void
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ setIsSettingsModalVisible }) => {
  const { config } = useAppStore()
  const [slippagePercent, setSlippagePercent] = useState<number | null>(null)

  useEffect(() => {
    setSlippagePercent(basisPointsToPercent(config.slippage))
  }, [config.slippage])

  return (
    <button
      className='btn-outline flex items-center gap-2 text-neutral-content hover:text-neutral-content gear'
      onClick={() => setIsSettingsModalVisible(true)}>
      {slippagePercent !== null && slippagePercent !== 0.5 && (
        <span className='gray-text font-normal text-xs'>{slippagePercent}% slippage</span>
      )}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2'>
        <circle cx='12' cy='12' r='3'></circle>
        <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>
      </svg>
    </button>
  )
}

export default SettingsButton

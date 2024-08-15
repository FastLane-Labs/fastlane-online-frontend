import React, { useState, useEffect } from 'react'
import FlipButton from '@/components/Buttons/FlipButton'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SwapButton from '@/components/Buttons/SwapButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import BuyComponent from '@/components/Swap/BuyComponent'
import SellComponent from '@/components/Swap/SellComponent'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useSwapProcessManager } from '@/hooks/useSwapProcessManager'

const SwapView: React.FC = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const { handleSwap } = useHandleSwap()
  const { quoteLoading } = useSwapProcessManager()

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <div
        className='relative rounded-3xl bg-base-200/30'
        style={{ boxShadow: 'rgba(241, 32, 116, .2) 0px 5px 90px 4px' }}>
        <div className='gradient-bg relative max-w-md mx-auto p-4 rounded-3xl border border-accent'>
          <div className='flex justify-between items-center mb-2'>
            <div>
              <button className='btn btn-btn'>Swap</button>
            </div>
            <SettingsButton setIsSettingsModalVisible={setIsSettingsModalVisible} />
          </div>
          <SellComponent />
          <FlipButton />
          <BuyComponent />
          <SwapButton handleSwap={handleSwap} isLoading={quoteLoading} />
          <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
        </div>
      </div>
    </div>
  )
}

export default SwapView

import React, { useState } from 'react'
import FlipButton from '@/components/Buttons/FlipButton'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SwapButton from '@/components/Buttons/SwapButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import BuyComponent from '@/components/Swap/BuyComponent'
import SellComponent from '@/components/Swap/SellComponent'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useBaselineQuote } from '@/hooks/useBaselineQuote'

const SwapView: React.FC = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)

  const { handleSwap, isSwapping } = useHandleSwap()
  const isQuoteLoading = useBaselineQuote()

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <div
        className='relative rounded-3xl'
        style={{
          background: 'rgba(0, 0, 0, .3)',
        }}>
        <div
          className='relative max-w-md mx-auto p-4 rounded-3xl border border-accent'
          style={{
            background: 'linear-gradient(290deg, rgba(241,35,121, .1) 10%, rgba(7, 76, 255 , .1) 100%)',
            boxShadow: 'rgba(241, 32, 116, .2) 0px 5px 90px 4px',
          }}>
          <div className='flex justify-end items-center mb-2'>
            <SettingsButton setIsSettingsModalVisible={setIsSettingsModalVisible} />
          </div>

          <SellComponent />
          <FlipButton />
          <BuyComponent />

          <SwapButton handleSwap={handleSwap} isLoading={isSwapping || isQuoteLoading} />

          <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
        </div>
      </div>
    </div>
  )
}

export default SwapView

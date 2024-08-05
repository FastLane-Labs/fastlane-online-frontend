'use client'

import React from 'react'
import { NetworkStatus } from './NetworkStatus'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { useAppState } from '@/context/AppStateContext'
import IUXModal from '@/components/Modals/IUX'

export function Footer() {
  const { isIUXModalVisible, setIsIUXModalVisible } = useAppState()

  const handleIUXModalClose = () => {
    localStorage.setItem('isIUXModalClosed', 'true')
    setIsIUXModalVisible(false)
  }

  return (
    <div className='place-self-end'>
      <div className='flex items-center gap-1 p-4'>
        <NetworkStatus />
        <button onClick={() => setIsIUXModalVisible(true)}>
          <QuestionMarkCircleIcon className='h-5 w-5 mb-0.5 text-gray-400' />
        </button>
        <IUXModal isVisible={isIUXModalVisible} onClose={handleIUXModalClose} />
      </div>
    </div>
  )
}

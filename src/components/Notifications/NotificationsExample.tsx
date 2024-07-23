'use client'

import { useNotifications } from '@/context/Notifications'

export default function NotificationsExample() {
  const { Add, Clear } = useNotifications()

  return (
    <div className='flex-column align-center '>
      <div className='flex flex-wrap gap-4 mt-4'>
        <button className='btn-outline btn-sm btn-info' onClick={() => Add('Transaction sent..', { type: 'info' })}>
          Info
        </button>
        <button
          className='btn-outline btn-sm btn-success'
          onClick={() => Add('Transaction completed!', { type: 'success' })}>
          Success
        </button>
        <button
          className='btn-outline btn-sm btn-warning'
          onClick={() => Add('Unable to encode data', { type: 'warning' })}>
          Warning
        </button>
        <button
          className='btn-outline btn-sm btn-error'
          onClick={() => Add('Failed. Execution reverted', { type: 'error' })}>
          Error
        </button>
        <button
          className='btn-outline btn-sm btn-neutral'
          onClick={() =>
            Add('Transaction successfully completed!', {
              type: 'success',
              from: 'vitalik.eth',
              href: 'https://polygonscan.com/address/0xcace8d78269ba00f1c4d5fc3b1228c7df0a7c8ba',
            })
          }>
          Full example
        </button>

        <button className='btn-outline btn-sm btn-link' onClick={Clear}>
          Clear
        </button>
      </div>
    </div>
  )
}

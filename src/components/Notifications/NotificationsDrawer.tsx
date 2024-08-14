'use client'

import React, { useState } from 'react'
import { BellIcon as BellOutline } from '@heroicons/react/24/outline'
import { BellIcon as BellSolid } from '@heroicons/react/24/solid'
import { useNotificationStore, useTransactionStore } from '@/store/useAppStore'
import { ActivityItem } from './ActivityItem'
import { NotificationItem } from './NotificationItem'
import { AppNotification, TransactionParams } from '@/types'

export function NotificationsDrawer() {
  const { clearNotifications, notifications } = useNotificationStore()
  const { transactions, clearTransactions } = useTransactionStore()
  const [activeTab, setActiveTab] = useState<'notifications' | 'activity'>('activity')
  const className = 'shrink-0 h-5 w-5'

  const totalCount = notifications.length + transactions.length

  const onClose = () => {
    document.getElementById('my-drawer')?.click()
  }

  return (
    <div className='drawer drawer-end'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        <label
          htmlFor='my-drawer'
          role='button'
          className={`btn btn-navbar btn-ghost btn-sm ${totalCount === 0 ? 'text-gray-600' : ''} drawer-button`}>
          {totalCount > 0 && <BellSolid className={className} />}
          {totalCount === 0 && <BellOutline className={className} />}
        </label>
      </div>

      <div className='drawer-side z-[1]'>
        <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
        <div className='p-4 w-full md:w-80 min-h-full bg-base-100 relative'>
          <button className='btn-outline absolute top-3 right-3 text-neutral-content' onClick={onClose}>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
            </svg>
          </button>

          <div className='mt-10 mb-4'>
            <div className='tabs tabs-boxed bg-base-200'>
              <a
                className={`tab ${activeTab === 'activity' ? 'tab-active bg-primary text-primary-content' : 'text-base-content'}`}
                onClick={() => setActiveTab('activity')}>
                Activity
              </a>
              <a
                className={`tab ${activeTab === 'notifications' ? 'tab-active bg-primary text-primary-content' : 'text-base-content'}`}
                onClick={() => setActiveTab('notifications')}>
                Notifications
              </a>
            </div>
          </div>

          <div className='space-y-2 mt-4'>
            {activeTab === 'activity' && (
              <>
                {transactions.length === 0 && <p className='text-sm text-base-content/70'>No activity</p>}
                {transactions.map((transaction: TransactionParams, index: number) => (
                  <ActivityItem key={`transaction_${index}_${transaction.txHash}`} transaction={transaction} />
                ))}
                {transactions.length > 0 && (
                  <button className='btn btn-xs btn-link w-full mt-2' onClick={clearTransactions}>
                    Clear activity
                  </button>
                )}
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                {notifications.length === 0 && <p className='text-sm text-base-content/70'>No notifications</p>}
                {notifications.map((notification: AppNotification, index: number) => (
                  <NotificationItem
                    key={`notification_${index}_${notification.timestamp}`}
                    notification={notification}
                  />
                ))}
                {notifications.length > 0 && (
                  <button className='btn btn-xs btn-link w-full mt-2' onClick={clearNotifications}>
                    Clear notifications
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

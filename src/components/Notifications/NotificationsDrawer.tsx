'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid'
import { useTransactionStore } from '@/store/useAppStore'
import { ActivityItem } from './ActivityItem'
import { TransactionParams } from '@/types'

export function NotificationsDrawer() {
  const { transactions, clearTransactions } = useTransactionStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const onClose = () => {
    document.getElementById('notification-drawer')?.click()
  }

  // Sort transactions from newest to oldest
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const timestampA = a.timestamp || 0
      const timestampB = b.timestamp || 0
      return timestampB - timestampA
    })
  }, [transactions])

  if (!isClient) {
    return null // Or a loading spinner
  }

  return (
    <div className='drawer drawer-end'>
      <input id='notification-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        <label htmlFor='notification-drawer' className='btn btn-navbar btn-ghost btn-sm drawer-button'>
          <ChevronDoubleRightIcon className='h-5 w-5' />
        </label>
      </div>

      <div className='drawer-side z-[1]'>
        <label htmlFor='notification-drawer' className='drawer-overlay'></label>
        <aside className='w-full md:w-fit min-h-full text-gray-200 flex h-full rounded-bl-2xl rounded-tl-2xl'>
          {/* close drawer button */}
          <div className='btn-close-drawer' onClick={onClose}>
            <ChevronDoubleRightIcon className='h-5 w-5' />
          </div>
          {/* drawer */}
          <div className='w-full md:w-96 min-h-full bg-[#0f0f0f] flex flex-col z-10'>
            <header className='pt-4 px-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Activity</h2>
            </header>

            <main className='flex-grow overflow-y-auto p-4'>
              {sortedTransactions.length === 0 ? (
                <p className='text-sm text-gray-400'>No activity</p>
              ) : (
                <ul className='space-y-2 list-none p-0 m-0'>
                  {sortedTransactions.map((transaction: TransactionParams, index: number) => (
                    <li key={`transaction_${index}_${transaction.txHash}`}>
                      <ActivityItem transaction={transaction} />
                    </li>
                  ))}
                </ul>
              )}
            </main>

            {sortedTransactions.length > 0 && (
              <footer className='p-4 flex justify-end border-t border-gray-800'>
                <button className='btn btn-sm btn-ghost text-gray-200 hover:bg-gray-800' onClick={clearTransactions}>
                  Clear activity
                </button>
              </footer>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

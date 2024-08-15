'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
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
    document.getElementById('my-drawer')?.click()
  }

  if (!isClient) {
    return null // Or a loading spinner
  }

  return (
    <div className='drawer drawer-end'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        <label htmlFor='my-drawer' className='btn btn-navbar btn-ghost btn-sm drawer-button'>
          <ChevronRightIcon className='h-5 w-5' />
        </label>
      </div>

      <div className='drawer-side z-[1]'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <aside className='w-full md:w-80 min-h-full bg-[#0f0f0f] text-gray-200 flex flex-col'>
          <header className='p-4 flex items-center justify-between border-b border-gray-800'>
            <h2 className='text-lg font-semibold'>Activity</h2>
            <button onClick={onClose} className='bg-transparent border-none cursor-pointer'>
              <ChevronRightIcon className='h-5 w-5 text-gray-200' />
            </button>
          </header>

          <main className='flex-grow overflow-y-auto p-4'>
            {transactions.length === 0 ? (
              <p className='text-sm text-gray-400'>No activity</p>
            ) : (
              <ul className='space-y-2 list-none p-0 m-0'>
                {transactions.map((transaction: TransactionParams, index: number) => (
                  <li key={`transaction_${index}_${transaction.txHash}`}>
                    <ActivityItem transaction={transaction} />
                  </li>
                ))}
              </ul>
            )}
          </main>

          {transactions.length > 0 && (
            <footer className='p-4 flex justify-end border-t border-gray-800'>
              <button className='btn btn-sm btn-ghost text-gray-200 hover:bg-gray-800' onClick={clearTransactions}>
                Clear activity
              </button>
            </footer>
          )}
        </aside>
      </div>
    </div>
  )
}

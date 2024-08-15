'use client'

import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useTransactionStore } from '@/store/useAppStore'
import { ActivityItem } from './ActivityItem'
import { TransactionParams } from '@/types'

export function NotificationsDrawer() {
  const { transactions, clearTransactions } = useTransactionStore()

  const onClose = () => {
    document.getElementById('my-drawer')?.click()
  }

  return (
    <div className='drawer drawer-end'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        <label htmlFor='my-drawer' role='button' className='btn btn-navbar btn-ghost btn-sm drawer-button'>
          <ChevronRightIcon className='h-5 w-5' />
        </label>
      </div>

      <div className='drawer-side z-[1]'>
        <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
        <div className='w-full md:w-80 min-h-full bg-base-100 text-base-content flex flex-col'>
          <div className='p-4 flex items-center justify-between border-b border-base-300'>
            <h2 className='text-lg font-semibold text-base-content'>Activity</h2>
            <ChevronRightIcon className='h-5 w-5 cursor-pointer text-base-content' onClick={onClose} />
          </div>

          <div className='flex-grow overflow-y-auto p-4'>
            {transactions.length === 0 && <p className='text-sm text-base-content/70'>No activity</p>}
            {transactions.map((transaction: TransactionParams, index: number) => (
              <ActivityItem key={`transaction_${index}_${transaction.txHash}`} transaction={transaction} />
            ))}
          </div>

          {transactions.length > 0 && (
            <div className='p-4 flex justify-end border-t border-base-300'>
              <button className='btn btn-sm btn-ghost text-base-content' onClick={clearTransactions}>
                Clear activity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

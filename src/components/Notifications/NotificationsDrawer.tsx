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
          <div className='w-full md:w-96 h-full bg-[#0f0f0f] flex flex-col z-10'>
            <header className='pt-4 px-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Activity</h2>
            </header>

            <main className='flex-grow overflow-y-auto py-4 px-[17px]'>
              {sortedTransactions.length === 0 ? (
                <>
                  <div className='text-white items-center flex-col flex-wrap justify-center flex w-full h-full'>
                    <svg
                      className='w-24 h-24'
                      fill='none'
                      height='94'
                      viewBox='0 0 102 94'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        clipRule='evenodd'
                        d='M20.4998 9.00098L5.22859 13.3799C1.51236 14.4455 -0.636389 18.322 0.429224 22.0382L13.6352 68.093C14.7008 71.8092 18.5773 73.958 22.2935 72.8924L56.7921 63H31.4998C25.4246 63 20.4998 58.0752 20.4998 52V9.00098Z'
                        fill='rgb(64, 74, 103)'
                        fillRule='evenodd'
                      />
                      <path
                        clipRule='evenodd'
                        d='M31.5 0C27.634 0 24.5 3.13401 24.5 7V52C24.5 55.866 27.634 59 31.5 59H56.7364C60.5936 51.6192 67.8907 46.3207 76.5 45.2321V7C76.5 3.13401 73.366 0 69.5 0H31.5ZM37 19C38.3807 19 39.5 17.8807 39.5 16.5C39.5 15.1193 38.3807 14 37 14C35.6193 14 34.5 15.1193 34.5 16.5C34.5 17.8807 35.6193 19 37 19ZM39.5 29.5C39.5 30.8807 38.3807 32 37 32C35.6193 32 34.5 30.8807 34.5 29.5C34.5 28.1193 35.6193 27 37 27C38.3807 27 39.5 28.1193 39.5 29.5ZM37 45C38.3807 45 39.5 43.8807 39.5 42.5C39.5 41.1193 38.3807 40 37 40C35.6193 40 34.5 41.1193 34.5 42.5C34.5 43.8807 35.6193 45 37 45ZM44.5 16.5C44.5 15.1193 45.6193 14 47 14H64C65.3807 14 66.5 15.1193 66.5 16.5C66.5 17.8807 65.3807 19 64 19H47C45.6193 19 44.5 17.8807 44.5 16.5ZM47 27C45.6193 27 44.5 28.1193 44.5 29.5C44.5 30.8807 45.6193 32 47 32H64C65.3807 32 66.5 30.8807 66.5 29.5C66.5 28.1193 65.3807 27 64 27H47ZM44.5 42.5C44.5 41.1193 45.6193 40 47 40H64C65.3807 40 66.5 41.1193 66.5 42.5C66.5 43.8807 65.3807 45 64 45H47C45.6193 45 44.5 43.8807 44.5 42.5Z'
                        fill='rgb(64, 74, 103)'
                        fillRule='evenodd'
                      />
                      <path
                        clipRule='evenodd'
                        d='M79.7939 93.0254C91.9442 93.0254 101.794 83.1757 101.794 71.0254C101.794 58.8751 91.9442 49.0254 79.7939 49.0254C67.6437 49.0254 57.7939 58.8751 57.7939 71.0254C57.7939 83.1757 67.6437 93.0254 79.7939 93.0254ZM88.0433 71.0251L79.7936 62.7754L71.544 71.0251L79.7936 79.2748L88.0433 71.0251Z'
                        fill='rgb(210, 217, 238)'
                        fillRule='evenodd'
                      />
                    </svg>
                    <div className='text-center'>No activity yet</div>
                    <div className='text-neutral-400 text-sm text-center'>
                      Your onchain transactions will appear here.
                    </div>
                  </div>
                </>
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
              <footer className='p-4 flex justify-end'>
                <button className='btn btn-menu btn-clear-activity' onClick={clearTransactions}>
                  Clear Activity
                </button>
              </footer>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

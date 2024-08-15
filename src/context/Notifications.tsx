'use client'

import React, { createContext, PropsWithChildren, useContext, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useAccount } from 'wagmi'
import dayjs from 'dayjs'
import 'react-toastify/dist/ReactToastify.min.css'
import '@/assets/notifications.css'
import { StatusIcon } from '@/components/Notifications/Alert'
import { useTransactionStore } from '@/store/useAppStore'
import { TransactionHistoryStore, TransactionParams, TransactionStatus, AppNotification } from '@/types'

interface NotificationContext {
  sendNotification: (
    message: string,
    options?: Partial<Omit<AppNotification, 'message'>> & {
      transactionParams?: TransactionParams
      transactionHash?: string
      transactionStatus?: TransactionStatus
    }
  ) => void
  clearTransactions: () => void
  transactions: TransactionHistoryStore
}

const NotificationContext = createContext<NotificationContext | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: PropsWithChildren) {
  const { address } = useAccount()
  const transactionStore = useTransactionStore()

  const sendNotification = useCallback(
    (
      message: string,
      options?: Partial<Omit<AppNotification, 'message'>> & {
        transactionParams?: TransactionParams
        transactionHash?: string
        transactionStatus?: TransactionStatus
      }
    ) => {
      const timestamp = dayjs().valueOf()

      // Create and add notification
      const notification: AppNotification = {
        message,
        type: options?.type || 'info',
        timestamp: options?.timestamp || timestamp,
        from: options?.from || address,
        href: options?.href,
        ...options,
      }

      // Create a custom toast content
      const ToastContent = ({ closeToast }: { closeToast?: () => void }) => (
        <div
          onClick={() => {
            if (notification.href) {
              window.open(notification.href, '_blank')
            }
            if (closeToast) closeToast()
          }}
          className='flex items-center cursor-pointer w-full'>
          <StatusIcon type={notification.type} />
          <span className='ml-2 flex-grow'>{message}</span>
        </div>
      )

      // Send toast
      toast(ToastContent, {
        type: notification.type as any,
        icon: false, // Disable the default icon
        onClick: () => {
          if (notification.href) {
            window.open(notification.href, '_blank')
          }
        },
      })

      // Handle transaction creation if transactionParams is present
      if (options?.transactionParams) {
        transactionStore.addTransaction({
          ...options.transactionParams,
          timestamp,
        })
      }

      // Handle transaction update if transactionHash is present
      if (options?.transactionHash && options?.transactionStatus) {
        transactionStore.updateTransactionStatus(options.transactionHash, options.transactionStatus, timestamp)
      }
    },
    [address, transactionStore]
  )

  const contextValue: NotificationContext = {
    sendNotification,
    clearTransactions: transactionStore.clearTransactions,
    transactions: transactionStore.transactions,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        limit={5}
        theme='dark'
        position='bottom-center'
        toastClassName={() => 'bg-secondary-content rounded-xl overflow-hidden p-2 mb-2'}
        bodyClassName={() => 'p-0 m-0'} // Remove padding from body
      />
    </NotificationContext.Provider>
  )
}

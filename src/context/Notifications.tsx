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
        timestamp: options?.timestamp || dayjs().valueOf(),
        from: options?.from || address,
        ...options,
      }

      // Send toast
      toast(message, { type: notification.type as any, icon: <StatusIcon type={notification.type} /> })

      // Handle transaction creation if transactionParams is present
      if (options?.transactionParams) {
        transactionStore.addTransaction({
          ...options.transactionParams,
          timestamp,
        })
      }

      // Handle transaction update if transactionHash is present
      if (options?.transactionHash && options?.transactionStatus) {
        transactionStore.updateTransactionStatus(options.transactionHash, options.transactionStatus)
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
        toastClassName={() => 'flex relative bg-secondary-content rounded-xl justify-between overflow-hidden p-2 mb-2'}
        bodyClassName={() => 'flex text-sm gap-2 px-4 py-2'}
      />
    </NotificationContext.Provider>
  )
}

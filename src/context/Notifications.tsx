'use client'
import React, { createContext, PropsWithChildren, useContext, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useAccount } from 'wagmi'
import dayjs from 'dayjs'
import 'react-toastify/dist/ReactToastify.min.css'
import '@/assets/notifications.css'
import { StatusIcon } from '@/components/Notifications/Alert'
import { useNotificationStore } from '@/store/useAppStore'
import { TransactionHistoryStore, TransactionParams, TransactionStatus, AppNotification } from '@/types'

interface NotificationContext {
  addNotification: (message: string, options?: Partial<Omit<AppNotification, 'message'>>) => void
  clearNotifications: () => void
  notifications: AppNotification[]
  addTransaction: (transaction: TransactionParams) => void
  updateTransactionStatus: (txHash: string, status: TransactionStatus) => void
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
  const store = useNotificationStore()

  const addNotification = useCallback(
    (message: string, options?: Partial<Omit<AppNotification, 'message'>>) => {
      const notification: AppNotification = {
        message,
        type: options?.type || 'info',
        timestamp: options?.timestamp || dayjs().valueOf(),
        from: options?.from || address,
        ...options,
      }
      store.addNotification(notification)
      toast(message, { type: notification.type as any, icon: <StatusIcon type={notification.type} /> })
    },
    [address, store]
  )

  const contextValue: NotificationContext = {
    addNotification,
    clearNotifications: store.clearNotifications,
    notifications: store.notifications,
    addTransaction: store.addTransaction,
    updateTransactionStatus: store.updateTransactionStatus,
    clearTransactions: store.clearTransactions,
    transactions: store.transactions,
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

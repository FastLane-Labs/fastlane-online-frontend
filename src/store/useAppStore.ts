import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AppRoute } from '@/core/routes'
import type { TransactionHistoryStore, TransactionParams, TransactionStatus } from '@/types'
import { defaultValues } from '@/constants'
import { AppConfig } from '@/types/config'
import { AppNotification } from '@/types/notification'

export interface AppConfigState {
  fromPrice?: string
  toPrice?: number
  currentTransaction?: TransactionParams
  currentQuoteId?: string // unique id for the quote
  config: AppConfig
}

// Separate interface for NotificationStore
interface NotificationStore {
  notifications: AppNotification[]
  addNotification: (notification: AppNotification) => void
  clearNotifications: () => void
}

// Separate interface for TransactionStore
interface TransactionStore {
  transactions: TransactionHistoryStore
  addTransaction: (transaction: TransactionParams) => void
  updateTransactionStatus: (txHash: string, status: TransactionStatus, timestamp: number) => void
  clearTransactions: () => void
}

export const useAppStore = create<AppConfigState & { updateConfig: (newConfig: Partial<AppConfig>) => void }>()(
  persist(
    (set) => ({
      ...defaultValues,
      updateConfig: (newConfig) =>
        set((state) => ({
          ...state,
          config: {
            ...state.config,
            ...newConfig,
          },
        })),
    }),
    {
      name: 'app.config.storage',
      version: 1,
    }
  )
)

export interface AppRouter {
  history: {
    route: AppRoute
    params?: { [key: string]: any | undefined }
  }[]
}

export const useAppRouterStore = create<AppRouter>((_) => ({
  history: [
    {
      route: {
        id: 'swap',
        path: '/',
        title: 'Swap',
        headerButtons: ['settings', 'history'],
      },
    },
  ],
}))

// Persisted Transaction store
export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (transaction: TransactionParams) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      updateTransactionStatus: (txHash: string, status: TransactionStatus, timestamp: number) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.txHash === txHash ? { ...t, status, timestamp } : t)),
        })),
      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: 'app.transaction.store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

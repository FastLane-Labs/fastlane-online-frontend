import { Token } from './token'

export type TransactionHistoryStore = TransactionParams[]

export type RouteType = 'swap' | 'approval'
export interface TransactionParams {
  routeType: RouteType
  chainId: number
  fromToken: Token
  toToken?: Token
  nonce?: number
  txHash: string
  timestamp?: number
  status: TransactionStatus
  error?: TransactionErrorWithMessage
  fromAddress?: string
  statusResponse?: any
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed'
export type TransactionErrorWithMessage = { message: string }

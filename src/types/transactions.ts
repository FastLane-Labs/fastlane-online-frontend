import { Token } from './token'

export type TransactionHistoryStore = TransactionParams[]

export type RouteType = 'swap' | 'approval' | 'wrap' | 'unwrap'
export interface TransactionParams {
  routeType: RouteType
  chainId: number
  fromToken: Token
  fromAmount: string
  toToken?: Token
  toAmount?: string
  nonce?: number
  txHash: string
  timestamp?: number
  status: TransactionStatus
  error?: TransactionErrorWithMessage
  fromAddress?: string
  statusResponse?: any
  boosted: boolean
  boostedAmount?: string
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed'
export type TransactionErrorWithMessage = { message: string }

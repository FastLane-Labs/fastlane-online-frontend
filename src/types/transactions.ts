import { Token } from './token'

export type TransactionHistoryStore = TransactionParams[]

export type RouteType = 'swap' | 'approval'
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
  boosted: boolean // Keep this to indicate if the swap was boosted
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed'
export type TransactionErrorWithMessage = { message: string }

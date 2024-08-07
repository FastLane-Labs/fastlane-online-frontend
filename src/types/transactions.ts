export type TransactionHistoryStore = TransactionParams[]

export interface TransactionParams {
  routeType: string
  chainId: number
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

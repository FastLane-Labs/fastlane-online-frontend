export interface SwapIntent {
  tokenUserBuys: string
  minAmountUserBuys: bigint
  tokenUserSells: string
  amountUserSells: bigint
}

export interface BaselineCall {
  to: string
  data: string
  success: boolean
}

export interface UserOperation {
  from: string
  to: string
  value: bigint
  gas: bigint
  maxFeePerGas: bigint
  nonce: bigint
  deadline: bigint
  dapp: string
  control: string
  callConfig: number
  sessionKey: string
  data: string
  signature: string
}

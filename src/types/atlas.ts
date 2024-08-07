export interface SwapIntent {
  tokenUserBuys: string
  minAmountUserBuys: bigint
  tokenUserSells: string
  amountUserSells: bigint
}

export interface BaselineCall {
  to: string
  data: string
  value: bigint
}

export interface UserOperationParams {
  from: string
  to: string
  value: bigint
  gas: bigint
  maxFeePerGas: bigint
  nonce: bigint
  deadline: bigint
  dapp: string
  control: string
  sessionKey: string
  data: string
  signature?: string
}

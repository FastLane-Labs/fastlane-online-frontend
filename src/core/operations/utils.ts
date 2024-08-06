import { isAddress, ZeroAddress } from 'ethers'
import { UserOperation } from './user'

export const ZeroUint = 0n
export const ZeroBytes = '0x'

export function validateAddress(address: string): boolean {
  // isAddress returns true for ICAP addresses, add a length check to exclude them
  return isAddress(address) && address.length === 42
}

export function validateUint32(value: bigint): boolean {
  return value <= 2n ** 32n - 1n
}

export function validateUint256(value: bigint): boolean {
  return value <= 2n ** 256n - 1n
}

export function validateBytes32(value: string): boolean {
  return /^0x[0-9a-f]{64}$/.test(value)
}

export function validateBytes(value: string): boolean {
  return /^0x([0-9a-f][0-9a-f])*$/.test(value)
}

export function newUserOperation(prop: {
  from: string
  to: string
  value: bigint
  gas: bigint
  maxFeePerGas: bigint
  nonce?: bigint
  deadline: bigint
  dapp: string
  control: string
  sessionKey?: string
  data: string
  signature?: string
}): UserOperation {
  const userOp = new UserOperation()
  userOp.setFields({
    from: prop.from,
    to: prop.to,
    value: prop.value,
    gas: prop.gas,
    maxFeePerGas: prop.maxFeePerGas,
    nonce: prop.nonce || ZeroUint,
    deadline: prop.deadline,
    dapp: prop.dapp,
    control: prop.control,
    sessionKey: prop.sessionKey || ZeroAddress,
    data: prop.data,
    signature: prop.signature || ZeroBytes,
  })

  userOp.validateFields()
  return userOp
}

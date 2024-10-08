import { BaseOperation, OpField } from './base'

export class UserOperation extends BaseOperation {
  protected fields: Map<string, OpField> = new Map([
    ['from', { name: 'from', solType: 'address' }],
    ['to', { name: 'to', solType: 'address' }],
    ['value', { name: 'value', solType: 'uint256' }],
    ['gas', { name: 'gas', solType: 'uint256' }],
    ['maxFeePerGas', { name: 'maxFeePerGas', solType: 'uint256' }],
    ['nonce', { name: 'nonce', solType: 'uint256' }],
    ['deadline', { name: 'deadline', solType: 'uint256' }],
    ['dapp', { name: 'dapp', solType: 'address' }],
    ['control', { name: 'control', solType: 'address' }],
    ['callConfig', { name: 'callConfig', solType: 'uint32' }],
    ['sessionKey', { name: 'sessionKey', solType: 'address' }],
    ['data', { name: 'data', solType: 'bytes' }],
    ['signature', { name: 'signature', solType: 'bytes' }],
  ])

  constructor() {
    super('UserOperation')
  }
}

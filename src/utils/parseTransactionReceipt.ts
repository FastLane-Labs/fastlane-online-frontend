import { ethers, Log, TransactionReceipt } from 'ethers'

interface ParsedEvent {
  name: string
  args: Record<string, unknown>
}

interface ParsedTransactionReceipt {
  events: ParsedEvent[]
  isSolverTxSuccessful: boolean
  userReceivedAmount: bigint | null
  baselineAmountOut: bigint | null
  boostedAmount: bigint | null
}

const CONSOLIDATE_EVENTS_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'solverTo', type: 'address' },
      { indexed: true, internalType: 'address', name: 'solverFrom', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'executed', type: 'bool' },
      { indexed: false, internalType: 'bool', name: 'success', type: 'bool' },
      { indexed: false, internalType: 'uint256', name: 'result', type: 'uint256' },
    ],
    name: 'SolverTxResult',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer', // ERC20 transfer event
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'userMinAmountOut', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'baselineAmountOut', type: 'uint256' },
    ],
    name: 'BaselineEstablished',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
]

export const parseTransactionReceipt = (
  receipt: TransactionReceipt,
  userAddress: string,
  nativeOutput: boolean
): ParsedTransactionReceipt => {
  const events: ParsedEvent[] = []
  const iface = new ethers.Interface(CONSOLIDATE_EVENTS_ABI)
  let isSolverTxSuccessful = false
  let userReceivedAmount: bigint = 0n
  let baselineAmountOut: bigint = 0n
  let boostedAmount: bigint = 0n

  receipt.logs.forEach((log: Log) => {
    try {
      const parsedLog = iface.parseLog(log)
      if (parsedLog) {
        const args: Record<string, unknown> = {}
        for (let i = 0; i < parsedLog.args.length; i++) {
          const input = parsedLog.fragment.inputs[i]
          args[input.name] = parsedLog.args[i]
        }

        const parsedEvent: ParsedEvent = {
          name: parsedLog.name,
          args: args,
        }
        events.push(parsedEvent)

        switch (parsedEvent.name) {
          case 'SolverTxResult':
            if (parsedEvent.args.success === true) {
              isSolverTxSuccessful = true
            }
            break
          case 'Transfer':
            if (!nativeOutput && parsedEvent.args.to === userAddress) {
              userReceivedAmount += BigInt((parsedEvent.args.value as string) || (parsedEvent.args.amount as string))
            }
            break
          case 'Withdrawal':
            if (nativeOutput && parsedEvent.args.src === userAddress) {
              userReceivedAmount = BigInt(parsedEvent.args.wad as string)
            }
            break
          case 'BaselineEstablished':
            baselineAmountOut = BigInt(parsedEvent.args.baselineAmountOut as string)
            break
        }
      }
    } catch (error) {
      console.warn('Failed to parse log:', log)
    }
  })

  // Calculate boosted amount
  if (userReceivedAmount > 0n && baselineAmountOut > 0n) {
    boostedAmount = userReceivedAmount - baselineAmountOut
  }

  return { events, isSolverTxSuccessful, userReceivedAmount, baselineAmountOut, boostedAmount }
}

import { ethers, Log, TransactionReceipt } from 'ethers'

interface ParsedEvent {
  name: string
  args: Record<string, unknown>
}

interface ParsedTransactionReceipt {
  events: ParsedEvent[]
  isSolverTxSuccessful: boolean
  userReceivedAmount: bigint | null
}

const ABI = [
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
    name: 'Transfer',
    type: 'event',
  },
]

export const parseTransactionReceipt = (receipt: TransactionReceipt, userAddress: string): ParsedTransactionReceipt => {
  const events: ParsedEvent[] = []
  const iface = new ethers.Interface(ABI)
  let isSolverTxSuccessful = false
  let userReceivedAmount: bigint | null = null

  receipt.logs.forEach((log: Log) => {
    try {
      const parsedLog = iface.parseLog(log)
      if (parsedLog && (parsedLog.name === 'SolverTxResult' || parsedLog.name === 'Transfer')) {
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

        // Check for successful SolverTxResult
        if (parsedEvent.name === 'SolverTxResult' && parsedEvent.args.success === true) {
          isSolverTxSuccessful = true
        }

        // Get transfer amount to user
        if (parsedEvent.name === 'Transfer' && parsedEvent.args.to === userAddress) {
          userReceivedAmount = BigInt(parsedEvent.args.value as string)
        }
      }
    } catch (error) {
      console.warn('Failed to parse log:', log)
    }
  })

  return { events, isSolverTxSuccessful, userReceivedAmount }
}

export const logParsedReceipt = (parsedReceipt: ParsedTransactionReceipt) => {
  if (parsedReceipt.isSolverTxSuccessful) {
    console.log('Swap was successful')
    if (parsedReceipt.userReceivedAmount !== null) {
      console.log('User received amount:', parsedReceipt.userReceivedAmount.toString())
    } else {
      console.warn('User received amount not found in the receipt')
    }
  } else {
    console.warn('No successful solver transactions found in the receipt')
  }
}

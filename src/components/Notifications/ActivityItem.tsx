import React from 'react'
import { TransactionParams } from '@/types'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid'

interface ActivityItemProps {
  transaction: TransactionParams
}

export function ActivityItem({ transaction }: ActivityItemProps) {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'confirmed':
        return <CheckCircleIcon className='h-6 w-6 text-success' />
      case 'failed':
        return <XCircleIcon className='h-6 w-6 text-error' />
      case 'pending':
      default:
        return <ClockIcon className='h-6 w-6 text-warning' />
    }
  }

  const getStatusText = () => {
    switch (transaction.status) {
      case 'confirmed':
        return transaction.routeType === 'approval' ? 'Approved' : 'Swapped'
      case 'failed':
        return 'Failed'
      case 'pending':
      default:
        return transaction.routeType === 'approval' ? 'Approving' : 'Swapping'
    }
  }

  return (
    <div className='flex items-center space-x-3 p-2 bg-base-200 rounded-lg'>
      <div className='flex-shrink-0'>{getStatusIcon()}</div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-base-content'>{getStatusText()}</p>
        <div className='flex items-center space-x-1'>
          <img
            src={transaction.fromToken.logoURI}
            alt={transaction.fromToken.symbol}
            className='w-4 h-4 rounded-full'
          />
          <p className='text-sm text-base-content/70'>{transaction.fromToken.symbol}</p>
          {transaction.toToken && (
            <>
              <span className='text-base-content/50'>→</span>
              <img
                src={transaction.toToken.logoURI}
                alt={transaction.toToken.symbol}
                className='w-4 h-4 rounded-full'
              />
              <p className='text-sm text-base-content/70'>{transaction.toToken.symbol}</p>
            </>
          )}
        </div>
      </div>
      <div className='flex-shrink-0 text-sm text-base-content/50'>
        {transaction.timestamp
          ? new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : ''}
      </div>
    </div>
  )
}

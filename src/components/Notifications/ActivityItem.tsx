import React from 'react'
import { TransactionParams } from '@/types'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid'
import { shortFormat } from '@/utils/format'

interface ActivityItemProps {
  transaction: TransactionParams
}

export function ActivityItem({ transaction }: ActivityItemProps) {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'confirmed':
        return <CheckCircleIcon className='h-6 w-6 text-green-500' />
      case 'failed':
        return <XCircleIcon className='h-6 w-6 text-red-500' />
      case 'pending':
      default:
        return <ClockIcon className='h-6 w-6 text-yellow-500' />
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
    <article className='flex items-center space-x-3 p-2 bg-[#0f0f0f] rounded-lg border border-gray-800'>
      <div className='flex-shrink-0'>
        {transaction.routeType === 'approval' ? (
          <img
            src={transaction.fromToken.logoURI}
            alt={transaction.fromToken.symbol}
            className='w-6 h-6 rounded-full'
          />
        ) : (
          <div className='relative w-6 h-6'>
            <img
              src={transaction.fromToken.logoURI}
              alt={transaction.fromToken.symbol}
              className='absolute top-0 left-0 w-4 h-4 rounded-full'
            />
            {transaction.toToken && (
              <img
                src={transaction.toToken.logoURI}
                alt={transaction.toToken.symbol}
                className='absolute bottom-0 right-0 w-4 h-4 rounded-full'
              />
            )}
          </div>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium text-gray-200'>{getStatusText()}</span>
          {transaction.timestamp && (
            <time className='text-xs text-gray-400' suppressHydrationWarning>
              {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </time>
          )}
        </div>
        <p className='text-xs text-gray-400 mt-1'>
          {transaction.routeType === 'approval' ? (
            transaction.fromToken.symbol
          ) : (
            <>
              {shortFormat(BigInt(transaction.fromAmount), transaction.fromToken.decimals, 4)}{' '}
              {transaction.fromToken.symbol}
              {transaction.toToken && transaction.toAmount && (
                <>
                  {' to '}
                  {shortFormat(BigInt(transaction.toAmount), transaction.toToken.decimals, 4)}{' '}
                  {transaction.toToken.symbol}
                </>
              )}
            </>
          )}
        </p>
      </div>
      <div className='flex-shrink-0'>{getStatusIcon()}</div>
    </article>
  )
}

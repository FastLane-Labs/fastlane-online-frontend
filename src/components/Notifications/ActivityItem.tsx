'use client'
import React from 'react'
import { TransactionParams } from '@/types'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid'
import { shortFormat } from '@/utils/format'
import dayjs from 'dayjs'
import { getBlockExplorerUrl } from '@/utils/getBlockExplorerUrl'
import Image from 'next/image'
import { formatUnits } from 'ethers'

interface ActivityItemProps {
  transaction: TransactionParams
}

export function ActivityItem({ transaction }: ActivityItemProps) {
  const formatRelativeTime = (timestamp: number) => {
    const now = dayjs()
    const transactionTime = dayjs(timestamp)

    if (now.diff(transactionTime, 'day') >= 7) {
      return transactionTime.format('MMM D')
    } else {
      return transactionTime.fromNow(true)
    }
  }

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
        if (transaction.routeType === 'approval') return 'Approved'
        if (transaction.routeType === 'wrap') return 'Wrapped'
        if (transaction.routeType === 'unwrap') return 'Unwrapped'
        return 'Swapped'
      case 'failed':
        return 'Failed'
      case 'pending':
      default:
        if (transaction.routeType === 'approval') return 'Approving'
        if (transaction.routeType === 'wrap') return 'Wrapping'
        if (transaction.routeType === 'unwrap') return 'Unwrapping'
        return 'Swapping'
    }
  }

  const getTransactionUrl = () => {
    if (transaction.txHash && transaction.chainId) {
      const baseUrl = getBlockExplorerUrl(transaction.chainId)
      return `${baseUrl}tx/${transaction.txHash}`
    }
    return null
  }

  const getBoostedTooltipContent = () => {
    if (transaction.boosted && transaction.toToken && transaction.boostedAmount) {
      const boostedAmount = formatUnits(transaction.boostedAmount, transaction.toToken.decimals)
      return `${boostedAmount}`
    }
    return ''
  }

  const transactionUrl = getTransactionUrl()

  return (
    <article
      className='flex items-center space-x-3 p-2 bg-[#0f0f0f] rounded-lg border border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors'
      onClick={() => {
        if (transactionUrl) {
          window.open(transactionUrl, '_blank')
        }
      }}>
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
      <div className='flex flex-col gap-1 w-full'>
        <div className='w-full flex-1 flex justify-between min-w-0'>
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-gray-200'>{getStatusText()}</span>
          </div>
          <div className='flex items-center gap-1'>
            {transaction.boosted && transaction.toToken && (
              <div className='tooltip tooltip-left' data-tip={getBoostedTooltipContent()}>
                <div className='flex items-center space-x-1'>
                  <span className='text-xs text-gray-400'>
                    {transaction.boostedAmount
                      ? shortFormat(BigInt(transaction.boostedAmount), transaction.toToken.decimals, 4)
                      : '0'}{' '}
                    {transaction.toToken.symbol}
                  </span>
                  <span className='text-xs bg-gradient-to-br from-primary-content to-secondary bg-clip-text text-transparent'>
                    Boosted
                  </span>
                  <Image
                    src='/rocketboost-logo-extracted.png'
                    alt='Boosted'
                    width={10}
                    height={10}
                    className='opacity-70'
                  />
                </div>
              </div>
            )}
            <div className='flex-shrink-0'>{getStatusIcon()}</div>
          </div>
        </div>

        <div className='flex justify-between'>
          <p className='text-xs text-gray-400 mt-0.5 text-nowrap md:max-w-60 overflow-x-auto'>
            {transaction.routeType === 'approval' ? (
              transaction.fromToken.symbol
            ) : (
              <>
                {shortFormat(BigInt(transaction.fromAmount), transaction.fromToken.decimals, 2)}{' '}
                {transaction.fromToken.symbol}
                {transaction.toToken && transaction.toAmount && (
                  <>
                    {' to '}
                    {shortFormat(BigInt(transaction.toAmount), transaction.toToken.decimals, 2)}{' '}
                    {transaction.toToken.symbol}
                  </>
                )}
              </>
            )}
          </p>
          {transaction.timestamp && (
            <time className='text-xs text-gray-400' suppressHydrationWarning>
              {formatRelativeTime(transaction.timestamp)}
            </time>
          )}
        </div>
      </div>
    </article>
  )
}

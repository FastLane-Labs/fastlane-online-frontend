'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { calculateExchangeRate } from '@/utils/exchangeRate'
import { useAppStore } from '@/store/useAppStore'
import { useEstimatedSwapFees } from '@/hooks/useEstimatedSwapFees'
import { formatEther } from 'ethers'
import { useTokenUsdPrice } from '@/hooks/useTokenUsdPrice'
import { shortFormat } from '@/utils/format'

const SwapDetails = () => {
  const { fromToken, toToken, fromAmount, toAmount, quote, nativeToken } = useSwapStateContext()
  const { config } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFeeInUsd, setShowFeeInUsd] = useState(false)
  const { data: estimatedFees } = useEstimatedSwapFees()
  const { data: nativeTokenUsdPrice } = useTokenUsdPrice(nativeToken)

  const exchangeRate = useMemo(() => {
    if (fromToken && toToken && fromAmount && toAmount) {
      return calculateExchangeRate(fromToken, toToken, fromAmount, toAmount)
    }
    return '0'
  }, [fromToken, toToken, fromAmount, toAmount])

  const priceImpact = useMemo(() => {
    if (!quote) return null
    return parseFloat(quote.priceImpact)
  }, [quote])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleFeeDisplay = () => {
    setShowFeeInUsd(!showFeeInUsd)
  }

  const formattedNetworkCost = useMemo(() => {
    if (exchangeRate === '0') return '0'
    const totalFees = estimatedFees ? parseFloat(formatEther(estimatedFees.totalFeesInWei)) : 0
    const formattedNetworkCost = totalFees.toFixed(6)
    if (showFeeInUsd && nativeTokenUsdPrice) {
      const usdFees = totalFees * nativeTokenUsdPrice
      return `$${usdFees.toFixed(4)}`
    }
    return formattedNetworkCost
  }, [estimatedFees, showFeeInUsd, nativeTokenUsdPrice, exchangeRate])

  const minimumReceived = useMemo(() => {
    if (!quote || !toToken) return 'N/A'
    const amountOut = quote.amountOutMin ?? quote.amountOut
    return `${shortFormat(amountOut, toToken.decimals, 4)} ${toToken.symbol}`
  }, [quote, toToken])

  const [slippageValue, setSlippageValue] = useState('0%')

  useEffect(() => {
    setSlippageValue(`${config.slippage / 100}%`)
  }, [config.slippage])

  return (
    <div className='flex flex-col w-full px-3 justify-start text-sm pt-3 gap-2'>
      <button className='flex justify-between items-center' onClick={toggleExpand}>
        <span className={`text-neutral-content text-nowrap ${exchangeRate === '0' ? 'invisible' : 'visible'}`}>
          1 {fromToken?.symbol} = {exchangeRate.slice(0, 12)} {toToken?.symbol}
        </span>
        <div className='flex items-center justify-end gap-2'>
          {!isExpanded && exchangeRate !== '0' && (
            <div className='hidden sm:flex items-center justify-start gap-1 gray-text'>
              <svg className='w-4 h-4' fill='none' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path
                  clipRule='evenodd'
                  d='M15.3078 1.77827C15.7064 1.39599 16.3395 1.40923 16.7217 1.80783L20.9689 6.23633C21.2428 6.47474 21.4729 6.76205 21.6459 7.08464C21.8481 7.43172 22 7.84819 22 8.32698V16.7012C22 18.2484 20.7455 19.5 19.2 19.5C17.6536 19.5 16.4 18.2464 16.4 16.7V14.3999C16.4 13.8476 15.9523 13.3999 15.4 13.3999H14V20.5C14 20.569 13.9965 20.6372 13.9897 20.7045C13.9515 21.08 13.8095 21.4249 13.5927 21.7098C13.2274 22.19 12.6499 22.5 12 22.5H4C3.30964 22.5 2.70098 22.1502 2.34157 21.6182C2.12592 21.299 2.00001 20.9142 2 20.5V5.4999C2 3.84305 3.34315 2.4999 5 2.4999H11C12.6569 2.4999 14 3.84305 14 5.4999V11.3999H15.4C17.0569 11.3999 18.4 12.7431 18.4 14.3999V16.7C18.4 17.1418 18.7582 17.5 19.2 17.5C19.6427 17.5 20 17.1422 20 16.7012V11.3292C19.6872 11.4397 19.3506 11.4999 19 11.4999C17.3431 11.4999 16 10.1568 16 8.4999C16 7.28851 16.718 6.24482 17.7517 5.77117L15.2783 3.19217C14.896 2.79357 14.9092 2.16055 15.3078 1.77827ZM19.6098 7.70731C19.441 7.57725 19.2296 7.4999 19 7.4999C18.4477 7.4999 18 7.94762 18 8.4999C18 9.05219 18.4477 9.4999 19 9.4999C19.5523 9.4999 20 9.05219 20 8.4999C20 8.34084 19.9629 8.19045 19.8968 8.05693C19.8303 7.95164 19.7349 7.83559 19.6098 7.70731ZM5.21572 4.72463C4.66343 4.72463 4.21572 5.17235 4.21572 5.72463V9.72463C4.21572 10.2769 4.66343 10.7246 5.21572 10.7246H10.7157C11.268 10.7246 11.7157 10.2769 11.7157 9.72463V5.72463C11.7157 5.17235 11.268 4.72463 10.7157 4.72463H5.21572Z'
                  fill='rgb(94, 94, 94)'
                  fillRule='evenodd'
                />
              </svg>
              <span className='text-end gray-text text-nowrap'>{formattedNetworkCost}</span>
            </div>
          )}
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronDownIcon className='w-5 h-5' />
          </div>
        </div>
      </button>

      {/* expandable info */}
      <div
        className={`expandable-content flex flex-col w-full gap-2 ${isExpanded ? 'expanding expanded' : 'collapsing'}`}>
        <div className='flex w-full items-center justify-between'>
          <h3 className='gray-text'>Network cost</h3>
          <div
            className='custom-tooltip md:tooltip md:tooltip-left lg:tooltip-right'
            data-tip='Network cost is paid in MATIC on the POLYGON network in order to transact. If decentralized solvers provide a better price, some amount of network costs are refunded.'>
            <div className='flex items-center justify-start gap-1 gray-text cursor-pointer' onClick={toggleFeeDisplay}>
              <svg className='w-4 h-4' fill='none' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path
                  clipRule='evenodd'
                  d='M15.3078 1.77827C15.7064 1.39599 16.3395 1.40923 16.7217 1.80783L20.9689 6.23633C21.2428 6.47474 21.4729 6.76205 21.6459 7.08464C21.8481 7.43172 22 7.84819 22 8.32698V16.7012C22 18.2484 20.7455 19.5 19.2 19.5C17.6536 19.5 16.4 18.2464 16.4 16.7V14.3999C16.4 13.8476 15.9523 13.3999 15.4 13.3999H14V20.5C14 20.569 13.9965 20.6372 13.9897 20.7045C13.9515 21.08 13.8095 21.4249 13.5927 21.7098C13.2274 22.19 12.6499 22.5 12 22.5H4C3.30964 22.5 2.70098 22.1502 2.34157 21.6182C2.12592 21.299 2.00001 20.9142 2 20.5V5.4999C2 3.84305 3.34315 2.4999 5 2.4999H11C12.6569 2.4999 14 3.84305 14 5.4999V11.3999H15.4C17.0569 11.3999 18.4 12.7431 18.4 14.3999V16.7C18.4 17.1418 18.7582 17.5 19.2 17.5C19.6427 17.5 20 17.1422 20 16.7012V11.3292C19.6872 11.4397 19.3506 11.4999 19 11.4999C17.3431 11.4999 16 10.1568 16 8.4999C16 7.28851 16.718 6.24482 17.7517 5.77117L15.2783 3.19217C14.896 2.79357 14.9092 2.16055 15.3078 1.77827ZM19.6098 7.70731C19.441 7.57725 19.2296 7.4999 19 7.4999C18.4477 7.4999 18 7.94762 18 8.4999C18 9.05219 18.4477 9.4999 19 9.4999C19.5523 9.4999 20 9.05219 20 8.4999C20 8.34084 19.9629 8.19045 19.8968 8.05693C19.8303 7.95164 19.7349 7.83559 19.6098 7.70731ZM5.21572 4.72463C4.66343 4.72463 4.21572 5.17235 4.21572 5.72463V9.72463C4.21572 10.2769 4.66343 10.7246 5.21572 10.7246H10.7157C11.268 10.7246 11.7157 10.2769 11.7157 9.72463V5.72463C11.7157 5.17235 11.268 4.72463 10.7157 4.72463H5.21572Z'
                  fill='rgb(94, 94, 94)'
                  fillRule='evenodd'
                />
              </svg>
              <span className='text-end'>{formattedNetworkCost}</span>
            </div>
          </div>
        </div>

        <div className='flex w-full items-center justify-between'>
          <h3 className='gray-text'>Price impact</h3>
          <div
            className='custom-tooltip md:tooltip md:tooltip-left lg:tooltip-right'
            data-tip='The impact your trade has on the market price of this pool.'>
            <span className='text-end text-neutral-content'>{`${priceImpact ? priceImpact.toFixed(2) : '0'}%`}</span>
          </div>
        </div>

        <div className='flex w-full items-center justify-between'>
          <h3 className='gray-text'>Receive at least</h3>
          <div
            className='custom-tooltip md:tooltip md:tooltip-left lg:tooltip-right'
            data-tip={`If the price moves so that you will receive less than ${minimumReceived}, your transaction will revert.`}>
            <span className='text-end text-neutral-content'>{minimumReceived}</span>
          </div>
        </div>

        <div className='flex w-full items-center justify-between'>
          <h3 className='gray-text'>Slippage</h3>
          <div
            className='custom-tooltip md:tooltip md:tooltip-left lg:tooltip-right'
            data-tip='The maximum price movement before your transaction will revert.'>
            <span className='text-end text-neutral-content'>{slippageValue}</span>
          </div>
        </div>
      </div>

      {/* expand end */}
    </div>
  )
}

export default SwapDetails

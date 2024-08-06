import React from 'react'
import BuyAmount from './BuyAmount'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'

const BuyComponent: React.FC = () => {
  const {
    toToken: buyToken,
    setToToken: setBuyToken,
    toAmount: buyAmount,
    setToAmount: setBuyAmount,
    quoteLoading,
    setQuoteLoading,
    swapDirection,
    setSwapDirection,
  } = useSwapStateContext()

  return (
    <div className='input-card mb-4'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>To</span>
        <h1 className='text-base-content'>
          <span>Balance: </span>
          <TokenBalance token={buyToken || undefined} toFixed={4} />
        </h1>
      </div>
      <BuyAmount
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
        quoteLoading={quoteLoading}
        setSwapDirection={setSwapDirection}
      />
    </div>
  )
}

export default BuyComponent

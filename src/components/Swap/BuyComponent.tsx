import React from 'react'
import BuyAmount from './BuyAmount'
import { useSwapStateContext } from '@/context/SwapStateContext'

const BuyComponent: React.FC = () => {
  const { toToken, setToToken, toAmount, setToAmount, isQuoteing, setSwapDirection } = useSwapStateContext()

  return (
    <div className='input-card mb-4'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>To</span>
      </div>
      <BuyAmount
        buyToken={toToken}
        setBuyToken={setToToken}
        buyAmount={toAmount}
        setBuyAmount={setToAmount}
        quoteLoading={isQuoteing}
        setSwapDirection={setSwapDirection}
      />
    </div>
  )
}

export default BuyComponent

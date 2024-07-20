import React from 'react'
import BuyAmount from './BuyAmount'

const BuyComponent = ({ buyToken, setBuyToken, buyAmount, setBuyAmount, address, quoteLoading }) => {
  return (
    <div className='card mb-4'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-gray-400'>To</span>
      </div>
      <BuyAmount
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
        address={address}
        quoteLoading={quoteLoading}
      />
    </div>
  )
}

export default BuyComponent

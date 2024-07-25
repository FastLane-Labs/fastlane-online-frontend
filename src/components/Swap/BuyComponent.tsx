import React from 'react'
import BuyAmount from './BuyAmount'

interface BuyComponentProps {
  buyToken: any
  setBuyToken: (token: any) => void
  buyAmount: any
  setBuyAmount: (amount: any) => void
  address: `0x${string}`
  quoteLoading: boolean
}

const BuyComponent: React.FC<BuyComponentProps> = ({
  buyToken,
  setBuyToken,
  buyAmount,
  setBuyAmount,
  address,
  quoteLoading,
}) => {
  return (
    <div className='bg-neutral p-4 rounded-2xl mb-4 border-accent-content hover:border-neutral-700 border'>
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

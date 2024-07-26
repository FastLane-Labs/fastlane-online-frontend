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
    <div className='input-card mb-4'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>To</span>
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

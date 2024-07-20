import React from 'react'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import SellAmount from './SellAmount'

const SellComponent = ({
  sellToken,
  setSellToken,
  sellAmount,
  setSellAmount,
  address,
  balance,
  setBalance,
  decimals,
  sellTokenAddress,
}) => {
  const formatBalance = (balance, decimals = 18) => {
    return Number(balance) / Math.pow(10, decimals)
  }

  return (
    <div className='card mb-0'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-gray-400'>Sell</span>
        <h1 className='text-gray-400'>
          <span>Balance: </span>
          <TokenBalance
            address={address}
            tokenAddress={sellTokenAddress}
            toFixed={4}
            onBalanceChange={({ balance }) => setBalance(formatBalance(balance, decimals))}
          />
        </h1>
      </div>
      <SellAmount
        sellToken={sellToken}
        setSellToken={setSellToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        address={address}
        balance={balance}
      />
    </div>
  )
}

export default SellComponent

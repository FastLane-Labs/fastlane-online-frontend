import React from 'react'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import SellAmount from './SellAmount'

interface SellComponentProps {
  sellToken: string
  setSellToken: (token: string) => void
  sellAmount: string
  setSellAmount: (amount: string) => void
  address: `0x${string}`
  balance: string
  setBalance: (balance: string) => void
  decimals: number
  sellTokenAddress: `0x${string}`
}

const SellComponent: React.FC<SellComponentProps> = ({
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
  const formatBalance = (balance: string, decimals: number = 18): number => {
    return Number(balance) / Math.pow(10, decimals)
  }

  return (
    <div className='input-card mb-0'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>Sell</span>
        <h1 className='text-base-content'>
          <span>Balance: </span>
          <TokenBalance
            address={address}
            tokenAddress={sellTokenAddress}
            toFixed={4}
            onBalanceChange={({ balance }) => setBalance(formatBalance(balance.toString(), decimals).toString())}
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

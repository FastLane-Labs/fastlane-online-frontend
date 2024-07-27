import React from 'react'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import SellAmount from './SellAmount'
import { useSwapContext } from '@/context/SwapContext'

const SellComponent: React.FC = () => {
  const {
    fromToken: sellToken,
    setFromToken: setSellToken,
    fromAmount: sellAmount,
    setFromAmount: setSellAmount,
  } = useSwapContext()

  const balance = '1'
  const decimals = 18

  const formatBalance = (balance: string, decimals: number = 18): number => {
    return Number(balance) / Math.pow(10, decimals)
  }

  return (
    <div className='input-card mb-0'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>Sell</span>
        <h1 className='text-base-content'>
          <span>Balance: </span>
          <TokenBalance token={sellToken || undefined} toFixed={4} />
        </h1>
      </div>
      <SellAmount
        sellToken={sellToken}
        setSellToken={setSellToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        balance={balance}
      />
    </div>
  )
}

export default SellComponent

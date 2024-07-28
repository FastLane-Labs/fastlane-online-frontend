import React, { ChangeEvent, useEffect, useState } from 'react'
import TokenSelectModal from '../Modals/TokenSelectModal'
import { Token } from '@/types'

interface SellAmountProps {
  sellToken: Token | null
  setSellToken: (token: Token) => void
  sellAmount: string
  setSellAmount: (amount: string) => void
  address?: `0x${string}`
  balance: string
}

const SellAmount: React.FC<SellAmountProps> = ({ sellToken, setSellToken, sellAmount, setSellAmount, balance }) => {
  const [currentBalance, setCurrentBalance] = useState<string>(balance)

  useEffect(() => {
    setCurrentBalance(balance)
  }, [balance, sellToken])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Ensure the input is valid (numbers and one decimal point)
    if (/^\d*\.?\d*$/.test(value)) {
      setSellAmount(value)
    }
  }

  const handleSetMax = () => {
    setSellAmount(currentBalance)
  }

  return (
    <div className='flex items-center space-x-2'>
      <input
        type='text'
        value={sellAmount}
        onChange={handleChange}
        className='bg-neutral text-white p-2 rounded-2xl flex-grow text-4xl w-full focus:outline-none'
        placeholder='0'
      />
      {sellToken && parseFloat(currentBalance) > 0 && (
        <button className='btn-outline text-primary' onClick={handleSetMax}>
          MAX
        </button>
      )}
      <TokenSelectModal
        selectedToken={sellToken}
        onSelectToken={setSellToken}
        defaultLabel='Select a token'
        direction='sell'
      />
    </div>
  )
}

export default SellAmount

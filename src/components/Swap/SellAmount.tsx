import React, { ChangeEvent } from 'react'
import TokenSelect from './TokenSelect'

interface SellAmountProps {
  sellToken: string
  setSellToken: (token: string) => void
  sellAmount: string
  setSellAmount: (amount: string) => void
  address: `0x${string}`
  balance: string
}

const SellAmount: React.FC<SellAmountProps> = ({
  sellToken,
  setSellToken,
  sellAmount,
  setSellAmount,
  address,
  balance,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Ensure the input is valid (numbers and one decimal point)
    if (/^\d*\.?\d*$/.test(value)) {
      setSellAmount(value)
    }
  }

  const handleSetMax = () => {
    setSellAmount(balance)
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
      <button className='btn-outline text-primary' onClick={handleSetMax}>
        MAX
      </button>
      <TokenSelect value={sellToken} onChange={setSellToken} address={address} defaultLabel={'Select a token'} />
    </div>
  )
}

export default SellAmount

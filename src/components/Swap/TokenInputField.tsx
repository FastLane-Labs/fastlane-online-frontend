'use client'

import React, { ChangeEvent, useRef, useEffect } from 'react'
import TokenSelectModal from '../Modals/TokenSelectModal'
import { SwapDirection, Token } from '@/types'

interface TokenInputFieldProps {
  token: Token | null
  setToken: (token: Token | null) => void
  amount: string
  setAmount: (amount: string) => void
  quoteLoading: boolean
  setSwapDirection: (direction: SwapDirection) => void
  disabled?: boolean
  direction: SwapDirection
}

const TokenInputField: React.FC<TokenInputFieldProps> = ({
  token,
  setToken,
  amount,
  setAmount,
  quoteLoading,
  setSwapDirection,
  disabled = false,
  direction,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setSwapDirection(direction)
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = amount
    }
  }, [amount])

  return (
    <div className='flex items-center space-x-2'>
      <div className='flex items-center space-x-2 relative'>
        <input
          ref={inputRef}
          type='text'
          value={amount}
          onChange={handleChange}
          className={`bg-theme text-neutral-content p-2 rounded-xl flex-grow text-4xl w-full focus:outline-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          placeholder='0'
          readOnly={disabled}
        />
        {quoteLoading && <span className='absolute right-4 loading loading-spinner loading-sm'></span>}
      </div>
      <TokenSelectModal
        selectedToken={token}
        onSelectToken={setToken}
        defaultLabel='Select a token'
        direction={direction}
      />
    </div>
  )
}

export default TokenInputField

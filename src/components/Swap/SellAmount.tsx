import React, { ChangeEvent, useEffect, useState, useRef, useCallback } from 'react'
import TokenSelectModal from '../Modals/TokenSelectModal'
import { SwapDirection, Token } from '@/types'

interface SellAmountProps {
  sellToken: Token | null
  setSellToken: (token: Token) => void
  sellAmount: string
  setSellAmount: (amount: string) => void
  setSwapDirection: (direction: SwapDirection) => void
  address?: `0x${string}`
  balance: string
}

const SellAmount: React.FC<SellAmountProps> = ({
  sellToken,
  setSellToken,
  sellAmount,
  setSellAmount,
  balance,
  setSwapDirection,
}) => {
  const [currentBalance, setCurrentBalance] = useState<string>(balance)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastUserInputRef = useRef<string>('')

  useEffect(() => {
    setCurrentBalance(balance)
  }, [balance, sellToken])

  useEffect(() => {
    if (inputRef.current && sellAmount !== lastUserInputRef.current) {
      inputRef.current.value = sellAmount
    }
  }, [sellAmount])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Ensure the input is valid (numbers and one decimal point)
      if (/^\d*\.?\d*$/.test(value)) {
        setSellAmount(value)
        lastUserInputRef.current = value
        console.log('User input detected, setting swap direction to sell')
        setSwapDirection('sell')
      }
    },
    [setSellAmount, setSwapDirection]
  )

  const handleSetMax = useCallback(() => {
    setSellAmount(currentBalance)
    lastUserInputRef.current = currentBalance
    console.log('Max button clicked, setting swap direction to sell')
    setSwapDirection('sell')
  }, [currentBalance, setSellAmount, setSwapDirection])

  const handleTokenSelect = useCallback(
    (token: Token) => {
      console.log('Token selected:', token)
      setSellToken(token)
    },
    [setSellToken]
  )

  return (
    <div className='flex items-center space-x-2'>
      <input
        ref={inputRef}
        type='text'
        defaultValue={sellAmount}
        onChange={handleChange}
        className='bg-theme text-neutral-content p-2 rounded-2xl flex-grow text-4xl w-full focus:outline-none'
        placeholder='0'
      />
      {sellToken && parseFloat(currentBalance) > 0 && (
        <button className='max-button btn-outline text-primary outline-none' onClick={handleSetMax}>
          MAX
        </button>
      )}
      <TokenSelectModal
        selectedToken={sellToken}
        onSelectToken={handleTokenSelect}
        defaultLabel='Select a token'
        direction='sell'
      />
    </div>
  )
}

export default SellAmount

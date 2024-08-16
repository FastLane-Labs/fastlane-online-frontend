import React, { ChangeEvent, useRef, useEffect } from 'react'
import TokenSelectModal from '../Modals/TokenSelectModal'
import { SwapDirection, Token } from '@/types'

interface SellAmountProps {
  sellToken: Token | null
  setSellToken: (token: Token | null) => void
  sellAmount: string
  setSellAmount: (amount: string) => void
  quoteLoading: boolean
  setSwapDirection: (direction: SwapDirection) => void
}

const SellAmount: React.FC<SellAmountProps> = ({
  sellToken,
  setSellToken,
  sellAmount,
  setSellAmount,
  quoteLoading,
  setSwapDirection,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setSellAmount(value)
      setSwapDirection('sell')
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = sellAmount
    }
  }, [sellAmount])

  return (
    <div className='flex items-center space-x-2'>
      <div className='flex items-center space-x-2 relative'>
        <input
          ref={inputRef}
          type='text'
          value={sellAmount}
          onChange={handleChange}
          className='bg-theme text-neutral-content p-2 rounded-xl flex-grow text-4xl w-full focus:outline-none'
          placeholder='0'
        />
        {quoteLoading && <span className='absolute right-4 loading loading-spinner loading-sm'></span>}
      </div>
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

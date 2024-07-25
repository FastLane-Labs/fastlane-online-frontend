import React from 'react'

// Define the props interface
interface FlipButtonProps {
  sellToken: string
  setSellToken: (token: string) => void
  buyToken: string
  setBuyToken: (token: string) => void
  sellAmount: string
  setSellAmount: (amount: string) => void
  buyAmount: string
  setBuyAmount: (amount: string) => void
}

const FlipButton: React.FC<FlipButtonProps> = ({
  sellToken,
  setSellToken,
  buyToken,
  setBuyToken,
  sellAmount,
  setSellAmount,
  buyAmount,
  setBuyAmount,
}) => {
  const handleSwapArrow = () => {
    setSellToken(buyToken)
    setBuyToken(sellToken)
    setSellAmount(buyAmount)
    setBuyAmount(sellAmount)
  }

  return (
    <div className='relative flex justify-center mb-2'>
      <button
        onClick={handleSwapArrow}
        className='absolute bg-gradient-to-br from-primary to-secondary from-35% text-neutral-content hover:text-gray-300
        border-none p-[0.3rem] rounded-lg -top-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </button>
    </div>
  )
}

export default FlipButton

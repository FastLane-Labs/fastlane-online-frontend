import React from 'react'

const FlipButton = ({
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
    <div className='relative flex justify-center mb-1 z-10'>
      <button
        onClick={handleSwapArrow}
        className='absolute bg-neutral text-white hover:text-gray-300 border-base-100 border-4 p-[0.4rem] rounded-xl -top-4'>
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

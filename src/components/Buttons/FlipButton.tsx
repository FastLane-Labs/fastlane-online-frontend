import React from 'react'
import { useSwapStateContext } from '@/context/SwapStateContext'

const FlipButton: React.FC = () => {
  const {
    fromToken: sellToken,
    setFromToken: setSellToken,
    setFromAmount: setSellAmount,
    toToken: buyToken,
    setToToken: setBuyToken,
    toAmount: buyAmount,
    setToAmount: setBuyAmount,
    isQuoteing,
    resetSwapData,
  } = useSwapStateContext()

  const handleSwapArrow = async () => {
    setSellToken(buyToken)
    setSellAmount(buyAmount)
    setBuyToken(sellToken)
    setBuyAmount('')
    resetSwapData()
  }

  return (
    <div className='relative flex justify-center mb-1'>
      <button
        onClick={handleSwapArrow}
        className='absolute bg-gradient-to-br from-primary to-secondary from-35% text-white hover:from-secondary hover:to-primary hover:from-[0%]
       border-none p-[0.3rem] rounded-lg -top-3'
        disabled={!sellToken || !buyToken || isQuoteing}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='.2 0 24 24'
          stroke='currentColor'
          strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </button>
    </div>
  )
}

export default FlipButton

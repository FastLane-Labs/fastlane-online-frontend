import React from 'react'
import { SwapDirection, Token } from '@/types'
import TokenInputComponent from './TokenInputComponent'

interface BuyAmountProps {
  buyToken: Token | null
  setBuyToken: (token: Token | null) => void
  buyAmount: string
  setBuyAmount: (amount: string) => void
  quoteLoading: boolean
  setSwapDirection: (direction: SwapDirection) => void
  disabled: boolean
}

const BuyAmount: React.FC<BuyAmountProps> = ({
  buyToken,
  setBuyToken,
  buyAmount,
  setBuyAmount,
  quoteLoading,
  setSwapDirection,
  disabled = true,
}) => {
  return (
    <TokenInputComponent
      token={buyToken}
      setToken={setBuyToken}
      amount={buyAmount}
      setAmount={setBuyAmount}
      quoteLoading={quoteLoading}
      setSwapDirection={setSwapDirection}
      disabled={disabled}
      direction='buy'
    />
  )
}

export default BuyAmount

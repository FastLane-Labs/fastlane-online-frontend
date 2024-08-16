import React from 'react'
import { SwapDirection, Token } from '@/types'
import TokenInputField from './TokenInputField'

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
  return (
    <TokenInputField
      token={sellToken}
      setToken={setSellToken}
      amount={sellAmount}
      setAmount={setSellAmount}
      quoteLoading={quoteLoading}
      setSwapDirection={setSwapDirection}
      direction='sell'
    />
  )
}

export default SellAmount

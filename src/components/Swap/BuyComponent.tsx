import React, { useMemo } from 'react'
import BuyAmount from './BuyAmount'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import { useTokenUsdPrice } from '@/hooks/useTokenUsdPrice'

const BuyComponent: React.FC = () => {
  const {
    toToken: buyToken,
    setToToken: setBuyToken,
    toAmount: buyAmount,
    setToAmount: setBuyAmount,
    isQuoteing,
    setSwapDirection,
    quote,
  } = useSwapStateContext()

  const { data: tokenPrice } = useTokenUsdPrice(buyToken)

  const usdValue = useMemo(() => {
    if (!tokenPrice || tokenPrice === 0 || !buyAmount || buyAmount === '') return null
    const amount = parseFloat(buyAmount)
    return isNaN(amount) ? null : amount * tokenPrice
  }, [tokenPrice, buyAmount])

  const priceImpact = useMemo(() => {
    if (!quote) return null
    const amount = parseFloat(quote.priceImpact)
    return amount
  }, [quote])

  return (
    <div className='input-card mb-4'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>To</span>
        <div className='flex text-base-content gap-0.5 items-center justify-center'>
          <span>Balance: </span>
          <TokenBalance token={buyToken || undefined} toFixed={3} />
        </div>
      </div>
      <BuyAmount
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
        quoteLoading={isQuoteing}
        setSwapDirection={setSwapDirection}
        disabled={true}
      />
      <div className='text-left mt-2 text-sm text-base-content h-5'>
        {usdValue !== null ? `$${usdValue.toFixed(2)} ` : '\u00A0'}
        {priceImpact !== null ? `(${priceImpact.toFixed(4)}%)` : '\u00A0'}
      </div>
    </div>
  )
}

export default BuyComponent

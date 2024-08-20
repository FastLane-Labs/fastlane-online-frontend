import React, { useEffect, useMemo } from 'react'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import SellAmount from './SellAmount'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { useAccount } from 'wagmi'
import { useBalance } from '@/hooks/useBalance'
import { Token } from '@/types'
import { ethers } from 'ethers'
import { useCurrentTokenList } from '@/hooks/useTokenList'
import { useTokenUsdPrice } from '@/hooks/useTokenUsdPrice'

const SellComponent: React.FC = () => {
  const {
    fromToken: sellToken,
    setFromToken: setSellToken,
    toToken: buyToken,
    fromAmount: sellAmount,
    setFromAmount: setSellAmount,
    setSwapDirection,
    isQuoteing,
  } = useSwapStateContext()

  const { address, chainId } = useAccount()
  const { tokens } = useCurrentTokenList()

  const {
    data: fetchedBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useBalance({
    token: sellToken as Token,
    userAddress: address as string,
    enabled: !!sellToken && !!address,
  })

  const { data: tokenPrice } = useTokenUsdPrice(sellToken)

  const usdValue = useMemo(() => {
    if (!tokenPrice || tokenPrice === 0 || !sellAmount || sellAmount === '') return null
    const amount = parseFloat(sellAmount)
    return isNaN(amount) ? null : amount * tokenPrice
  }, [tokenPrice, sellAmount])

  useEffect(() => {
    if (chainId && !sellToken && tokens.length > 0) {
      const defaultToken = tokens.find((token) => token.tags?.includes('default'))
      if (defaultToken && defaultToken.chainId === chainId && defaultToken.address !== buyToken?.address) {
        setSellToken(defaultToken)
      }
    }
  }, [chainId, sellToken, tokens, setSellToken, buyToken])

  const balance = useMemo(() => {
    if (sellToken && !balanceLoading && !balanceError && fetchedBalance !== undefined) {
      return ethers.formatUnits(fetchedBalance, sellToken.decimals)
    }
    return '0'
  }, [fetchedBalance, sellToken, balanceLoading, balanceError])

  const handleSetMax = () => {
    if (balance) {
      setSellAmount(balance)
      setSwapDirection('sell')
    }
  }

  return (
    <div className='input-card mb-0'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>Sell</span>
        <div className='flex text-base-content gap-0.5 items-center justify-center'>
          <span>Balance: </span>
          <TokenBalance token={sellToken || undefined} toFixed={3} />
          <button className='max-button text-[15px]' onClick={handleSetMax}>
            MAX
          </button>
        </div>
      </div>
      <SellAmount
        sellToken={sellToken}
        setSellToken={setSellToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        quoteLoading={isQuoteing}
        setSwapDirection={setSwapDirection}
      />
      <div className='text-left mt-2 text-sm text-base-content h-5'>
        {usdValue !== null ? `$${usdValue.toFixed(2)}` : '\u00A0'}
      </div>
    </div>
  )
}

export default SellComponent

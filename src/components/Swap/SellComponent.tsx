import React, { useEffect, useState } from 'react'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import SellAmount from './SellAmount'
import { useSwapContext } from '@/context/SwapContext'
import { useAccount } from 'wagmi'
import { useBalance } from '@/hooks/useBalance'
import { Token } from '@/types'
import { ethers } from 'ethers'
import { useCurrentTokenList } from '@/hooks/useTokenList'

const SellComponent: React.FC = () => {
  const {
    fromToken: sellToken,
    setFromToken: setSellToken,
    fromAmount: sellAmount,
    setFromAmount: setSellAmount,
  } = useSwapContext()

  const { address } = useAccount()
  const [balance, setBalance] = useState<string>('0')

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

  useEffect(() => {
    if (!sellToken && tokens.length > 0) {
      const defaultToken = tokens.find((token) => token.tags?.includes('default'))
      if (defaultToken) {
        setSellToken(defaultToken)
      }
    }
  }, [sellToken, tokens, setSellToken])

  useEffect(() => {
    if (sellToken && !balanceLoading && !balanceError) {
      setBalance(ethers.formatUnits(fetchedBalance ?? 0n, sellToken.decimals))
    }
  }, [fetchedBalance, sellToken, balanceLoading, balanceError])

  return (
    <div className='input-card mb-0'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>Sell</span>
        <h1 className='text-base-content'>
          <span>Balance: </span>
          <TokenBalance token={sellToken || undefined} toFixed={4} />
        </h1>
      </div>
      <SellAmount
        sellToken={sellToken}
        setSellToken={setSellToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        balance={balance}
      />
    </div>
  )
}

export default SellComponent

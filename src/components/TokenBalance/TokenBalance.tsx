'use client'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { formatBalance } from '@/utils/formatBalance'
import { Token } from '@/types'
import { useBalance } from '@/hooks/useBalance'

interface TokenBalanceProps {
  readonly token?: Token
  readonly className?: string
  readonly toFixed?: number
  readonly onBalanceChange?: ({ balance, formattedBalance }: { balance: bigint; formattedBalance?: string }) => void
}

export const TokenBalance: React.FC<TokenBalanceProps> = ({ token, toFixed, onBalanceChange, className }) => {
  const { address } = useAccount()
  const balanceQuery = useBalance({
    token,
    userAddress: address as string,
  })
  useEffect(() => {
    if (balanceQuery.data && onBalanceChange) {
      onBalanceChange({
        balance: BigInt(balanceQuery.data),
        formattedBalance: balanceQuery.data,
      })
    }
  }, [balanceQuery.data, onBalanceChange, toFixed, token?.decimals])

  if (!balanceQuery.data) {
    return <span className={`${className}`}>0</span>
  }

  return <span className={`${className}`}>{balanceQuery.data}</span>
}

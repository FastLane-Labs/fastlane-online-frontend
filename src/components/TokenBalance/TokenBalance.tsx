'use client'
import { useAccount } from 'wagmi'
import { useEffect, useCallback } from 'react'
import { Token } from '@/types'
import { useBalance } from '@/hooks/useBalance'
import { formatBalance } from '@/utils/format'

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
    enabled: !!token && !!address,
  })

  const getFormattedBalance = useCallback(
    (balance: bigint) => {
      return token ? formatBalance(balance, token.decimals) : '0'
    },
    [token]
  )

  useEffect(() => {
    if (balanceQuery.data && onBalanceChange && token) {
      onBalanceChange({
        balance: balanceQuery.data,
        formattedBalance: getFormattedBalance(balanceQuery.data),
      })
    }
  }, [balanceQuery.data, onBalanceChange, token, getFormattedBalance])

  if (balanceQuery.isLoading) {
    return <span className={`${className}`}></span>
  }

  if (balanceQuery.error) {
    return <span className={`${className}`}>0</span>
  }

  if (!balanceQuery.data || !token) {
    return <span className={`${className}`}>0</span>
  }

  return <span className={`${className}`}>{getFormattedBalance(balanceQuery.data || 0n)}</span>
}

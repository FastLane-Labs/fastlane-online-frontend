'use client'
import { useAccount } from 'wagmi'
import { useEffect, useCallback } from 'react'
import { Token } from '@/types'
import { useBalance } from '@/hooks/useBalance'
import { shortFormat } from '@/utils/format'

interface TokenBalanceProps {
  readonly token?: Token
  readonly className?: string
  readonly toFixed?: number
  readonly onBalanceChange?: ({ balance, formattedBalance }: { balance: bigint; formattedBalance?: string }) => void
}

// set default value for toFixed to 2
export const TokenBalance: React.FC<TokenBalanceProps> = ({ token, toFixed = 2, onBalanceChange, className }) => {
  const { address } = useAccount()

  // Use the useBalance hook to fetch the balance in BigInt
  const balanceQuery = useBalance({
    token,
    userAddress: address as string,
    enabled: !!token && !!address,
  })

  // Function to format the balance
  const getFormattedBalance = useCallback(
    (balance: bigint) => {
      return token ? shortFormat(balance, token.decimals, toFixed) : '0'
    },
    [token, toFixed]
  )

  // call onBalanceChange with the balance and formatted balance when the balance changes
  useEffect(() => {
    if (balanceQuery.data && onBalanceChange && token) {
      onBalanceChange({
        balance: balanceQuery.data,
        formattedBalance: getFormattedBalance(balanceQuery.data),
      })
    }
  }, [balanceQuery.data, onBalanceChange, token, getFormattedBalance])

  // Render the loading state
  if (balanceQuery.isLoading) {
    return <span className={`${className} loading loading-spinner`}></span>
  }

  // Render the error state
  if (balanceQuery.error) {
    return <span className={`${className}`}>0</span>
  }

  // Render the balance or default to 0 if no data
  if (!balanceQuery.data || !token) {
    return <span className={`${className}`}>0</span>
  }

  // Render the formatted balance
  return <span className={`${className}`}>{getFormattedBalance(balanceQuery.data || 0n)}</span>
}

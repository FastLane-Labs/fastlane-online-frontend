'use client'
import { useBalance, useReadContract } from 'wagmi'
import { toBigInt } from 'ethers'
import { useEffect } from 'react'
import { formatBalance } from '@/utils/formatBalance'
import { erc20Abi } from 'viem'

interface TokenBalanceProps {
  readonly address?: string
  readonly tokenAddress?: string
  readonly className?: string
  readonly toFixed?: number
  readonly onBalanceChange?: ({ balance, formattedBalance }: { balance: bigint; formattedBalance?: string }) => void
}

export const TokenBalance: React.FC<TokenBalanceProps> = ({
  address,
  tokenAddress,
  toFixed,
  onBalanceChange,
  className,
}) => {
  const ETHBalance = useBalance({ address: address as `0x${string}` })

  const tokenBalance = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  useEffect(() => {
    // Pass the value of the balance to the parent component on change
    if (tokenBalance.data && onBalanceChange) {
      onBalanceChange({ balance: tokenBalance.data, formattedBalance: formatBalance(tokenBalance.data, toFixed) })
      return
    } else if (ETHBalance.data && onBalanceChange) {
      onBalanceChange({
        balance: ETHBalance.data.value,
        formattedBalance: formatBalance(ETHBalance.data.value, toFixed),
      })
      return
    }
  }, [ETHBalance.data, tokenBalance.data, onBalanceChange, toFixed])

  if (!ETHBalance.data && !tokenBalance.data) return null
  if (tokenAddress && tokenBalance.data) {
    return <span className={`${className}`}>{formatBalance(tokenBalance.data, toFixed)}</span>
  }
  return <span className={` ${className}`}>{formatBalance(ETHBalance.data?.value ?? toBigInt(0), toFixed)}</span>
}

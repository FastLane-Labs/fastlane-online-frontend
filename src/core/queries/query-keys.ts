import { Token } from '@/types'

export const keys = ({ address }: { address?: string }) => ({
  all: [address, 'all'],
  balances: () => [...keys({ address }).all, 'balances'],
  balance: (chainId?: number | string, tokenAddress?: string, userAddress?: string) => [
    ...keys({ address }).balances(),
    chainId,
    tokenAddress,
    userAddress,
    'balance',
  ],
  swapPath: (fromToken: Token, toToken: Token) => [
    ...keys({ address }).all,
    'swapPath',
    fromToken.address,
    toToken.address,
  ],
  swapQuote: (fromToken: Token, toToken: Token, direction: 'buy' | 'sell', amount: string) => [
    ...keys({ address }).all,
    'swapQuote',
    fromToken.address,
    toToken.address,
    direction,
    amount,
  ],
  estimatedSwapFees: (chainId?: number) => [...keys({ address }).all, 'estimatedSwapFees', chainId],
  allowance: (tokenAddress: string, userAddress: string, spenderAddress: string) => [
    ...keys({ address }).all,
    'allowance',
    tokenAddress,
    userAddress,
    spenderAddress,
  ],
})

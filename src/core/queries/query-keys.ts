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
})

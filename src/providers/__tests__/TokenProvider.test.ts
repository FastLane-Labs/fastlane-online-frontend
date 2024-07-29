jest.mock(
  '@/config/tokenListPolygon.json',
  () => [
    {
      chainId: 137,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6,
      name: 'USD Coin (PoS)',
      symbol: 'USDC',
      logoURI: 'https://example.com/usdc.png',
    },
  ],
  { virtual: true }
)

import { StaticTokenListProvider, TokenProvider } from '@/providers'

describe('TokenProvider', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    ;(StaticTokenListProvider as any).instance = null
  })

  it('should load tokens for a valid chain ID', async () => {
    const tokens = await TokenProvider.getTokensByChainId(137)

    expect(tokens).toEqual([
      {
        chainId: 137,
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        decimals: 6,
        name: 'USD Coin (PoS)',
        symbol: 'USDC',
        logoURI: 'https://example.com/usdc.png',
      },
    ])
  })

  it('should throw an error for an invalid chain ID', async () => {
    await expect(TokenProvider.getTokensByChainId(999)).rejects.toThrow('No token list found for chain ID 999')
  })
})

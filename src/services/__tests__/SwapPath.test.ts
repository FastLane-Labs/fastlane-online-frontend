import { SwapPathService } from '@/services/swapPath'
import { ChainId, Exchange } from '@/constants'
import { Token } from '@/types'
import { tokenCmp } from '@/utils/token'

const chainId = ChainId.POLYGON

const POLYGON_MATIC: Token = {
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  chainId: chainId,
  decimals: 18,
  symbol: 'MATIC',
  name: 'Matic',
  logoURI: '',
}
const POLYGON_WMATIC: Token = {
  address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  chainId: chainId,
  decimals: 18,
  symbol: 'WMATIC',
  name: 'Wrapped Matic',
  logoURI: '',
}
const POLYGON_USDC: Token = {
  address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  chainId: chainId,
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
  logoURI: '',
}
const POLYGON_USDT: Token = {
  address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  chainId: chainId,
  decimals: 6,
  symbol: 'USDT',
  name: 'Tether USD',
  logoURI: '',
}
const POLYGON_DAI: Token = {
  address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  chainId: chainId,
  decimals: 18,
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  logoURI: '',
}
const INVALID_TOKEN: Token = {
  address: '0xinvalid',
  chainId: chainId,
  decimals: 18,
  symbol: 'INVALID',
  name: 'Invalid',
  logoURI: '',
}

describe('path', () => {
  const swapPathService = new SwapPathService()

  test('get swap routes - token from not found', async () => {
    await expect(
      swapPathService.getSwapRoutes(INVALID_TOKEN, POLYGON_WMATIC, chainId, Exchange.UNISWAPV3)
    ).rejects.toThrow('getSwapRoutes: token not found: ' + INVALID_TOKEN.address)
  })

  test('get swap routes - token to not found', async () => {
    await expect(
      swapPathService.getSwapRoutes(POLYGON_WMATIC, INVALID_TOKEN, chainId, Exchange.UNISWAPV3)
    ).rejects.toThrow('getSwapRoutes: token not found: ' + INVALID_TOKEN.address)
  })

  test('get swap routes - from and to are the same', async () => {
    await expect(
      swapPathService.getSwapRoutes(POLYGON_WMATIC, POLYGON_WMATIC, chainId, Exchange.UNISWAPV3)
    ).rejects.toThrow('getSwapRoutes: from and to tokens are the same')
  })

  test('get swap routes - token from not found', async () => {
    await expect(
      swapPathService.getSwapRoutes(INVALID_TOKEN, POLYGON_WMATIC, chainId, Exchange.UNISWAPV3)
    ).rejects.toThrow('getSwapRoutes: token not found: ' + INVALID_TOKEN.address)
  })

  test('get swap routes - token to not found', async () => {
    await expect(
      swapPathService.getSwapRoutes(POLYGON_WMATIC, INVALID_TOKEN, chainId, Exchange.UNISWAPV3)
    ).rejects.toThrow('getSwapRoutes: token not found: ' + INVALID_TOKEN.address)
  })

  test('get swap routes - from and to are the same', async () => {
    await expect(
      swapPathService.getSwapRoutes(POLYGON_WMATIC, POLYGON_WMATIC, chainId, Exchange.UNISWAPV3)
    ).rejects.toThrow('getSwapRoutes: from and to tokens are the same')
  })

  test('get swap routes - wrapped native as from', async () => {
    const swapRoutes = await swapPathService.getSwapRoutes(POLYGON_WMATIC, POLYGON_USDC, chainId, Exchange.UNISWAPV3)

    // Should return 3 routes, 1 for each uniswap pool fee tier
    expect(swapRoutes).toHaveLength(3)

    swapRoutes.forEach((route) => {
      expect(route.isFromNative).toBe(false)
      expect(route.isToNative).toBe(false)
    })

    // Direct swap, pool fee 0.05%
    expect(swapRoutes[0].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[0].swapSteps[0].extra?.fee).toBe(500)

    // Direct swap, pool fee 0.3%
    expect(swapRoutes[1].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[1].swapSteps[0].extra?.fee).toBe(3000)

    // Direct swap, pool fee 1%
    expect(swapRoutes[2].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[2].swapSteps[0].extra?.fee).toBe(10000)
  })

  test('get swap routes - wrapped native as to', async () => {
    const swapRoutes = await swapPathService.getSwapRoutes(POLYGON_USDC, POLYGON_WMATIC, chainId, Exchange.UNISWAPV3)

    // Should return 3 routes, 1 for each uniswap pool fee tier
    expect(swapRoutes).toHaveLength(3)

    swapRoutes.forEach((route) => {
      expect(route.isFromNative).toBe(false)
      expect(route.isToNative).toBe(false)
    })

    // Direct swap, pool fee 0.05%
    expect(swapRoutes[0].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[0].swapSteps[0].extra?.fee).toBe(500)

    // Direct swap, pool fee 0.3%
    expect(swapRoutes[1].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[1].swapSteps[0].extra?.fee).toBe(3000)

    // Direct swap, pool fee 1%
    expect(swapRoutes[2].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[2].swapSteps[0].extra?.fee).toBe(10000)
  })

  test('get swap routes - non wrapped native swap - gateway token as from', async () => {
    const swapRoutes = await swapPathService.getSwapRoutes(POLYGON_USDC, POLYGON_USDT, chainId, Exchange.UNISWAPV3)

    // Should return 12 routes
    // + 3 pool fee tiers for direct swap
    // + 3 pool fee tiers ** 2 for swap with wrapped native token as intermediate
    expect(swapRoutes).toHaveLength(12)

    swapRoutes.forEach((route) => {
      expect(route.isFromNative).toBe(false)
      expect(route.isToNative).toBe(false)
    })

    // Direct swap, pool fee 0.05%
    expect(swapRoutes[0].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[0].swapSteps[0].extra?.fee).toBe(500)

    // Direct swap, pool fee 0.3%
    expect(swapRoutes[1].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[1].swapSteps[0].extra?.fee).toBe(3000)

    // Direct swap, pool fee 1%
    expect(swapRoutes[2].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[2].swapSteps[0].extra?.fee).toBe(10000)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 0.05% 0.05%
    expect(swapRoutes[3].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[3].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[3].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[3].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[3].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[3].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[3].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 0.05% 0.3%
    expect(swapRoutes[4].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[4].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[4].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[4].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[4].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[4].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[4].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 0.05% 1%
    expect(swapRoutes[5].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[5].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[5].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[5].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[5].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[5].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[5].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 0.3% 0.05%
    expect(swapRoutes[6].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[6].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[6].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[6].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[6].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[6].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[6].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 0.3% 0.3%
    expect(swapRoutes[7].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[7].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[7].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[7].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[7].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[7].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[7].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 0.3% 1%
    expect(swapRoutes[8].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[8].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[8].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[8].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[8].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[8].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[8].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 1% 0.05%
    expect(swapRoutes[9].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[9].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[9].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[9].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[9].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[9].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[9].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 1% 0.3%
    expect(swapRoutes[10].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[10].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[10].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[10].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[10].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[10].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[10].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDC > WMATIC > USDT), pool fee 1% 1%
    expect(swapRoutes[11].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[11].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[11].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[11].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[11].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[11].swapSteps[1].tokenOut, POLYGON_USDT)).toBe(true)
    expect(swapRoutes[11].swapSteps[1].extra?.fee).toBe(10000)
  })

  test('get swap routes - non wrapped native swap - gateway token as to', async () => {
    const swapRoutes = await swapPathService.getSwapRoutes(POLYGON_USDT, POLYGON_USDC, chainId, Exchange.UNISWAPV3)

    // Should return 12 routes
    // + 3 pool fee tiers for direct swap
    // + 3 pool fee tiers ** 2 for swap with wrapped native token as intermediate
    expect(swapRoutes).toHaveLength(12)

    swapRoutes.forEach((route) => {
      expect(route.isFromNative).toBe(false)
      expect(route.isToNative).toBe(false)
    })

    // Direct swap, pool fee 0.05%
    expect(swapRoutes[0].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[0].swapSteps[0].extra?.fee).toBe(500)

    // Direct swap, pool fee 0.3%
    expect(swapRoutes[1].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[1].swapSteps[0].extra?.fee).toBe(3000)

    // Direct swap, pool fee 1%
    expect(swapRoutes[2].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[2].swapSteps[0].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 0.05% 0.05%
    expect(swapRoutes[3].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[3].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[3].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[3].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[3].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[3].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[3].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 0.05% 0.3%
    expect(swapRoutes[4].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[4].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[4].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[4].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[4].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[4].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[4].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 0.05% 1%
    expect(swapRoutes[5].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[5].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[5].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[5].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[5].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[5].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[5].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 0.3% 0.05%
    expect(swapRoutes[6].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[6].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[6].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[6].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[6].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[6].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[6].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 0.3% 0.3%
    expect(swapRoutes[7].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[7].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[7].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[7].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[7].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[7].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[7].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 0.3% 1%
    expect(swapRoutes[8].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[8].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[8].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[8].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[8].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[8].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[8].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 1% 0.05%
    expect(swapRoutes[9].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[9].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[9].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[9].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[9].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[9].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[9].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 1% 0.3%
    expect(swapRoutes[10].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[10].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[10].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[10].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[10].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[10].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[10].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > WMATIC > USDC), pool fee 1% 1%
    expect(swapRoutes[11].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[11].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[11].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[11].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[11].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[11].swapSteps[1].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[11].swapSteps[1].extra?.fee).toBe(10000)
  })

  test('get swap routes - non wrapped native swap - non gateway token swap', async () => {
    const swapRoutes = await swapPathService.getSwapRoutes(POLYGON_USDT, POLYGON_DAI, chainId, Exchange.UNISWAPV3)

    // Should return 21 routes
    // + 3 pool fee tiers for direct swap
    // + 3 pool fee tiers ** 2 for swap with wrapped native token as intermediate
    // + 3 pool fee tiers ** 2 for swap with gateway token as intermediate
    expect(swapRoutes).toHaveLength(21)

    swapRoutes.forEach((route) => {
      expect(route.isFromNative).toBe(false)
      expect(route.isToNative).toBe(false)
    })

    // Direct swap, pool fee 0.05%
    expect(swapRoutes[0].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[0].swapSteps[0].extra?.fee).toBe(500)

    // Direct swap, pool fee 0.3%
    expect(swapRoutes[1].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[1].swapSteps[0].extra?.fee).toBe(3000)

    // Direct swap, pool fee 1%
    expect(swapRoutes[2].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[2].swapSteps[0].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 0.05% 0.05%
    expect(swapRoutes[3].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[3].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[3].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[3].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[3].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[3].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[3].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 0.05% 0.3%
    expect(swapRoutes[4].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[4].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[4].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[4].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[4].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[4].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[4].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 0.05% 1%
    expect(swapRoutes[5].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[5].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[5].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[5].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[5].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[5].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[5].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 0.3% 0.05%
    expect(swapRoutes[6].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[6].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[6].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[6].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[6].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[6].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[6].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 0.3% 0.3%
    expect(swapRoutes[7].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[7].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[7].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[7].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[7].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[7].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[7].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 0.3% 1%
    expect(swapRoutes[8].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[8].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[8].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[8].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[8].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[8].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[8].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 1% 0.05%
    expect(swapRoutes[9].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[9].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[9].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[9].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[9].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[9].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[9].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 1% 0.3%
    expect(swapRoutes[10].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[10].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[10].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[10].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[10].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[10].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[10].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > WMATIC > DAI), pool fee 1% 1%
    expect(swapRoutes[11].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[11].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[11].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[11].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[11].swapSteps[1].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[11].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[11].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 0.05% 0.05%
    expect(swapRoutes[12].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[12].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[12].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[12].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[12].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[12].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[12].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 0.05% 0.3%
    expect(swapRoutes[13].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[13].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[13].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[13].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[13].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[13].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[13].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 0.05% 1%
    expect(swapRoutes[14].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[14].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[14].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[14].swapSteps[0].extra?.fee).toBe(500)
    expect(tokenCmp(swapRoutes[14].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[14].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[14].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 0.3% 0.05%
    expect(swapRoutes[15].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[15].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[15].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[15].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[15].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[15].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[15].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 0.3% 0.3%
    expect(swapRoutes[16].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[16].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[16].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[16].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[16].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[16].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[16].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 0.3% 1%
    expect(swapRoutes[17].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[17].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[17].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[17].swapSteps[0].extra?.fee).toBe(3000)
    expect(tokenCmp(swapRoutes[17].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[17].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[17].swapSteps[1].extra?.fee).toBe(10000)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 1% 0.05%
    expect(swapRoutes[18].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[18].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[18].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[18].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[18].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[18].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[18].swapSteps[1].extra?.fee).toBe(500)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 1% 0.3%
    expect(swapRoutes[19].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[19].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[19].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[19].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[19].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[19].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[19].swapSteps[1].extra?.fee).toBe(3000)

    // Multi-hop swap (USDT > USDC > DAI), pool fee 1% 1%
    expect(swapRoutes[20].swapSteps).toHaveLength(2)
    expect(tokenCmp(swapRoutes[20].swapSteps[0].tokenIn, POLYGON_USDT)).toBe(true)
    expect(tokenCmp(swapRoutes[20].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[20].swapSteps[0].extra?.fee).toBe(10000)
    expect(tokenCmp(swapRoutes[20].swapSteps[1].tokenIn, POLYGON_USDC)).toBe(true)
    expect(tokenCmp(swapRoutes[20].swapSteps[1].tokenOut, POLYGON_DAI)).toBe(true)
    expect(swapRoutes[20].swapSteps[1].extra?.fee).toBe(10000)
  })

  test('get swap routes - from is native token', async () => {
    const swapRoutes = await swapPathService.getSwapRoutes(POLYGON_MATIC, POLYGON_USDC, chainId, Exchange.UNISWAPV3)

    // Should return 3 routes
    expect(swapRoutes).toHaveLength(3)

    swapRoutes.forEach((route) => {
      expect(route.isFromNative).toBe(true)
      expect(route.isToNative).toBe(false)
    })

    // Direct swap, pool fee 0.05%
    expect(swapRoutes[0].swapSteps).toHaveLength(1)
    // Native token should have been switched to its wrapped version
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[0].swapSteps[0].extra?.fee).toBe(500)

    // Direct swap, pool fee 0.3%
    expect(swapRoutes[1].swapSteps).toHaveLength(1)
    // Native token should have been switched to its wrapped version
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[1].swapSteps[0].extra?.fee).toBe(3000)

    // Direct swap, pool fee 1%
    expect(swapRoutes[2].swapSteps).toHaveLength(1)
    // Native token should have been switched to its wrapped version
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenIn, POLYGON_WMATIC)).toBe(true)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenOut, POLYGON_USDC)).toBe(true)
    expect(swapRoutes[2].swapSteps[0].extra?.fee).toBe(10000)
  })

  test('get swap routes - to is native token', async () => {
    const swapRoutes = await swapPathService.getSwapRoutes(POLYGON_USDC, POLYGON_MATIC, chainId, Exchange.UNISWAPV3)

    // Should return 3 routes
    expect(swapRoutes).toHaveLength(3)

    swapRoutes.forEach((route) => {
      expect(route.isFromNative).toBe(false)
      expect(route.isToNative).toBe(true)
    })

    // Direct swap, pool fee 0.05%
    expect(swapRoutes[0].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    // Native token should have been switched to its wrapped version
    expect(tokenCmp(swapRoutes[0].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[0].swapSteps[0].extra?.fee).toBe(500)

    // Direct swap, pool fee 0.3%
    expect(swapRoutes[1].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    // Native token should have been switched to its wrapped version
    expect(tokenCmp(swapRoutes[1].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[1].swapSteps[0].extra?.fee).toBe(3000)

    // Direct swap, pool fee 1%
    expect(swapRoutes[2].swapSteps).toHaveLength(1)
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenIn, POLYGON_USDC)).toBe(true)
    // Native token should have been switched to its wrapped version
    expect(tokenCmp(swapRoutes[2].swapSteps[0].tokenOut, POLYGON_WMATIC)).toBe(true)
    expect(swapRoutes[2].swapSteps[0].extra?.fee).toBe(10000)
  })
})

/**
 * @jest-environment node
 */

import { BaseSwapService } from '@/services/baseSwap'
import { ChainId, Exchange, SwapType } from '@/constants'
import { Token, SwapRoute, QuoteResult } from '@/types'

const chainId = ChainId.POLYGON

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

describe('baseSwap', () => {
  const baseSwapService = new BaseSwapService()

  test('validate swap route candidates - valid', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT,
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_USDT,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).not.toThrow()
  })

  test('validate swap route candidates - no candidate', () => {
    const candidates: SwapRoute[] = [] // No routes

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: no swap route candidates provided'
    )
  })

  test('validate swap route candidates - token in/out are same', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, invalid
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: invalid route, tokenIn and tokenOut are the same'
    )
  })

  test('validate swap route candidates - token in mismatch', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_USDT, // Different token in
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: invalid route, tokenIn mismatch'
    )
  })

  test('validate swap route candidates - token out mismatch', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT, // Different token out
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: invalid route, tokenOut mismatch'
    )
  })

  test('quote exact input - single route valid', async () => {
    const route: SwapRoute = {
      chainId: ChainId.POLYGON,
      exchange: Exchange.UNISWAPV3,
      swapSteps: [
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_USDC,
          extra: { fee: 500 },
        },
      ],
    }

    const result = await baseSwapService.getBestQuoteExactIn(BigInt(10e18), [route])

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_IN)
    expect(result?.amountIn).toBe(BigInt(10e18))
    expect(result?.amountOut).toBeGreaterThan(BigInt(0))
  })

  test('quote exact input - single route invalid', async () => {
    const route: SwapRoute = {
      chainId: ChainId.POLYGON,
      exchange: Exchange.UNISWAPV3,
      swapSteps: [
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
          extra: { fee: 500 },
        },
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_USDC,
          extra: { fee: 500 },
        },
      ],
    }

    const result = await baseSwapService.getBestQuoteExactIn(BigInt(10e18), [route])

    expect(result).toBeUndefined()
  })

  test('quote exact output - single route valid', async () => {
    const route: SwapRoute = {
      chainId: ChainId.POLYGON,
      exchange: Exchange.UNISWAPV3,
      swapSteps: [
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_USDC,
          extra: { fee: 500 },
        },
      ],
    }

    const result = await baseSwapService.getBestQuoteExactOut(BigInt(10e6), [route])

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_OUT)
    expect(result?.amountIn).toBeGreaterThan(BigInt(0))
    expect(result?.amountOut).toBe(BigInt(10e6))
  })

  test('quote exact output - single route invalid', async () => {
    const route: SwapRoute = {
      chainId: ChainId.POLYGON,
      exchange: Exchange.UNISWAPV3,
      swapSteps: [
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
          extra: { fee: 500 },
        },
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_USDC,
          extra: { fee: 500 },
        },
      ],
    }

    const result = await baseSwapService.getBestQuoteExactOut(BigInt(10e6), [route])

    expect(result).toBeUndefined()
  })

  test('quote exact input - multiple routes', async () => {
    const routes: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT,
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_USDT,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    const result = await baseSwapService.getBestQuoteExactIn(BigInt(10e18), routes)

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_IN)
    expect(result?.amountIn).toBe(BigInt(10e18))
    expect(result?.amountOut).toBeGreaterThan(BigInt(0))
  })

  test('quote exact output - multiple routes', async () => {
    const routes: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT,
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_USDT,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    const result = await baseSwapService.getBestQuoteExactOut(BigInt(10e6), routes)

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_OUT)
    expect(result?.amountIn).toBeGreaterThan(BigInt(0))
    expect(result?.amountOut).toBe(BigInt(10e6))
  })

  test('getSwapIntent - single step route with 0.5% slippage', () => {
    const quoteResult: QuoteResult = {
      swapType: SwapType.EXACT_IN,
      swapRoute: {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      amountIn: BigInt(10e18),
      amountOut: BigInt(20e6),
      validUntil: 0,
    }

    const swapIntent = baseSwapService.getSwapIntent(quoteResult, 50) // 0.5% slippage, valid until now

    expect(swapIntent).toEqual({
      tokenUserBuys: POLYGON_USDC.address,
      minAmountUserBuys: BigInt(19900000), // 20e6 * 0.995
      tokenUserSells: POLYGON_WMATIC.address,
      amountUserSells: BigInt(10e18),
    })
  })

  test('getSwapIntent - multi-step route with 1% slippage', () => {
    const quoteResult: QuoteResult = {
      swapType: SwapType.EXACT_OUT,
      swapRoute: {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT,
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_USDT,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      amountIn: BigInt(15e18),
      amountOut: BigInt(30e6),
      validUntil: 0,
    }

    const swapIntent = baseSwapService.getSwapIntent(quoteResult, 100) // 1% slippage

    expect(swapIntent).toEqual({
      tokenUserBuys: POLYGON_USDC.address,
      minAmountUserBuys: BigInt(29700000), // 30e6 * 0.99
      tokenUserSells: POLYGON_WMATIC.address,
      amountUserSells: BigInt(15e18),
    })
  })

  test('getSwapIntent - zero slippage', () => {
    const quoteResult: QuoteResult = {
      swapType: SwapType.EXACT_IN,
      swapRoute: {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      amountIn: BigInt(10e18),
      amountOut: BigInt(20e6),
      validUntil: 0,
    }

    const swapIntent = baseSwapService.getSwapIntent(quoteResult, 0) // 0% slippage

    expect(swapIntent).toEqual({
      tokenUserBuys: POLYGON_USDC.address,
      minAmountUserBuys: BigInt(20e6), // No change with 0% slippage
      tokenUserSells: POLYGON_WMATIC.address,
      amountUserSells: BigInt(10e18),
    })
  })
})

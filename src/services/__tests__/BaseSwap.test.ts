/**
 * @jest-environment node
 */

import { BaseSwapService } from '@/services/baseSwap'
import { ChainId, Exchange, SwapType } from '@/constants'
import { Token, SwapRoute, QuoteResult, QuoteRequest, QuoteResultWithPriceImpact } from '@/types'

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

const POLYGON_DAI: Token = {
  address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  chainId: chainId,
  decimals: 18,
  symbol: 'DAI',
  name: 'Dai',
  logoURI: '',
}

describe('baseSwap', () => {
  const baseSwapService = new BaseSwapService()

  describe('validateSwapRouteCandidates', () => {
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

    test('validate swap route candidates - valid multiple swap steps', () => {
      const candidates: SwapRoute[] = [
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
        'validateSwapRouteCandidates: invalid route in candidate 0, first tokenIn (WMATIC) and last tokenOut (WMATIC) are the same'
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
        'validateSwapRouteCandidates: candidate 1 has a different first tokenIn (USDT) than the reference (WMATIC)'
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
        'validateSwapRouteCandidates: candidate 1 has a different last tokenOut (USDT) than the reference (USDC)'
      )
    })

    test('validate swap route candidates - invalid step continuity', () => {
      const candidates: SwapRoute[] = [
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
              tokenIn: POLYGON_USDC, // This doesn't match the previous step's tokenOut
              tokenOut: POLYGON_DAI,
              extra: { fee: 500 },
            },
          ],
        },
      ]

      expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
        "validateSwapRouteCandidates: invalid route in candidate 0, step 0 tokenOut (USDT) doesn't match step 1 tokenIn (USDC)"
      )
    })
  })

  describe('getBestQuoteExactIn', () => {
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

      const result = await baseSwapService.getBestQuoteExactIn(BigInt(10e6), [route])

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
  })

  describe('getBestQuoteExactOut', () => {
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
      expect(result?.priceImpact).toBeDefined()
      expect(result?.priceImpact).not.toBeNull()
      expect(parseFloat(result?.priceImpact!!)).toBeGreaterThanOrEqual(0)
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

    test('quote exact output - multiple routes', async () => {
      const routes: SwapRoute[] = [
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
  })

  describe('getSwapIntent', () => {
    test('getSwapIntent - single step route with 0.5% slippage', () => {
      const quoteResult: QuoteResultWithPriceImpact = {
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
        priceImpact: '0.5',
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
      const quoteResult: QuoteResultWithPriceImpact = {
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
        priceImpact: '0.5',
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
      const quoteResult: QuoteResultWithPriceImpact = {
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
        priceImpact: '0.5',
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
})

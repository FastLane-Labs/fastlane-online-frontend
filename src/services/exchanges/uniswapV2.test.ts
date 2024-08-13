/**
 * @jest-environment node
 */

import { UniswapV2 } from './uniswapV2'
import { ChainId, Exchange, SwapType } from '@/constants'
import { Token, QuoteRequest } from '@/types'

const chainId = ChainId.POLYGON

const POLYGON_WMATIC: Token = {
  address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  chainId: chainId,
  decimals: 18,
  symbol: 'WMATIC',
  name: 'Wrapped Matic',
  logoURI: '',
}

const INVALID_TOKEN: Token = {
  address: '0x0D500b1d8e8eF31E22c99d1dB9A6444D3ADf1270',
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

describe('UniswapV2', () => {
  describe('getQuote', () => {
    test('quote with invalid route', async () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e18),
        swapType: SwapType.EXACT_IN,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: INVALID_TOKEN, // Invalid: same token
              extra: {},
            },
          ],
          isFromNative: false,
          isToNative: false,
        },
        smallAmount: BigInt(1e18),
      }

      const result = await UniswapV2.getQuote(quoteRequest)

      expect(result).toBeUndefined()
    })

    test('quote exact input - single hop', async () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e18), // 10 WMATIC
        swapType: SwapType.EXACT_IN,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: POLYGON_USDC,
              extra: {},
            },
          ],
          isFromNative: false,
          isToNative: false,
        },
        smallAmount: BigInt(1e18), // 1 WMATIC
      }

      const result = await UniswapV2.getQuote(quoteRequest)

      expect(result).toBeDefined()
      expect(result?.regularQuote.swapType).toBe(SwapType.EXACT_IN)
      expect(result?.regularQuote.amountIn).toBe(BigInt(10e18))
      expect(result?.regularQuote.amountOut).toBeGreaterThan(BigInt(0))
      expect(result?.smallQuote.amountIn).toBe(BigInt(1e18))
      expect(result?.smallQuote.amountOut).toBeGreaterThan(BigInt(0))
    })

    test('quote exact output - single hop', async () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e6), // 10 USDC
        swapType: SwapType.EXACT_OUT,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: POLYGON_USDC,
              extra: {},
            },
          ],
          isFromNative: false,
          isToNative: false,
        },
        smallAmount: BigInt(1e6), // 1 USDC
      }

      const result = await UniswapV2.getQuote(quoteRequest)

      expect(result).toBeDefined()
      expect(result?.regularQuote.swapType).toBe(SwapType.EXACT_OUT)
      expect(result?.regularQuote.amountOut).toBe(BigInt(10e6))
      expect(result?.regularQuote.amountIn).toBeGreaterThan(BigInt(0))
      expect(result?.smallQuote.amountOut).toBe(BigInt(1e6))
      expect(result?.smallQuote.amountIn).toBeGreaterThan(BigInt(0))
    })

    test('quote exact input - multi hop', async () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e18), // 10 WMATIC
        swapType: SwapType.EXACT_IN,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: POLYGON_USDT,
              extra: {},
            },
            {
              tokenIn: POLYGON_USDT,
              tokenOut: POLYGON_USDC,
              extra: {},
            },
          ],
          isFromNative: false,
          isToNative: false,
        },
        smallAmount: BigInt(1e18), // 1 WMATIC
      }

      const result = await UniswapV2.getQuote(quoteRequest)

      expect(result).toBeDefined()
      expect(result?.regularQuote.swapType).toBe(SwapType.EXACT_IN)
      expect(result?.regularQuote.amountIn).toBe(BigInt(10e18))
      expect(result?.regularQuote.amountOut).toBeGreaterThan(BigInt(0))
      expect(result?.smallQuote.amountIn).toBe(BigInt(1e18))
      expect(result?.smallQuote.amountOut).toBeGreaterThan(BigInt(0))
    })

    test('quote exact output - multi hop', async () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e6), // 10 USDC
        swapType: SwapType.EXACT_OUT,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: POLYGON_USDT,
              extra: {},
            },
            {
              tokenIn: POLYGON_USDT,
              tokenOut: POLYGON_USDC,
              extra: {},
            },
          ],
          isFromNative: false,
          isToNative: false,
        },
        smallAmount: BigInt(1e6), // 1 USDC
      }

      const result = await UniswapV2.getQuote(quoteRequest)

      expect(result).toBeDefined()
      expect(result?.regularQuote.swapType).toBe(SwapType.EXACT_OUT)
      expect(result?.regularQuote.amountOut).toBe(BigInt(10e6))
      expect(result?.regularQuote.amountIn).toBeGreaterThan(BigInt(0))
      expect(result?.smallQuote.amountOut).toBe(BigInt(1e6))
      expect(result?.smallQuote.amountIn).toBeGreaterThan(BigInt(0))
    })

    test('quote with native token', async () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e18), // 10 MATIC
        swapType: SwapType.EXACT_IN,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: POLYGON_USDC,
              extra: {},
            },
          ],
          isFromNative: true,
          isToNative: false,
        },
        smallAmount: BigInt(1e18), // 1 MATIC
      }

      const result = await UniswapV2.getQuote(quoteRequest)

      expect(result).toBeDefined()
      expect(result?.regularQuote.swapType).toBe(SwapType.EXACT_IN)
      expect(result?.regularQuote.amountIn).toBe(BigInt(10e18))
      expect(result?.regularQuote.amountOut).toBeGreaterThan(BigInt(0))
      expect(result?.smallQuote.amountIn).toBe(BigInt(1e18))
      expect(result?.smallQuote.amountOut).toBeGreaterThan(BigInt(0))
    })
  })

  describe('getQuoteContractCalls', () => {
    test('get quote contract calls - exact input', () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e18),
        swapType: SwapType.EXACT_IN,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: POLYGON_USDC,
              extra: {},
            },
          ],
          isFromNative: false,
          isToNative: false,
        },
        smallAmount: BigInt(1e18),
      }

      const calls = UniswapV2.getQuoteContractCalls(quoteRequest)

      expect(calls).toHaveLength(2)
      expect(calls[0].functionName).toBe('getAmountsOut')
      expect(calls[1].functionName).toBe('getAmountsOut')
      expect(calls[0].args?.[0]).toBe(BigInt(10e18))
      expect(calls[1].args?.[0]).toBe(BigInt(1e18))
    })

    test('get quote contract calls - exact output', () => {
      const quoteRequest: QuoteRequest = {
        amount: BigInt(10e6),
        swapType: SwapType.EXACT_OUT,
        swapRoute: {
          chainId: ChainId.POLYGON,
          exchange: Exchange.UNISWAPV2,
          swapSteps: [
            {
              tokenIn: POLYGON_WMATIC,
              tokenOut: POLYGON_USDC,
              extra: {},
            },
          ],
          isFromNative: false,
          isToNative: false,
        },
        smallAmount: BigInt(1e6),
      }

      const calls = UniswapV2.getQuoteContractCalls(quoteRequest)

      expect(calls).toHaveLength(2)
      expect(calls[0].functionName).toBe('getAmountsIn')
      expect(calls[1].functionName).toBe('getAmountsIn')
      expect(calls[0].args?.[0]).toBe(BigInt(10e6))
      expect(calls[1].args?.[0]).toBe(BigInt(1e6))
    })
  })
})

import { NativeWrapper } from '@/services/exchanges/nativeWrapper'
import { Token, QuoteRequest, SwapRoute } from '@/types'
import { ChainId, Exchange, SwapType } from '@/constants'

describe('NativeWrapper', () => {
  const chainId = ChainId.POLYGON
  const mockNativeToken: Token = {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    chainId: chainId,
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
    logoURI: '',
  }

  const mockWrappedToken: Token = {
    address: '0x0D500b1d8e8eF31E22c99d1dB9A6444D3ADf1270',
    chainId: chainId,
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
    logoURI: '',
  }

  const mockSwapRoute: SwapRoute = {
    chainId: chainId,
    exchange: Exchange.NativeWrapper,
    swapSteps: [
      {
        tokenIn: mockNativeToken,
        tokenOut: mockWrappedToken,
        extra: {},
      },
    ],
    isFromNative: true,
    isToNative: false,
  }

  describe('buildSwapStepsFromTokens', () => {
    it('should return correct swap steps', () => {
      const steps = NativeWrapper.buildSwapStepsFromTokens(mockNativeToken, mockWrappedToken)
      expect(steps).toHaveLength(1)
      expect(steps[0]).toEqual({
        tokenIn: mockNativeToken,
        tokenOut: mockWrappedToken,
        extra: {},
      })
    })
  })

  describe('getQuote', () => {
    it('should return correct quote results for EXACT_IN', async () => {
      const quoteRequest: QuoteRequest = {
        swapType: SwapType.EXACT_IN,
        amount: 1000000000000000000n, // 1 ETH
        smallAmount: 100000000000000000n, // 0.1 ETH
        swapRoute: mockSwapRoute,
      }

      const quoteResults = await NativeWrapper.getQuote(quoteRequest)
      expect(quoteResults).toBeDefined()
      expect(quoteResults?.regularQuote).toEqual(
        expect.objectContaining({
          swapType: SwapType.WRAP,
          amountIn: 1000000000000000000n,
          amountOut: 1000000000000000000n,
          swapRoute: mockSwapRoute,
        })
      )
      expect(quoteResults?.smallQuote).toEqual(
        expect.objectContaining({
          swapType: SwapType.WRAP,
          amountIn: 100000000000000000n,
          amountOut: 100000000000000000n,
          swapRoute: mockSwapRoute,
        })
      )
    })

    it('should return correct quote results for EXACT_OUT', async () => {
      const quoteRequest: QuoteRequest = {
        swapType: SwapType.WRAP,
        amount: 1000000000000000000n, // 1 ETH
        smallAmount: 100000000000000000n, // 0.1 ETH
        swapRoute: mockSwapRoute,
      }

      const quoteResults = await NativeWrapper.getQuote(quoteRequest)
      expect(quoteResults).toBeDefined()
      expect(quoteResults?.regularQuote).toEqual(
        expect.objectContaining({
          swapType: SwapType.WRAP,
          amountIn: 1000000000000000000n,
          amountOut: 1000000000000000000n,
          swapRoute: mockSwapRoute,
        })
      )
      expect(quoteResults?.smallQuote).toEqual(
        expect.objectContaining({
          swapType: SwapType.WRAP,
          amountIn: 100000000000000000n,
          amountOut: 100000000000000000n,
          swapRoute: mockSwapRoute,
        })
      )
    })
  })

  describe('getQuoteContractCalls', () => {
    it('should return an empty array', () => {
      const quoteRequest: QuoteRequest = {
        swapType: SwapType.EXACT_IN,
        amount: 1000000000000000000n,
        smallAmount: 100000000000000000n,
        swapRoute: mockSwapRoute,
      }

      const calls = NativeWrapper.getQuoteContractCalls(quoteRequest)
      expect(calls).toEqual([])
    })
  })

  describe('getSwapCalldataFromQuoteResult', () => {
    it('should return correct calldata for deposit (wrap)', () => {
      const quoteResult = {
        swapType: SwapType.EXACT_IN,
        amountIn: 1000000000000000000n,
        amountOut: 1000000000000000000n,
        swapRoute: mockSwapRoute,
        validUntil: Math.floor(Date.now() / 1000) + 30,
      }

      const calldata = NativeWrapper.getSwapCalldataFromQuoteResult(
        quoteResult,
        '0x1234567890123456789012345678901234567890',
        50
      )
      expect(calldata).toBe('0xd0e30db0') // Function selector for deposit()
    })

    it('should return correct calldata for withdraw (unwrap)', () => {
      const unwrapSwapRoute = {
        ...mockSwapRoute,
        isFromNative: false,
        isToNative: true,
        swapSteps: [
          {
            tokenIn: mockWrappedToken,
            tokenOut: mockNativeToken,
            extra: {},
          },
        ],
      }

      const quoteResult = {
        swapType: SwapType.EXACT_IN,
        amountIn: 1000000000000000000n,
        amountOut: 1000000000000000000n,
        swapRoute: unwrapSwapRoute,
        validUntil: Math.floor(Date.now() / 1000) + 30,
      }

      const calldata = NativeWrapper.getSwapCalldataFromQuoteResult(
        quoteResult,
        '0x1234567890123456789012345678901234567890',
        50
      )
      expect(calldata).toBe('0x2e1a7d4d0000000000000000000000000000000000000000000000000de0b6b3a7640000') // Function selector for withdraw(uint256) + amount (1 ETH)
    })
  })
})

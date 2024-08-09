import { TokenPriceService, ITokenPriceService } from '@/services/tokenPrice'
import { SwapPathService } from '@/services/swapPath'
import { BaseSwapService } from '@/services/baseSwap'
import { TokenProvider } from '@/providers/StaticTokenListProvider'
import { Token, QuoteResult } from '@/types'
import { ChainId, Exchange, SwapType } from '@/constants'

// Mock dependencies
jest.mock('@/services/swapPath')
jest.mock('@/services/baseSwap')
jest.mock('@/providers/StaticTokenListProvider')

describe('TokenPriceService', () => {
  let tokenPriceService: ITokenPriceService
  let mockSwapPathService: jest.Mocked<SwapPathService>
  let mockBaseSwapService: jest.Mocked<BaseSwapService>

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()

    // Set up mock implementations
    mockSwapPathService = {
      getInstance: jest.fn().mockReturnThis(),
      getSwapRoutes: jest.fn(),
    } as unknown as jest.Mocked<SwapPathService>

    mockBaseSwapService = {
      getInstance: jest.fn().mockReturnThis(),
      getBestQuoteExactIn: jest.fn(),
    } as unknown as jest.Mocked<BaseSwapService>

    // @ts-ignore - Ignore readonly property assignment in test
    SwapPathService.getInstance = jest.fn().mockReturnValue(mockSwapPathService)
    // @ts-ignore - Ignore readonly property assignment in test
    BaseSwapService.getInstance = jest.fn().mockReturnValue(mockBaseSwapService)

    tokenPriceService = new TokenPriceService()
  })

  describe('getTokens', () => {
    it('should return tokens for a given chain ID', async () => {
      const mockTokens: Token[] = [
        { address: '0x1', symbol: 'TOKEN1', name: 'Token 1', decimals: 18, chainId: 137 as ChainId, logoURI: '' },
        { address: '0x2', symbol: 'TOKEN2', name: 'Token 2', decimals: 18, chainId: 137 as ChainId, logoURI: '' },
      ]
      ;(TokenProvider.getTokensByChainId as jest.Mock).mockResolvedValue(mockTokens)

      const result = await tokenPriceService.getTokens(1 as ChainId)
      expect(result).toEqual(mockTokens)
      expect(TokenProvider.getTokensByChainId).toHaveBeenCalledWith(1)
    })
  })

  describe('getTokenByAddress', () => {
    it('should return a token for a given address and chain ID', async () => {
      const mockTokens: Token[] = [
        { address: '0x1', symbol: 'TOKEN1', name: 'Token 1', decimals: 18, chainId: 137 as ChainId, logoURI: '' },
        { address: '0x2', symbol: 'TOKEN2', name: 'Token 2', decimals: 18, chainId: 137 as ChainId, logoURI: '' },
      ]
      ;(TokenProvider.getTokensByChainId as jest.Mock).mockResolvedValue(mockTokens)

      const result = await tokenPriceService.getTokenByAddress('0x1', 1 as ChainId)
      expect(result).toEqual(mockTokens[0])
    })

    it('should return null for a non-existent token address', async () => {
      const mockTokens: Token[] = [
        { address: '0x1', symbol: 'TOKEN1', name: 'Token 1', decimals: 18, chainId: 137 as ChainId, logoURI: '' },
      ]
      ;(TokenProvider.getTokensByChainId as jest.Mock).mockResolvedValue(mockTokens)

      const result = await tokenPriceService.getTokenByAddress('0x2', 1 as ChainId)
      expect(result).toBeNull()
    })
  })

  describe('getUsdPriceForToken', () => {
    const usdcToken: Token = {
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 137 as ChainId,
      logoURI: '',
    }
    const testToken: Token = {
      address: '0x1',
      symbol: 'TEST',
      name: 'Test Token',
      decimals: 18,
      chainId: 137 as ChainId,
      logoURI: '',
    }

    it('should return 1 for USDC token', async () => {
      const result = await tokenPriceService.getUsdPriceForToken(usdcToken, usdcToken)
      expect(result).toBe(1)
    })

    it('should calculate the correct price for a non-USDC token', async () => {
      const mockQuoteResult: QuoteResult = {
        amountIn: BigInt(10000), // 0.01 USDC
        amountOut: BigInt(5 * 10 ** 17), // 0.5 TEST tokens
        swapRoute: { chainId: 137 as ChainId, exchange: Exchange.UNISWAPV3, swapSteps: [] },
        swapType: SwapType.EXACT_IN,
        validUntil: new Date().getTime(),
      }

      mockSwapPathService.getSwapRoutes.mockResolvedValue([
        { chainId: 137 as ChainId, exchange: Exchange.UNISWAPV3, swapSteps: [] },
      ])
      mockBaseSwapService.getBestQuoteExactIn.mockResolvedValue(mockQuoteResult)

      const result = await tokenPriceService.getUsdPriceForToken(usdcToken, testToken)
      expect(result).toBeCloseTo(0.02, 5) // 0.01 / 0.5 = 0.02
    })

    it('should return 0 if no quote is available', async () => {
      mockSwapPathService.getSwapRoutes.mockResolvedValue([])

      const result = await tokenPriceService.getUsdPriceForToken(usdcToken, testToken)
      expect(result).toBe(0)
    })
  })
})

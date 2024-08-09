import { Token, QuoteResult } from '@/types'
import { SwapPathService } from '@/services/swapPath'
import { BaseSwapService } from '@/services/baseSwap'
import { Exchange, ChainId, TOKEN_ADDRESSES } from '@/constants'
import { toBigInt } from '@/utils/format'
import { TokenProvider } from '@/providers/StaticTokenListProvider'
import { calculateExchangeRate } from '@/utils/exchangeRate'

export interface ITokenPriceService {
  getTokens(chainId: ChainId): Promise<Token[]>
  getTokenByAddress(address: string, chainId: ChainId): Promise<Token | null>
  getUsdPriceForToken(usdcToken: Token, token: Token): Promise<number>
}

export class TokenPriceService implements ITokenPriceService {
  private swapPathService: SwapPathService
  private baseSwapService: BaseSwapService

  constructor() {
    this.swapPathService = SwapPathService.getInstance()
    this.baseSwapService = BaseSwapService.getInstance()
  }

  async getTokens(chainId: ChainId): Promise<Token[]> {
    return TokenProvider.getTokensByChainId(chainId)
  }

  async getTokenByAddress(address: string, chainId: ChainId): Promise<Token | null> {
    const tokens = await this.getTokens(chainId)
    return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase()) || null
  }

  private async getQuote(
    fromToken: Token,
    toToken: Token,
    amountIn: string,
    chainId: ChainId
  ): Promise<QuoteResult | null> {
    const swapRoutes = await this.swapPathService.getSwapRoutes(fromToken, toToken, chainId, Exchange.UNISWAPV3)
    if (swapRoutes.length === 0) return null

    const amountInBigInt = toBigInt(amountIn, fromToken.decimals)
    const quoteResult = await this.baseSwapService.getBestQuoteExactIn(amountInBigInt, swapRoutes)
    return quoteResult || null
  }

  async getUsdPriceForToken(usdcToken: Token, token: Token): Promise<number> {
    if (token.address.toLowerCase() === usdcToken.address.toLowerCase()) {
      return 1 // USDC is always 1 USD
    }

    const quoteAmount = '0.01' // We're quoting for 0.01 USDC
    const quoteResult = await this.getQuote(usdcToken, token, quoteAmount, token.chainId)
    if (!quoteResult) return 0

    const tokenAmount = Number(quoteResult.amountOut) / 10 ** token.decimals
    return 0.01 / tokenAmount
  }
}

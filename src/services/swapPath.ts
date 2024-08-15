import { TokenProvider } from '@/providers/StaticTokenListProvider'
import { ChainId, Exchange, nativeEvmTokenAddress, TOKEN_ADDRESSES } from '@/constants'
import { Token, SwapStep, SwapRoute } from '@/types'
import { getExchange } from '@/services/exchanges'
import { tokenCmp } from '@/utils/token'
import { Address } from 'viem'

interface ISwapPathService {
  getSwapRoutes(from: Token, to: Token, chainId: ChainId, exchange: Exchange): Promise<SwapRoute[]>
}

export class SwapPathService implements ISwapPathService {
  private static instance: SwapPathService
  protected tokens: Map<ChainId, Map<Address, Token>> = new Map()
  protected nativeTokens: Map<ChainId, Token> = new Map()
  protected wrappedNativeTokens: Map<ChainId, Token> = new Map()
  protected gatewayTokens: Map<ChainId, Token> = new Map()

  public static getInstance(): SwapPathService {
    if (!SwapPathService.instance) {
      SwapPathService.instance = new SwapPathService()
    }

    return SwapPathService.instance
  }

  /**
   * Load tokens for the chain ID set in the constructor
   * @throws If the native, wrapped native token or gateway token are not found
   */
  async loadTokens(chainId: ChainId) {
    const tokens = await TokenProvider.getTokensByChainId(chainId)

    if (!this.tokens.has(chainId)) {
      this.tokens.set(chainId, new Map())
    }

    tokens.forEach((token) => {
      this.tokens.get(chainId)!.set(token.address, token)
    })

    const nativeToken = this.tokens.get(chainId)!.get(nativeEvmTokenAddress)
    if (!nativeToken) {
      throw new Error('Native token not found for chain ID ' + chainId)
    }

    const wrappedNativeToken = this.tokens.get(chainId)!.get(TOKEN_ADDRESSES[chainId].wrappedNative)
    if (!wrappedNativeToken) {
      throw new Error('Wrapped native token not found for chain ID ' + chainId)
    }

    const gatewayToken = this.tokens.get(chainId)!.get(TOKEN_ADDRESSES[chainId].bestGateway)
    if (!gatewayToken) {
      throw new Error('Gateway token not found for chain ID ' + chainId)
    }

    this.nativeTokens.set(chainId, nativeToken)
    this.wrappedNativeTokens.set(chainId, wrappedNativeToken)
    this.gatewayTokens.set(chainId, gatewayToken)
  }

  /**
   * Get swap routes for a pair of tokens and an exchange
   * @param from The token to swap from
   * @param to The token to swap to
   * @param _exchange The exchange to use
   * @returns The swap routes
   * @throws If the tokens are not found or are the same
   */
  async getSwapRoutes(from: Token, to: Token, chainId: ChainId, _exchange: Exchange): Promise<SwapRoute[]> {
    if (!this.tokens.has(chainId)) {
      await this.loadTokens(chainId)
    }

    const nativeToken = this.nativeTokens.get(chainId) as Token
    const wrappedNativeToken = this.wrappedNativeTokens.get(chainId) as Token
    const gatewayToken = this.gatewayTokens.get(chainId) as Token

    const isFromNative = tokenCmp(from, nativeToken)
    const isToNative = tokenCmp(to, nativeToken)
    const isFromWrappedNative = tokenCmp(from, wrappedNativeToken)
    const isToWrappedNative = tokenCmp(to, wrappedNativeToken)

    // Handle the special case for native and wrapped native token pairs
    if ((isFromNative && isToWrappedNative) || (isFromWrappedNative && isToNative)) {
      return [this.createWrapSwapRoute(chainId, from, to, isFromNative, isToNative)]
    }

    // Adjust tokens if native is involved
    if (isFromNative) from = wrappedNativeToken
    if (isToNative) to = wrappedNativeToken

    if (!this.tokens.get(chainId)!.has(from.address)) {
      throw new Error('getSwapRoutes: token not found: ' + from.address)
    }

    if (!this.tokens.get(chainId)!.has(to.address)) {
      throw new Error('getSwapRoutes: token not found: ' + to.address)
    }

    if (tokenCmp(from, to)) {
      throw new Error('getSwapRoutes: from and to tokens are the same')
    }

    const exchange = getExchange(_exchange)
    let swapRoutes: SwapRoute[] = []

    // Add direct routes
    for (const swapStep of exchange.buildSwapStepsFromTokens(from, to)) {
      swapRoutes.push(this.createSwapRoute(chainId, _exchange, [swapStep], isFromNative, isToNative))
    }

    if (!tokenCmp(from, wrappedNativeToken) && !tokenCmp(to, wrappedNativeToken)) {
      // Swap from/to non-wrapped native token: add gateway swap routes

      // Add wrapped native token as intermediate token
      swapRoutes.push(
        ...this.buildRoutesFromStepsCombination(
          chainId,
          _exchange,
          exchange.buildSwapStepsFromTokens(from, wrappedNativeToken),
          exchange.buildSwapStepsFromTokens(wrappedNativeToken, to),
          isFromNative,
          isToNative
        )
      )

      if (!tokenCmp(from, gatewayToken) && !tokenCmp(to, gatewayToken)) {
        // Swap from/to non-gateway token: add gateway token as intermediate token

        // Add gateway token as intermediate token
        swapRoutes.push(
          ...this.buildRoutesFromStepsCombination(
            chainId,
            _exchange,
            exchange.buildSwapStepsFromTokens(from, gatewayToken),
            exchange.buildSwapStepsFromTokens(gatewayToken, to),
            isFromNative,
            isToNative
          )
        )
      }
    }

    return swapRoutes
  }

  protected createWrapSwapRoute(chainId: ChainId, from: Token, to: Token, isFromNative: boolean, isToNative: boolean) {
    const wrapStep: SwapStep = {
      tokenIn: from,
      tokenOut: to,
      extra: {},
    }

    return {
      chainId,
      exchange: Exchange.NativeWrapper,
      swapSteps: [wrapStep],
      isFromNative: isFromNative,
      isToNative: isToNative,
    }
  }

  /**
   * Build swap routes from two sets of swap steps
   * @param exchange The exchange to use
   * @param steps1 The first set of swap steps
   * @param steps2 The second set of swap steps
   * @returns The swap routes
   */
  protected buildRoutesFromStepsCombination(
    chainId: ChainId,
    exchange: Exchange,
    steps1: SwapStep[],
    steps2: SwapStep[],
    isFromNative: boolean,
    isToNative: boolean
  ): SwapRoute[] {
    let routes: SwapRoute[] = []

    for (const step1 of steps1) {
      for (const step2 of steps2) {
        routes.push(this.createSwapRoute(chainId, exchange, [step1, step2], isFromNative, isToNative))
      }
    }

    return routes
  }

  /**
   * Create a swap route
   * @param chainId The chain ID
   * @param exchange The exchange
   * @param swapSteps The swap steps
   * @param fromOriginal The original from token
   * @param toOriginal The original to token
   * @param isFromNative Whether the from token is the native token
   * @param isToNative Whether the to token is the native token
   * @returns The swap route
   */
  protected createSwapRoute(
    chainId: ChainId,
    exchange: Exchange,
    swapSteps: SwapStep[],
    isFromNative: boolean,
    isToNative: boolean
  ): SwapRoute {
    return {
      chainId: chainId,
      exchange: exchange,
      swapSteps: swapSteps,
      isFromNative: isFromNative,
      isToNative: isToNative,
    }
  }
}

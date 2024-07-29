import { ITokenProvider, Token } from '@/types'
import polygonTokens from '@/config/tokenListPolygon.json'

export class StaticTokenListProvider implements ITokenProvider {
  private static instance: StaticTokenListProvider
  private tokenLists: Map<number, Token[]> = new Map()

  private constructor() {
    this.loadTokenLists()
  }

  public static getInstance(): StaticTokenListProvider {
    if (!StaticTokenListProvider.instance) {
      StaticTokenListProvider.instance = new StaticTokenListProvider()
    }
    return StaticTokenListProvider.instance
  }

  private loadTokenLists() {
    this.tokenLists.set(137, polygonTokens as Token[])
    // Add other chain IDs and their token lists here
  }

  async getTokensByChainId(chainId: number): Promise<Token[]> {
    const tokens = this.tokenLists.get(chainId)
    if (!tokens) {
      throw new Error(`No token list found for chain ID ${chainId}`)
    }
    return tokens
  }
}

export const TokenProvider = StaticTokenListProvider.getInstance()

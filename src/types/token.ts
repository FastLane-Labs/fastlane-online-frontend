export type Token = {
  chainId: number
  address: string
  decimals: number
  name: string
  symbol: string
  logoURI: string
  tags?: string[]
}

export type TokenWithBalance = Token & { balance: string }

export interface ITokenProvider {
  getTokensByChainId(chainId: number): Promise<Token[]>
}

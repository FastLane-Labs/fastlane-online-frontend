import { TypedDataDomain } from 'ethers'

export interface ChainConfig {
  contracts: {
    atlas: {
      address: string
    }
    atlasVerification: {
      address: string
    }
    appAddress: {
      address: string
    }
    multicall3: {
      address: string
    }
  }
  eip712Domain: TypedDataDomain
  blockExplorerUrl: string
}

import { ChainConfig } from '@/types/chains'

export const CHAIN_CONFIG: { [chainId: number]: ChainConfig } = {
  137: {
    contracts: {
      atlas: {
        address: '0x57FA2aBf1dc109C5F7ea2FB6A72358D2c624971d',
      },
      atlasVerification: {
        address: '0xA462C35C43355928F114144AD20AddD6Bb09b52f',
      },
      dappAddress: {
        address: '0x8e098Dfd60aEC9bCf07fd3cA5933e9F22b1b4A0d',
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    eip712Domain: {
      name: 'AtlasVerification',
      version: '1.0',
      chainId: 137,
      verifyingContract: '0xA462C35C43355928F114144AD20AddD6Bb09b52f',
    },
    blockExplorerUrl: 'https://polygonscan.com/',
  },
}

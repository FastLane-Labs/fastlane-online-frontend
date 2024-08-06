import { ChainConfig } from '@/types/chains'

export const CHAIN_CONFIG: { [chainId: number]: ChainConfig } = {
  137: {
    contracts: {
      atlas: {
        address: '0x892F8f6779ca6927c1A6Cc74319e03d2abEf18D5',
      },
      atlasVerification: {
        address: '0xc05DDBe9745ce9DB45C32F5e4C1DA7a3c4FDa220',
      },
      appAddress: {
        address: '0x0E3009d01e85ac49D164E453Ec81283EAAf46fB5',
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    eip712Domain: {
      name: 'AtlasVerification',
      version: '1.0',
      chainId: 137,
      verifyingContract: '0xc05DDBe9745ce9DB45C32F5e4C1DA7a3c4FDa220',
    },
  },
}

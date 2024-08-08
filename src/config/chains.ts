import { ChainConfig } from '@/types/chains'

export const CHAIN_CONFIG: { [chainId: number]: ChainConfig } = {
  137: {
    contracts: {
      atlas: {
        address: '0x20eA1943264FED9471f4E9430C935986A60905E3',
      },
      atlasVerification: {
        address: '0xd72A38636d88B7F7326340add69a1A494E74c913',
      },
      dappAddress: {
        address: '0x3BF81d7D921E7a6A1999ce3dfa3B348c50fE8DFd',
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    eip712Domain: {
      name: 'AtlasVerification',
      version: '1.0',
      chainId: 137,
      verifyingContract: '0xd72A38636d88B7F7326340add69a1A494E74c913',
    },
    blockExplorerUrl: 'https://polygonscan.com/',
  },
}

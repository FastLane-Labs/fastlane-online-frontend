import { ChainConfig } from '@/types/chains'

export const CHAIN_CONFIG: { [chainId: number]: ChainConfig } = {
  137: {
    contracts: {
      atlas: {
        address: '0xCD2724Fd9079Bd57278F02808cB11848c318577d',
      },
      atlasVerification: {
        address: '0xf61F7B507b21513D51DC2a0dbFc950F4801605a5',
      },
      dappAddress: {
        address: '0xCf00A98bA4ea1D967f34B07Ff76f61E1A5521B96',
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    eip712Domain: {
      name: 'AtlasVerification',
      version: '1.0',
      chainId: 137,
      verifyingContract: '0xf61F7B507b21513D51DC2a0dbFc950F4801605a5',
    },
    blockExplorerUrl: 'https://polygonscan.com/',
  },
}

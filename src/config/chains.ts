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
        address: '0x87f9B954C403Fec2A9964CFFB8AcA9CD7ED55FDf',
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

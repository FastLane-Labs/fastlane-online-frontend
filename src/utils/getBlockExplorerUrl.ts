import { CHAIN_CONFIG } from '@/config/chains'

/**
 * Get the block explorer URL for the given chain ID
 * @param chainId The chain ID
 * @returns The block explorer URL
 */
export function getBlockExplorerUrl(chainId: number): string {
  const config = CHAIN_CONFIG[chainId]
  if (config && config.blockExplorerUrl) {
    return config.blockExplorerUrl
  }
  throw new Error('Unsupported chain ID')
}

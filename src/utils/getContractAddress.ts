import { CHAIN_CONFIG } from '@/config/chains'

/**
 * Get the address of the Atlas contract (FastLane Reservoir)
 * @param chainId The chain ID
 * @returns The address of the Atlas contract
 */
export const getAtlasAddress = (chainId: number) => {
  const config = CHAIN_CONFIG[chainId]
  if (config && config.contracts.atlas) {
    return config.contracts.atlas.address
  }
  throw new Error('Unsupported chain ID')
}

/**
 * Get the address of the Dapp contract (FastLaneOnline Dapp)
 * @param chainId The chain ID
 * @returns The address of the Dapp contract
 */
export const getDappAddress = (chainId: number) => {
  const config = CHAIN_CONFIG[chainId]
  if (config && config.contracts.dappAddress) {
    return config.contracts.dappAddress.address
  }
  throw new Error('Unsupported chain ID')
}

/**
 * Get the address of the Atlas verification contract (FastLane Reservoir)
 * @param chainId The chain ID
 * @returns The address of the Atlas verification contract
 */
export const getAtlasVerificationAddress = (chainId: number) => {
  const config = CHAIN_CONFIG[chainId]
  if (config && config.contracts.atlasVerification) {
    return config.contracts.atlasVerification.address
  }
  throw new Error('Unsupported chain ID')
}

/**
 * Get the address of the Multicall3 contract
 * @param chainId The chain ID
 * @returns The address of the Multicall3 contract
 */
export const getMulticall3Address = (chainId: number) => {
  const config = CHAIN_CONFIG[chainId]
  if (config && config.contracts.multicall3) {
    return config.contracts.multicall3.address
  }
  throw new Error('Unsupported chain ID')
}

/**
 * Get the EIP712 domain for the given chain ID
 * @param chainId The chain ID
 * @returns The EIP712 domain
 */
export const getEip712Domain = (chainId: number) => {
  const config = CHAIN_CONFIG[chainId]
  if (config && config.eip712Domain) {
    return config.eip712Domain
  }
  throw new Error('Unsupported chain ID')
}

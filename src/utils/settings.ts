import { ChainId } from '@/constants'

export const basisPointsToPercent = (basisPoints: number) => basisPoints / 100
export const percentToBasisPoints = (percent: number) => Math.round(percent * 100)

const BLOCKS_PER_MINUTE: { [key in ChainId]?: number } = {
  [ChainId.POLYGON]: 30,
  // Add other chains as needed
}

export const getBlockPerMinute = (chainId: ChainId): number => {
  const blocksPerMinute = BLOCKS_PER_MINUTE[chainId]
  if (blocksPerMinute === undefined) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return blocksPerMinute
}

/**
 * Calculates the deadline block number based on the current block number and a number of minutes
 * @param deadline Number of minutes for the deadline
 * @param currentBlockNumber The current block number
 * @param chainId The chain ID
 * @returns Estimated block number for the deadline
 * @throws Error if the chain ID is not supported
 */
export function calculateDeadlineBlockNumber(deadline: number, currentBlockNumber: number, chainId: ChainId): number {
  const blocksUntilDeadline = minutesToBlocks(deadline, chainId)
  return currentBlockNumber + blocksUntilDeadline
}

/**
 * Converts minutes to an estimated number of blocks
 * @param minutes Number of minutes
 * @param chainId The chain ID
 * @returns Estimated number of blocks
 * @throws Error if the chain ID is not supported
 */
export function minutesToBlocks(minutes: number, chainId: ChainId): number {
  return Math.round(minutes * getBlockPerMinute(chainId))
}

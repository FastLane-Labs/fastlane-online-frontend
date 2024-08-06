import { ATLAS_GAS_SURCHARGE_PERCENTAGE } from '@/constants'
import { FeeData } from '@/types/fees'
import { AbstractProvider } from 'ethers'

export const getFeeData = async (provider: AbstractProvider): Promise<FeeData> => {
  const feeData: any = await provider.getFeeData()
  return {
    gasPrice: feeData.gasPrice ? BigInt(feeData.gasPrice.toString()) : undefined,
    maxFeePerGas: feeData.maxFeePerGas ? BigInt(feeData.maxFeePerGas.toString()) : undefined,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? BigInt(feeData.maxPriorityFeePerGas.toString()) : undefined,
  }
}

/**
 * Get the Atlas gas surcharge
 * @param gasCost The gas cost
 * @returns The Atlas gas surcharge
 */
export function getAtlasGasSurcharge(gasCost: bigint): bigint {
  return (gasCost * ATLAS_GAS_SURCHARGE_PERCENTAGE) / 100n
}

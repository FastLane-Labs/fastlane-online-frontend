import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { getFeeData } from '@/utils/gasFee'
import { ethers } from 'ethers'
import { keys } from '@/core/queries/query-keys'
import { useAccount } from 'wagmi'
import { SOLVER_GAS_ESTIMATE, SWAP_GAS_ESTIMATE } from '@/constants'
import { getAtlasGasSurcharge } from '@/utils/atlas'

type EstimatedFees = {
  swapFeeInWei: bigint
  solverFeeInWei: bigint
  atlasSurchargeInWei: bigint
  totalFeesInWei: bigint
}

const estimateFees = async (provider: ethers.AbstractProvider | null): Promise<EstimatedFees> => {
  if (!provider) {
    throw new Error('Provider not available')
  }

  const feeData = await getFeeData(provider)
  if (!feeData.maxFeePerGas) {
    throw new Error('Missing maxFeePerGas')
  }
  const maxFeePerGas = feeData.maxFeePerGas // Multiply by 2 convert to wei

  // Calculate fees in wei (TODO: simulate transaction to get actual gasLimit)
  const swapFee = SWAP_GAS_ESTIMATE * maxFeePerGas
  const solverFee = SOLVER_GAS_ESTIMATE * maxFeePerGas // fixed overhead for solver
  const totalGasBeforeSurcharge = swapFee + solverFee

  // Calculate Atlas surcharge (10% of total gas)
  const atlasSurcharge = getAtlasGasSurcharge(totalGasBeforeSurcharge)

  // Calculate total gas
  const totalGas = totalGasBeforeSurcharge + atlasSurcharge

  return {
    swapFeeInWei: swapFee,
    solverFeeInWei: solverFee,
    atlasSurchargeInWei: atlasSurcharge,
    totalFeesInWei: totalGas,
  }
}

export const useEstimatedSwapFees = (): UseQueryResult<EstimatedFees, Error> => {
  const { provider } = useEthersProviderContext()
  const { chainId } = useAccount()

  return useQuery<EstimatedFees, Error>({
    queryKey: keys({}).estimatedSwapFees(chainId),
    queryFn: () => estimateFees(provider),
    enabled: !!provider,
    refetchOnWindowFocus: true,
    refetchInterval: 20000,
    refetchIntervalInBackground: false,
  })
}

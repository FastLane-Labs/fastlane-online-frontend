import { useMemo } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { keys } from '@/core/queries/query-keys'
import { QuoteResult, Token } from '@/types'
import { Address } from 'viem'
import {
  buildSwapIntent,
  buildBaselineCallData,
  buildUserOperation,
  getUserOperationHash,
  getExecutionEnvironment,
} from '@/utils/atlas'
import { calculateDeadlineBlockNumber } from '@/utils/settings'
import { getFeeData } from '@/utils/gasFee'
import { getAtlasGasSurcharge } from '@/utils/atlas'

export const useSwapCallData = (
  address: string | undefined,
  fromToken: Token | null,
  toToken: Token | null,
  swapDirection: 'buy' | 'sell',
  debouncedAmount: string,
  quoteResult: QuoteResult | null | undefined,
  isSwapDataReady: boolean,
  provider: any,
  atlasAddress: string,
  dappAddress: string,
  atlasVerificationAddress: string,
  config: any,
  chainId: number | undefined
) => {
  const swapDataOptions: UseQueryOptions<any, Error> = useMemo(
    () => ({
      queryKey: [
        ...keys({ address }).all,
        'swapData',
        fromToken?.address,
        toToken?.address,
        swapDirection,
        debouncedAmount,
      ],
      queryFn: async (): Promise<any> => {
        if (
          !isSwapDataReady ||
          !quoteResult ||
          !provider ||
          !atlasAddress ||
          !dappAddress ||
          !atlasVerificationAddress
        ) {
          return null
        }

        console.log('generating swap data')
        const swapIntent = buildSwapIntent(quoteResult)

        const executionEnvironment = await getExecutionEnvironment(
          atlasAddress as Address,
          dappAddress as Address,
          dappAddress as Address,
          provider
        )

        const baselineCall = await buildBaselineCallData(quoteResult, executionEnvironment, config.slippage)

        const block = await provider.getBlock('latest')
        const feeData = await getFeeData(provider)
        if (!feeData.maxFeePerGas || !feeData.gasPrice) {
          throw new Error('Missing required fee data for swap')
        }

        const maxFeePerGas = feeData.maxFeePerGas * 2n
        const deadline = calculateDeadlineBlockNumber(config.deadline, block?.number ?? 0, chainId!)
        const gas = 2000000n // Example gas limit, adjust as needed

        const userOperation = await buildUserOperation(
          address!,
          swapIntent,
          baselineCall,
          deadline,
          gas,
          maxFeePerGas,
          dappAddress,
          provider
        )

        const userOpHash = await getUserOperationHash(userOperation, atlasVerificationAddress, provider)

        return {
          swapIntent,
          baselineCall,
          deadline,
          gas,
          maxFeePerGas,
          userOpHash,
          gasSurcharge: getAtlasGasSurcharge(gas * maxFeePerGas),
        }
      },
      enabled: isSwapDataReady && !!quoteResult,
      refetchOnWindowFocus: false,
      staleTime: 20000,
    }),
    [
      address,
      fromToken,
      toToken,
      swapDirection,
      debouncedAmount,
      isSwapDataReady,
      quoteResult,
      provider,
      atlasAddress,
      dappAddress,
      atlasVerificationAddress,
      config,
      chainId,
    ]
  )

  return useQuery<any, Error>(swapDataOptions)
}

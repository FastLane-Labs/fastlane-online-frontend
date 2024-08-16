import { useMemo } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { keys } from '@/core/queries/query-keys'
import { QuoteResult, SwapCallData, Token } from '@/types'
import { Address } from 'viem'
import { buildBaselineCallData, buildUserOperation, getExecutionEnvironment } from '@/core/atlas'
import { calculateDeadlineBlockNumber } from '@/utils/settings'
import { getAtlasGasSurcharge, getFeeData } from '@/utils/gasFee'
import { SOLVER_GAS_ESTIMATE, SWAP_GAS_ESTIMATE } from '@/constants'
import { BaseSwapService } from '@/services/baseSwap'

export const useSwapCallData = (
  address: string | undefined,
  fromToken: Token | null,
  toToken: Token | null,
  swapDirection: 'buy' | 'sell',
  debouncedAmount: string,
  quoteResult: QuoteResult | null | undefined,
  isReadyForCallDataGeneration: boolean,
  executionEnvironment: Address | null,
  provider: any,
  atlasAddress: string,
  dappAddress: string,
  atlasVerificationAddress: string,
  config: any,
  chainId: number | undefined
) => {
  const swapDataOptions: UseQueryOptions<SwapCallData, Error> = useMemo(
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
          !isReadyForCallDataGeneration ||
          !quoteResult ||
          !provider ||
          !atlasAddress ||
          !dappAddress ||
          !address ||
          !atlasVerificationAddress ||
          !executionEnvironment
        ) {
          return null
        }
        console.log('quoteResult', quoteResult)

        const swapIntent = BaseSwapService.getInstance().getSwapIntent(quoteResult, config.slippage)
        const { isFromNative } = quoteResult.swapRoute
        const baselineCall = await buildBaselineCallData(quoteResult, executionEnvironment, config.slippage)

        const block = await provider.getBlock('latest')
        const feeData = await getFeeData(provider)
        if (!feeData.maxFeePerGas || !feeData.gasPrice) {
          throw new Error('Missing required fee data for swap')
        }

        const maxFeePerGas = feeData.maxFeePerGas * 2n
        const deadline = calculateDeadlineBlockNumber(config.deadline, block?.number ?? 0, chainId!)
        const gas = SWAP_GAS_ESTIMATE + SOLVER_GAS_ESTIMATE

        const userOperation = await buildUserOperation(
          address,
          swapIntent,
          baselineCall,
          deadline,
          gas,
          maxFeePerGas,
          dappAddress,
          provider
        )

        if (isFromNative) {
          userOperation.setField('value', swapIntent.amountUserSells)
        }

        return {
          baselineCall,
          gasLimit: gas,
          userOperation,
          isSigned: false,
          gasSurcharge: getAtlasGasSurcharge(gas * maxFeePerGas),
        }
      },
      enabled: isReadyForCallDataGeneration && !!quoteResult,
      refetchOnWindowFocus: false,
    }),
    [
      address,
      fromToken,
      toToken,
      swapDirection,
      debouncedAmount,
      isReadyForCallDataGeneration,
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

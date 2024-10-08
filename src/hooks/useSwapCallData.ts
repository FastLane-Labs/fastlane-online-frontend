import { useMemo } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { keys } from '@/core/queries/query-keys'
import { QuoteResult, SwapCallData, Token } from '@/types'
import { Address } from 'viem'
import { buildBaselineCallData, buildUserOperation, getExecutionEnvironment } from '@/core/atlas'
import { calculateDeadlineBlockNumber } from '@/utils/settings'
import { getAtlasGasSurcharge, getFeeData } from '@/utils/gasFee'
import { SOLVER_GAS_ESTIMATE, SWAP_GAS_ESTIMATE, SwapType, WRAP_GAS_ESTIMATE } from '@/constants'
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
      queryFn: async (): Promise<SwapCallData | null> => {
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

        if (quoteResult.swapType === SwapType.WRAP || quoteResult.swapType === SwapType.UNWRAP) {
          return {
            type: 'wrap',
            baselineCall,
            minAmountOut: quoteResult.amountOut,
            gasLimit: WRAP_GAS_ESTIMATE,
            isSigned: false,
            gasSurcharge: 0n,
          }
        }

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
          type: 'swap',
          baselineCall,
          gasLimit: gas,
          userOperation,
          minAmountOut: swapIntent.minAmountUserBuys,
          isSigned: false,
          gasSurcharge: getAtlasGasSurcharge(gas * maxFeePerGas),
        }
      },
      enabled: isReadyForCallDataGeneration && !!quoteResult,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
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
      executionEnvironment,
    ]
  )

  return useQuery<SwapCallData | null, Error>(swapDataOptions)
}

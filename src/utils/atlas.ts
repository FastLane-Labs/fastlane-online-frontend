import { ethers } from 'ethers'
import { QuoteResult } from '../types'
import { atlasAbi, atlasVerificationAbi } from '@/abis'
import { BaseSwapService } from '@/services/baseSwap'
import { BaselineCall, SwapIntent, UserOperation } from '@/types/atlas'
import { getExchangeRouter } from '@/services/exchanges'

const baseSwapService = new BaseSwapService()

/**
 * Build the swap intent for an Atlas swap
 * @param quoteResult The quote result
 * @returns The swap intent
 */
export function buildSwapIntent(quoteResult: QuoteResult): SwapIntent {
  return {
    tokenUserBuys: quoteResult.swapRoute.swapSteps[0].tokenOut.address,
    minAmountUserBuys: quoteResult.amountOut,
    tokenUserSells: quoteResult.swapRoute.swapSteps[0].tokenIn.address,
    amountUserSells: quoteResult.amountIn,
  }
}

/**
 * Build the baseline call data for an Atlas swap
 * @param quoteResult The quote result
 * @returns The baseline call data
 */
export async function buildBaselineCallData(quoteResult: QuoteResult): Promise<BaselineCall> {
  const exchangeRouter = getExchangeRouter(quoteResult.swapRoute.chainId, quoteResult.swapRoute.exchange)
  const calldata = '0x' //await baseSwapService.getCalldataFromQuote(quoteResult)

  return {
    to: exchangeRouter,
    data: calldata,
    success: true,
  }
}

/**
 * Build a user operation for an Atlas swap
 * @param swapper The swapper address
 * @param swapIntent The swap intent
 * @param baselineCall The baseline call
 * @param deadline The deadline
 * @param gas The gas
 * @param maxFeePerGas The max fee per gas
 * @param atlasAddress The Atlas contract address
 * @param provider The provider
 * @returns The user operation
 */
export async function buildUserOperation(
  swapper: string,
  swapIntent: SwapIntent,
  baselineCall: BaselineCall,
  deadline: number,
  gas: bigint,
  maxFeePerGas: bigint,
  atlasAddress: string,
  provider: ethers.AbstractProvider
): Promise<UserOperation> {
  const atlas = new ethers.Contract(atlasAddress, atlasAbi, provider)

  const userOp = await atlas
    .getUserOperation(swapper, swapIntent, baselineCall, deadline, gas, maxFeePerGas)
    .catch((error) => {
      console.error('Error getting user operation:', error)
      throw error
    })

  // Convert the returned userOp to our UserOperation interface
  return {
    from: userOp.from,
    to: userOp.to,
    value: BigInt(userOp.value.toString()),
    gas: BigInt(userOp.gas.toString()),
    maxFeePerGas: BigInt(userOp.maxFeePerGas.toString()),
    nonce: BigInt(userOp.nonce.toString()),
    deadline: BigInt(userOp.deadline.toString()),
    dapp: userOp.dapp,
    control: userOp.control,
    callConfig: userOp.callConfig,
    sessionKey: userOp.sessionKey,
    data: userOp.data,
    signature: userOp.signature,
  } as UserOperation
}

/**
 * Get the user operation hash for an Atlas swap
 * @param userOp The user operation
 * @param atlasVerificationAddress The Atlas Verification contract address
 * @param provider The provider
 * @returns The user operation hash
 */
export async function getUserOperationHash(
  userOp: UserOperation,
  atlasVerificationAddress: string,
  provider: ethers.AbstractProvider
): Promise<string> {
  const atlasVerification = new ethers.Contract(atlasVerificationAddress, atlasVerificationAbi, provider)
  return atlasVerification.getUserOperationHash(userOp)
}

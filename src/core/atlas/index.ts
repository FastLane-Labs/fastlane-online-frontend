import { AbstractSigner, ethers, TypedDataDomain } from 'ethers'
import { QuoteResult } from '@/types'
import { FastlaneOnlineAbi, atlasAbi } from '@/abis'
import { BaseSwapService } from '@/services/baseSwap'
import { BaselineCall, SwapIntent } from '@/types/atlas'
import { getExchangeRouter } from '@/services/exchanges'
import { Address } from 'viem'
import { newUserOperation } from '@/core/operations/utils'
import { UserOperation } from '@/core/operations'

const baseSwapService = BaseSwapService.getInstance()

/**
 * Build the baseline call data for an Atlas swap
 * @param quoteResult The quote result
 * @returns The baseline call data
 */
export async function buildBaselineCallData(
  quoteResult: QuoteResult,
  recipient: Address,
  slippage: number
): Promise<BaselineCall> {
  const { chainId, exchange, isFromNative } = quoteResult.swapRoute
  const exchangeRouter = getExchangeRouter(chainId, exchange)
  const calldata = baseSwapService.getSwapCalldataFromQuoteResult(quoteResult, recipient, slippage)

  return {
    to: exchangeRouter,
    data: calldata,
    value: isFromNative ? quoteResult.amountIn : 0n, // If the user is swapping from ETH, no need to send ETH
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
 * @param fastlaneOnlineAddress The FastlaneOnline contract address
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
  fastlaneOnlineAddress: string,
  provider: ethers.AbstractProvider
): Promise<UserOperation> {
  const fastlaneOnline = new ethers.Contract(fastlaneOnlineAddress, FastlaneOnlineAbi, provider)

  const userOp = await fastlaneOnline
    .getUserOperation(swapper, swapIntent, baselineCall, deadline, gas, maxFeePerGas, baselineCall.value)
    .catch((error) => {
      console.error('Error getting user operation:', error)
      throw error
    })
  // Convert the returned userOp to our UserOperation interface
  return newUserOperation(userOp)
}

/**
 * Get the execution environment for an Atlas swap
 * @param atlasAddress The Atlas contract address
 * @param userAddress The user address
 * @param dAppControlAddress The dApp control address
 * @param provider The provider
 * @returns The execution environment address
 */
export async function getExecutionEnvironment(
  atlasAddress: Address,
  userAddress: Address,
  dAppControlAddress: Address,
  provider: ethers.AbstractProvider
): Promise<Address> {
  const atlas = new ethers.Contract(atlasAddress, atlasAbi, provider)

  const [executionEnvironment, ,] = await atlas
    .getExecutionEnvironment(userAddress, dAppControlAddress)
    .catch((error) => {
      console.error('Error getting execution environment:', error)
      throw error
    })

  return executionEnvironment as Address
}

/**
 * Prompt the user to sign their operation.
 * @param userOp a user operation
 * @param signer a signer
 * @returns the user operation with a valid signature field
 */
export async function signUserOperation(
  userOp: UserOperation,
  signer: AbstractSigner,
  eip712Domain: TypedDataDomain
): Promise<UserOperation> {
  userOp.setField(
    'signature',
    await signer.signTypedData(eip712Domain, userOp.toTypedDataTypes(), userOp.toTypedDataValues())
  )
  userOp.validateSignature(eip712Domain)
  return userOp
}

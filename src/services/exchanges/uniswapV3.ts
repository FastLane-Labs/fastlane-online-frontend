import { publicClient } from '../../../wagmi.config'
import { Exchange } from './base'
import { Token, SwapStep, SwapRoute, QuoteRequest, QuoteResult } from '@/types'
import { SwapType, CONTRACT_ADDRRESSES } from '@/constants'
import { QUOTERV2_ABI } from '@/constants/uniswap/v3/quoterV2'
import { Hex, ContractFunctionParameters, encodePacked } from 'viem'

const POOL_FEES = [500, 3000, 10000]

enum QuoteFunctionName {
  quoteExactInputSingle = 'quoteExactInputSingle',
  quoteExactInput = 'quoteExactInput',
  quoteExactOutputSingle = 'quoteExactOutputSingle',
  quoteExactOutput = 'quoteExactOutput',
}

export class UniswapV3 extends Exchange {
  /**
   * inherited and overriden from Exchange
   */
  public static buildSwapStepsFromTokens(from: Token, to: Token): SwapStep[] {
    let swapSteps: SwapStep[] = []

    for (const poolFee of POOL_FEES) {
      swapSteps.push({
        tokenIn: from,
        tokenOut: to,
        extra: {
          fee: poolFee,
        },
      })
    }

    return swapSteps
  }

  /**
   * inherited and overriden from Exchange
   */
  public static async getQuote(quoteRequest: QuoteRequest): Promise<QuoteResult | undefined> {
    try {
      const { result } = await publicClient.simulateContract(this.getQuoteContractCall(quoteRequest))
      return this.getFormattedQuoteResult(quoteRequest, result)
    } catch (error: any) {
      // Let the function return undefined in case of an error
    }
  }

  /**
   * inherited and overriden from Exchange
   */
  public static getFormattedQuoteResult(quoteRequest: QuoteRequest, result: any): QuoteResult {
    return {
      swapType: quoteRequest.swapType,
      amountIn: quoteRequest.swapType === SwapType.EXACT_IN ? quoteRequest.amount : BigInt(result[0]),
      amountOut: quoteRequest.swapType === SwapType.EXACT_OUT ? quoteRequest.amount : BigInt(result[0]),
      swapRoute: quoteRequest.swapRoute,
      validUntil: Date.now() + 20 * 1000, //20 seconds
    }
  }

  /**
   * inherited and overriden from Exchange
   */
  public static getQuoteContractCall(quoteRequest: QuoteRequest): ContractFunctionParameters {
    return {
      address: CONTRACT_ADDRRESSES[quoteRequest.swapRoute.chainId].UNISWAPV3.quoter,
      abi: QUOTERV2_ABI,
      functionName: this._getQuoteFunctionName(quoteRequest),
      args: this._getQuoteFunctionParameters(quoteRequest),
    }
  }

  /**
   * Get the contract quote function name based on the swap type and swap steps
   * @param quoteRequest The quote request
   * @returns The quote function name
   */
  protected static _getQuoteFunctionName(quoteRequest: QuoteRequest): QuoteFunctionName {
    switch (quoteRequest.swapType) {
      case SwapType.EXACT_IN:
        return quoteRequest.swapRoute.swapSteps.length === 1
          ? QuoteFunctionName.quoteExactInputSingle
          : QuoteFunctionName.quoteExactInput

      case SwapType.EXACT_OUT:
        return quoteRequest.swapRoute.swapSteps.length === 1
          ? QuoteFunctionName.quoteExactOutputSingle
          : QuoteFunctionName.quoteExactOutput
    }
  }

  /**
   * Get the contract quote function parameters based on the swap type and swap steps
   * @param quoteRequest The quote request
   * @returns The quote function parameters
   */
  protected static _getQuoteFunctionParameters(quoteRequest: QuoteRequest): any[] {
    switch (this._getQuoteFunctionName(quoteRequest)) {
      case QuoteFunctionName.quoteExactInputSingle:
        /*
          function quoteExactInputSingle(struct IQuoterV2.QuoteExactInputSingleParams params) public returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)
          struct IQuoterV2.QuoteExactInputSingleParams {
            address tokenIn;
            address tokenOut;
            uint256 amountIn;
            uint24 fee;
            uint160 sqrtPriceLimitX96;
          }
        */
        return [
          {
            tokenIn: quoteRequest.swapRoute.swapSteps[0].tokenIn.address,
            tokenOut: quoteRequest.swapRoute.swapSteps[0].tokenOut.address,
            amountIn: quoteRequest.amount,
            fee: quoteRequest.swapRoute.swapSteps[0].extra.fee,
            sqrtPriceLimitX96: 0,
          },
        ]

      case QuoteFunctionName.quoteExactInput:
        /*
          function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256 amountOut, uint160[] memory sqrtPriceX96AfterList, uint32[] memory initializedTicksCrossedList, uint256 gasEstimate)
        */
        return [this._computePath(quoteRequest.swapType, quoteRequest.swapRoute), quoteRequest.amount]

      case QuoteFunctionName.quoteExactOutputSingle:
        /*
        function quoteExactOutputSingle(struct IQuoterV2.QuoteExactOutputSingleParams params) public returns (uint256 amountIn, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)
        struct IQuoterV2.QuoteExactOutputSingleParams {
          address tokenIn;
          address tokenOut;
          uint256 amount;
          uint24 fee;
          uint160 sqrtPriceLimitX96;
        }
        */
        return [
          {
            tokenIn: quoteRequest.swapRoute.swapSteps[0].tokenIn.address,
            tokenOut: quoteRequest.swapRoute.swapSteps[0].tokenOut.address,
            amount: quoteRequest.amount,
            fee: quoteRequest.swapRoute.swapSteps[0].extra.fee,
            sqrtPriceLimitX96: 0,
          },
        ]

      case QuoteFunctionName.quoteExactOutput:
        /*
        function quoteExactOutput(bytes path, uint256 amountOut) external returns (uint256 amountIn, uint160[] memory sqrtPriceX96AfterList, uint32[] memory initializedTicksCrossedList, uint256 gasEstimate)
        */
        return [this._computePath(quoteRequest.swapType, quoteRequest.swapRoute), quoteRequest.amount]
    }
  }

  /**
   * Compute the path for the quoteExactInput and quoteExactOutput functions
   * @param swapType The swap type (EXACT_IN or EXACT_OUT)
   * @param route The swap route
   * @returns The path
   */
  protected static _computePath(swapType: SwapType, route: SwapRoute): Hex {
    if (!route.swapSteps.length) {
      return '0x'
    }

    let types = ['address', 'uint24', 'address']
    let values = [route.swapSteps[0].tokenIn.address, route.swapSteps[0].extra.fee, route.swapSteps[0].tokenOut.address]

    for (let i = 1; i < route.swapSteps.length; i++) {
      types.push('uint24', 'address')
      values.push(route.swapSteps[i].extra.fee, route.swapSteps[i].tokenOut.address)
    }

    // Invert the path for exact output
    if (swapType === SwapType.EXACT_OUT) {
      values = values.reverse()
    }

    return encodePacked(types, values)
  }
}

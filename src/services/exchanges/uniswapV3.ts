import { publicClient } from '../../../wagmi.config'
import { Exchange } from './base'
import { Token, SwapStep, SwapRoute, QuoteRequest, QuoteResult } from '@/types'
import { SwapType, CONTRACT_ADDRRESSES } from '@/constants'
import { QUOTERV2_ABI, SWAPROUTER02_ABI } from '@/constants/uniswap/v3'
import { Address, Hex, ContractFunctionParameters, encodeFunctionData, encodePacked } from 'viem'

const POOL_FEES = [500, 3000, 10000]

enum QuoteFunctionName {
  quoteExactInputSingle = 'quoteExactInputSingle',
  quoteExactInput = 'quoteExactInput',
  quoteExactOutputSingle = 'quoteExactOutputSingle',
  quoteExactOutput = 'quoteExactOutput',
}

enum SwapFunctionName {
  exactInputSingle = 'exactInputSingle',
  exactInput = 'exactInput',
  exactOutputSingle = 'exactOutputSingle',
  exactOutput = 'exactOutput',
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
   * inherited and overriden from Exchange
   */
  public static getSwapCalldataFromQuoteResult(quoteResult: QuoteResult, recipient: Address, slippage: number): Hex {
    return encodeFunctionData({
      abi: SWAPROUTER02_ABI,
      functionName: this._getSwapFunctionName(quoteResult),
      args: this._getSwapFunctionParameters(quoteResult, recipient, slippage),
    })
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
   * Get the contract swap function name based on the swap type and swap steps
   * @param quoteResult The quote result
   * @returns The swap function name
   */
  protected static _getSwapFunctionName(quoteResult: QuoteResult): SwapFunctionName {
    switch (quoteResult.swapType) {
      case SwapType.EXACT_IN:
        return quoteResult.swapRoute.swapSteps.length === 1
          ? SwapFunctionName.exactInputSingle
          : SwapFunctionName.exactInput

      case SwapType.EXACT_OUT:
        return quoteResult.swapRoute.swapSteps.length === 1
          ? SwapFunctionName.exactOutputSingle
          : SwapFunctionName.exactOutput
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
   * Get the contract swap function parameters based on the swap type and swap steps
   * @param quoteResult The quote result
   * @param slippage The allowed slippage in basis points
   * @returns The swap function parameters
   */
  protected static _getSwapFunctionParameters(quoteResult: QuoteResult, recipient: Address, slippage: number): any[] {
    switch (this._getSwapFunctionName(quoteResult)) {
      case SwapFunctionName.exactInputSingle:
        /*
          function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut)
          struct ExactInputSingleParams {
            address tokenIn;
            address tokenOut;
            uint24 fee;
            address recipient;
            uint256 amountIn;
            uint256 amountOutMinimum;
            uint160 sqrtPriceLimitX96;
          }
        */
        return [
          {
            tokenIn: quoteResult.swapRoute.swapSteps[0].tokenIn.address,
            tokenOut: quoteResult.swapRoute.swapSteps[0].tokenOut.address,
            fee: quoteResult.swapRoute.swapSteps[0].extra.fee,
            recipient: recipient,
            amountIn: quoteResult.amountIn,
            amountOutMinimum: this._amountWithSlippage(quoteResult.amountOut, slippage, false),
            sqrtPriceLimitX96: 0,
          },
        ]

      case SwapFunctionName.exactInput:
        /*
          function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut)
          struct ExactInputParams {
            bytes path;
            address recipient;
            uint256 amountIn;
            uint256 amountOutMinimum;
          }
        */
        return [
          {
            path: this._computePath(quoteResult.swapType, quoteResult.swapRoute),
            recipient: recipient,
            amountIn: quoteResult.amountIn,
            amountOutMinimum: this._amountWithSlippage(quoteResult.amountOut, slippage, false),
          },
        ]

      case SwapFunctionName.exactOutputSingle:
        /*
          function exactOutputSingle(ExactOutputSingleParams calldata params) external payable returns (uint256 amountIn)
          struct ExactOutputSingleParams {
            address tokenIn;
            address tokenOut;
            uint24 fee;
            address recipient;
            uint256 amountOut;
            uint256 amountInMaximum;
            uint160 sqrtPriceLimitX96;
          }
        */
        return [
          {
            tokenIn: quoteResult.swapRoute.swapSteps[0].tokenIn.address,
            tokenOut: quoteResult.swapRoute.swapSteps[0].tokenOut.address,
            fee: quoteResult.swapRoute.swapSteps[0].extra.fee,
            recipient: recipient,
            amountOut: quoteResult.amountOut,
            amountInMaximum: this._amountWithSlippage(quoteResult.amountIn, slippage, true),
            sqrtPriceLimitX96: 0,
          },
        ]

      case SwapFunctionName.exactOutput:
        /*
          function exactOutput(ExactOutputParams calldata params) external payable returns (uint256 amountIn)
          struct ExactOutputParams {
            bytes path;
            address recipient;
            uint256 amountOut;
            uint256 amountInMaximum;
          }
        */
        return [
          {
            path: this._computePath(quoteResult.swapType, quoteResult.swapRoute),
            recipient: recipient,
            amountOut: quoteResult.amountOut,
            amountInMaximum: this._amountWithSlippage(quoteResult.amountIn, slippage, true),
          },
        ]
    }
  }

  /**
   * Compute the path for the exactInput and exactOutput functions
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

  /**
   * Compute the slippage amount
   * @param amount The amount
   * @param slippage The slippage in basis points
   * @returns The slippage amount
   */
  protected static _amountWithSlippage(amount: bigint, slippage: number, positive: boolean): bigint {
    const _slippage = (amount * BigInt(slippage)) / BigInt(10000)
    return positive ? amount + _slippage : amount - _slippage
  }
}

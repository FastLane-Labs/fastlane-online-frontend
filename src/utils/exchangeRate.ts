import { Token } from '@/types'
import { FixedNumber, parseUnits } from 'ethers'

export const calculateExchangeRate = (
  fromToken: Token,
  toToken: Token,
  amountIn: string,
  amountOut: string
): string => {
  // Convert amounts to BigInt, considering token decimals
  const sourceAmountBigInt = parseUnits(amountIn, fromToken.decimals)
  const destAmountBigInt = parseUnits(amountOut, toToken.decimals)

  // Convert to FixedNumber for division
  const sourceTokenBN = FixedNumber.fromValue(sourceAmountBigInt, fromToken.decimals)
  const destinationTokenBN = FixedNumber.fromValue(destAmountBigInt, toToken.decimals)

  if (sourceTokenBN.isZero()) {
    return '0'
  }

  // Calculate rate
  return destinationTokenBN.divUnsafe(sourceTokenBN).toString()
}

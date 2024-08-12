import { FixedNumber } from 'ethers'
import { Token } from '@/types'
import { calculateExchangeRate } from './exchangeRate'

export const calculatePriceImpact = (exchangeRate: string, exchangeRateSmall: string): string => {
  const fixedExchangeRate = FixedNumber.fromString(exchangeRate)
  const fixedExchangeRateSmall = FixedNumber.fromString(exchangeRateSmall)

  // Handle case where small exchange rate is zero
  if (fixedExchangeRateSmall.isZero()) {
    return fixedExchangeRate.isZero() ? '0' : 'Infinity'
  }

  return fixedExchangeRateSmall
    .subUnsafe(fixedExchangeRate)
    .divUnsafe(fixedExchangeRateSmall)
    .mulUnsafe(FixedNumber.fromValue(100))
    .toString()
}

export const calculateQuotePriceImpact = (
  fromToken: Token,
  toToken: Token,
  regularAmountIn: string,
  regularAmountOut: string,
  smallAmountIn: string,
  smallAmountOut: string
): string => {
  const regularExchangeRate = calculateExchangeRate(fromToken, toToken, regularAmountIn, regularAmountOut)
  const smallExchangeRate = calculateExchangeRate(fromToken, toToken, smallAmountIn, smallAmountOut)

  return calculatePriceImpact(regularExchangeRate, smallExchangeRate)
}

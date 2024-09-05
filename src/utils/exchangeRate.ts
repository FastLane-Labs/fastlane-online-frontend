import { Token } from '@/types'
import { formatUnits, parseUnits } from 'ethers'

export const calculateExchangeRate = (
  fromToken: Token,
  toToken: Token,
  amountIn: string,
  amountOut: string
): string => {
  if (amountIn === '.' || amountOut === '.') {
    return '0'
  }

  const sourceAmount = parseUnits(amountIn, fromToken.decimals)
  const destAmount = parseUnits(amountOut, toToken.decimals)

  if (sourceAmount === 0n) {
    return '0'
  }

  const rate = (destAmount * parseUnits('1', 36)) / sourceAmount
  const scaledRate = (rate * parseUnits('1', fromToken.decimals)) / parseUnits('1', toToken.decimals)

  let formattedRate = formatUnits(scaledRate, 36)

  // Trim trailing zeros and unnecessary decimal point
  formattedRate = formattedRate.replace(/\.?0+$/, '')
  if (formattedRate.endsWith('.')) {
    formattedRate = formattedRate.slice(0, -1)
  }
  if (!formattedRate.includes('.')) {
    formattedRate += '.0'
  }

  // Ensure the result has the correct number of decimal places
  const parts = formattedRate.split('.')
  if (parts[1]) {
    parts[1] = parts[1].slice(0, fromToken.decimals)
    formattedRate = parts.join('.')
  }

  // Handle negative rates
  const isNegative = sourceAmount < 0n !== destAmount < 0n
  return isNegative ? '-' + formattedRate : formattedRate
}

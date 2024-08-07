import { ethers } from 'ethers'

export const truncateAddress = (address: string, length: number = 5): string => {
  if (address?.length > length * 2 + 1) {
    return `${address.substring(0, length)}...${address.substring(address.length - length, address.length)}`
  }

  return address
}

// Formats balance using ethers.formatUnits for display
export const formatBalance = (balance: bigint, decimals: number): string => {
  return ethers.formatUnits(balance, decimals)
}

// Formats balance using ethers.formatUnits and ensures a fixed number of decimal places
export const formatBalanceFixed = (balance: bigint, decimals: number, fixed: number = 5): string => {
  const formattedBalance = ethers.formatUnits(balance, decimals)
  return parseFloat(formattedBalance).toFixed(fixed)
}

// Formats decimal balance string to a fixed number of decimal places
export const formatBalanceToFixedDecimal = (balance: string, fixed: number = 5): string => {
  if (balance === '0' || balance === '0.0') {
    return '0'
  }
  return parseFloat(balance).toFixed(fixed)
}

export const toBigInt = (amount: string, decimals: number): bigint => {
  const [integer, fraction = ''] = amount.split('.')
  const fractionPadded = fraction.padEnd(decimals, '0')
  return BigInt(integer + fractionPadded)
}

/**
 * Adjusts the amount of tokens to swap based on the decimal difference between the from and to tokens
 * @param amount
 * @param fromDecimals
 * @param toDecimals
 * @returns
 */
export const adjustAmount = (amount: string, fromDecimals: number, toDecimals: number): string => {
  if (fromDecimals === toDecimals) {
    return amount // No adjustment needed if decimals match
  }

  // Split the amount into integer and fractional parts
  const [integerPart, fractionalPart] = amount.split('.')

  if (!fractionalPart) {
    return integerPart // Return as is if there's no fractional part
  }

  // Truncate the fractional part
  return integerPart
}

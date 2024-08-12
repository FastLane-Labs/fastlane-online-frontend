import { Token } from '@/types'
import { calculateExchangeRate } from './exchangeRate'

describe('calculateExchangeRate', () => {
  const tokenA: Token = {
    symbol: 'TOKENA',
    decimals: 18,
    chainId: 137,
    address: '0x0',
    name: 'TOKENA',
    logoURI: 'https://example.com/logo.png',
  }

  const tokenB: Token = {
    symbol: 'TOKENB',
    decimals: 8,
    chainId: 137,
    address: '0x0',
    name: 'TOKENB',
    logoURI: 'https://example.com/logo.png',
  }
  const tokenC: Token = {
    symbol: 'TOKENC',
    decimals: 6,
    chainId: 137,
    address: '0x0',
    name: 'TOKENC',
    logoURI: 'https://example.com/logo.png',
  }

  test('calculates rate and rounds to fromToken decimals (18)', () => {
    const result = calculateExchangeRate(tokenA, tokenB, '2000000', '1000000')
    expect(result).toBe('0.5')
  })

  test('calculates rate and rounds to fromToken decimals (18)', () => {
    const result = calculateExchangeRate(tokenA, tokenB, '1000000', '2000000')
    expect(result).toBe('2.0')
  })

  test('calculates rate and rounds to fromToken decimals (8)', () => {
    const result = calculateExchangeRate(tokenB, tokenA, '100000000', '1234567891234')
    expect(result).toBe('12345.67891234')
  })

  test('rounds up correctly', () => {
    const result = calculateExchangeRate(tokenB, tokenA, '100000000', '123456785000000000')
    expect(result).toBe('1234567850.0')
  })

  test('rounds down correctly', () => {
    const result = calculateExchangeRate(tokenB, tokenA, '100000000', '123456784000000000')
    expect(result).toBe('1234567840.0')
  })

  test('handles very small numbers with rounding', () => {
    const result = calculateExchangeRate(tokenA, tokenB, '1000000000000000000', '12')
    expect(result).toBe('0.000000000000000012')
  })

  test('handles very large numbers with rounding', () => {
    const result = calculateExchangeRate(tokenA, tokenB, '1', '100000000')
    expect(result).toBe('100000000.0')
  })

  test('rounds negative rates', () => {
    const result = calculateExchangeRate(tokenB, tokenA, '200000000', '100000000000000000')
    expect(result).toBe('500000000.0')
  })

  test('handles tokens with different decimals', () => {
    const result = calculateExchangeRate(tokenC, tokenA, '1000000', '2123456789123456789')
    expect(result).toBe('2123456789123.456789')
  })

  test('returns 0 when amountIn is 0', () => {
    const result = calculateExchangeRate(tokenA, tokenB, '0', '100000000')
    expect(result).toBe('0')
  })

  test('maintains precision for high decimal tokens', () => {
    const result = calculateExchangeRate(tokenA, tokenB, '1000000000000000000', '12345678')
    expect(result).toBe('0.000000000012345678')
  })

  test('limits precision for low decimal tokens', () => {
    const result = calculateExchangeRate(tokenC, tokenA, '1000000', '123456789123456000')
    expect(result).toBe('123456789123.456')
  })
})

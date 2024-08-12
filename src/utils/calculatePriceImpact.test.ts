import { Token } from '@/types'
import { calculatePriceImpact, calculateQuotePriceImpact } from './calculatePriceImpact'
import { calculateExchangeRate } from './exchangeRate'
import { ChainId } from '@/constants'

// Mock the calculateExchangeRate function
jest.mock('./exchangeRate', () => ({
  calculateExchangeRate: jest.fn(),
}))

describe('calculatePriceImpact', () => {
  it('should calculate positive price impact correctly', () => {
    const result = calculatePriceImpact('1.0', '1.05')
    expect(parseFloat(result)).toBeCloseTo(4.7619, 4)
  })

  it('should calculate negative price impact correctly', () => {
    const result = calculatePriceImpact('1.05', '1.0')
    expect(parseFloat(result)).toBeCloseTo(-5, 4)
  })

  it('should return zero for no price impact', () => {
    const result = calculatePriceImpact('1.0', '1.0')
    expect(parseFloat(result)).toBe(0)
  })

  it('should handle large numbers correctly', () => {
    const result = calculatePriceImpact('1000000', '1010000')
    expect(parseFloat(result)).toBeCloseTo(0.9901, 4)
  })

  it('should handle small numbers correctly', () => {
    const result = calculatePriceImpact('0.000001', '0.000000999')
    expect(parseFloat(result)).toBeCloseTo(-0.1001, 4)
  })

  it('should return "Infinity" when small exchange rate is zero and regular is non-zero', () => {
    const result = calculatePriceImpact('1.0', '0')
    expect(result).toBe('Infinity')
  })

  it('should return "0" when both exchange rates are zero', () => {
    const result = calculatePriceImpact('0', '0')
    expect(result).toBe('0')
  })
})

describe('calculateQuotePriceImpact', () => {
  const mockFromToken: Token = {
    address: '0x1',
    decimals: 18,
    symbol: 'TKN1',
    chainId: ChainId.POLYGON,
    name: 'TKN1',
    logoURI: 'https://example.com/tkn1.png',
  }
  const mockToToken: Token = {
    address: '0x2',
    decimals: 6,
    symbol: 'TKN2',
    chainId: ChainId.POLYGON,
    name: 'TKN2',
    logoURI: 'https://example.com/tkn2.png',
  }

  beforeEach(() => {
    ;(calculateExchangeRate as jest.Mock).mockClear()
  })

  it('should calculate price impact correctly', () => {
    ;(calculateExchangeRate as jest.Mock)
      .mockReturnValueOnce('1.0') // Regular exchange rate
      .mockReturnValueOnce('1.05') // Small exchange rate

    const result = calculateQuotePriceImpact(
      mockFromToken,
      mockToToken,
      '1000000000000000000', // 1 TKN1
      '1000000', // 1 TKN2
      '10000000000000000', // 0.01 TKN1
      '10500' // 0.0105 TKN2
    )

    expect(parseFloat(result)).toBeCloseTo(4.7619, 4)
    expect(calculateExchangeRate).toHaveBeenCalledTimes(2)
    expect(calculateExchangeRate).toHaveBeenCalledWith(mockFromToken, mockToToken, '1000000000000000000', '1000000')
    expect(calculateExchangeRate).toHaveBeenCalledWith(mockFromToken, mockToToken, '10000000000000000', '10500')
  })

  it('should handle zero exchange rates', () => {
    ;(calculateExchangeRate as jest.Mock).mockReturnValueOnce('0').mockReturnValueOnce('0')

    const result = calculateQuotePriceImpact(mockFromToken, mockToToken, '0', '0', '0', '0')

    expect(result).toBe('0')
  })

  it('should return "Infinity" when small exchange rate is zero and regular is non-zero', () => {
    ;(calculateExchangeRate as jest.Mock).mockReturnValueOnce('1.0').mockReturnValueOnce('0')

    const result = calculateQuotePriceImpact(mockFromToken, mockToToken, '1000000000000000000', '1000000', '0', '0')

    expect(result).toBe('Infinity')
  })

  it('should handle negative price impact', () => {
    ;(calculateExchangeRate as jest.Mock)
      .mockReturnValueOnce('1.05') // Regular exchange rate
      .mockReturnValueOnce('1.0') // Small exchange rate

    const result = calculateQuotePriceImpact(
      mockFromToken,
      mockToToken,
      '1000000000000000000', // 1 TKN1
      '1050000', // 1.05 TKN2
      '10000000000000000', // 0.01 TKN1
      '10000' // 0.01 TKN2
    )

    expect(parseFloat(result)).toBeCloseTo(-5, 4)
  })

  it('should handle equal exchange rates (no price impact)', () => {
    ;(calculateExchangeRate as jest.Mock)
      .mockReturnValueOnce('1.0') // Regular exchange rate
      .mockReturnValueOnce('1.0') // Small exchange rate

    const result = calculateQuotePriceImpact(
      mockFromToken,
      mockToToken,
      '1000000000000000000', // 1 TKN1
      '1000000', // 1 TKN2
      '10000000000000000', // 0.01 TKN1
      '10000' // 0.01 TKN2
    )

    expect(parseFloat(result)).toBe(0)
  })
})

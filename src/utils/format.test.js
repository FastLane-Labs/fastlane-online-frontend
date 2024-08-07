import { adjustAmount } from '@/utils/format'

describe('adjustAmount', () => {
  it('returns the same amount when decimals match', () => {
    expect(adjustAmount('100.5', 18, 18)).toBe('100.5')
  })

  it('returns the integer part when there is a fractional part', () => {
    expect(adjustAmount('100.5', 18, 6)).toBe('100')
  })

  it('returns the full amount when there is no fractional part', () => {
    expect(adjustAmount('100', 18, 6)).toBe('100')
  })

  it('handles zero correctly', () => {
    expect(adjustAmount('0', 18, 6)).toBe('0')
    expect(adjustAmount('0.0', 18, 6)).toBe('0')
  })

  it('handles large numbers correctly', () => {
    expect(adjustAmount('1000000.123456', 18, 6)).toBe('1000000')
  })
})

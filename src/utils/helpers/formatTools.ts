export function truncateAddress(address: string) {
  if (!address) return ''
  if (address.length <= 18) return address
  return `${address.slice(0, 9)}...${address.slice(-9)}`
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

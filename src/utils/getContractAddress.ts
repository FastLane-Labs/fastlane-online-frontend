export const getDappAddress = (chainId: number) => {
  switch (chainId) {
    case 137:
      return '0x0E3009d01e85ac49D164E453Ec81283EAAf46fB5'
    default:
      throw new Error('Unsupported chain ID')
  }
}

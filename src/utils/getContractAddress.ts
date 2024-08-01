export const getAtlasAddress = (chainId: number) => {
  switch (chainId) {
    case 137:
      return '0x892F8f6779ca6927c1A6Cc74319e03d2abEf18D5'
    default:
      throw new Error('Unsupported chain ID')
  }
}

export const getDappAddress = (chainId: number) => {
  switch (chainId) {
    case 137:
      return '0x0E3009d01e85ac49D164E453Ec81283EAAf46fB5'
    default:
      throw new Error('Unsupported chain ID')
  }
}

export const getAtlasVerificationAddress = (chainId: number) => {
  switch (chainId) {
    case 137:
      return '0xc05DDBe9745ce9DB45C32F5e4C1DA7a3c4FDa220'
    default:
      throw new Error('Unsupported chain ID')
  }
}

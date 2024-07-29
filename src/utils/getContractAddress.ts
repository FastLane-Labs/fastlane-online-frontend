export const getDappAddress = (chainId: number) => {
  switch (chainId) {
    case 1:
      return '0xMainetDappAddress'
    case 11155111:
      return '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008'
    case 137:
      return '0x0E3009d01e85ac49D164E453Ec81283EAAf46fB5'
    default:
      throw new Error('Unsupported chain ID')
  }
}

export const getControlAddress = (chainId: number) => {
  switch (chainId) {
    case 1:
      return '0xMainetDappAddress'
    case 11155111:
      return '0x954Ae509d43C414C1156bD159853D4e53aBE5774'
    case 137:
      return '0x0E3009d01e85ac49D164E453Ec81283EAAf46fB5'
    default:
      throw new Error('Unsupported chain ID')
  }
}

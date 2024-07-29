import { ierc20Abi } from '@/abis'
import { ethers } from 'ethers'

export const fetchErc20Allowance = async (
  provider: ethers.AbstractProvider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<bigint> => {
  const contract = new ethers.Contract(tokenAddress, ierc20Abi, provider)
  try {
    const allowance = await contract.allowance.staticCall(ownerAddress, spenderAddress)
    return BigInt(allowance.toString())
  } catch (error) {
    console.error('Error fetching allowance:', error)
    return 0n
  }
}

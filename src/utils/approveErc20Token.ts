import { ierc20Abi } from '@/abis'
import { ethers } from 'ethers'

export const approveErc20Token = async (
  signer: ethers.Signer,
  tokenAddress: string,
  spenderAddress: string,
  amount: bigint,
  infiniteApproval: boolean = true,
  overrides: ethers.Overrides = {}
): Promise<boolean> => {
  const contract = new ethers.Contract(tokenAddress, ierc20Abi, signer)
  const amountToApprove = infiniteApproval ? ethers.MaxUint256 : amount

  const approveTx = await contract.approve(spenderAddress, amountToApprove, overrides)

  await approveTx.wait()
  return true
}

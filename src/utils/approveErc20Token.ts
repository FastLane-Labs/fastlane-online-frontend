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
  try {
    console.log('Approving token', tokenAddress, 'for spender', spenderAddress, 'with amount', amount)
    const contract = new ethers.Contract(tokenAddress, ierc20Abi, signer)
    const amountToApprove = infiniteApproval ? ethers.MaxUint256 : amount

    const approveTx = await contract.approve(spenderAddress, amountToApprove, overrides)

    await approveTx.wait()

    return true
  } catch (error) {
    console.error('Approval Error:', error)
    return false
  }
}

import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { fetchErc20Allowance } from '@/utils/fetchErc20Allowance'
import { approveErc20Token } from '@/utils/approveErc20Token'
import { Token, TokenWithBalance } from '@/types'
import { nativeEvmTokenAddress } from '@/constants'
import { ethers } from 'ethers'
import { keys } from '@/core/queries/query-keys'
import { useAccount } from 'wagmi'
import { useNotifications } from '@/context/Notifications'
import { getBlockExplorerUrl } from '@/utils/getBlockExplorerUrl'
import { useErrorNotification } from './useErrorNotification'
import { useAppStore } from '@/store/useAppStore'

export const useAllowanceManager = () => {
  const { provider, signer } = useEthersProviderContext()
  const { address: userAddress, chainId } = useAccount()
  const [allowanceUpdateTrigger, setAllowanceUpdateTrigger] = useState(0)
  const { sendNotification } = useNotifications()
  const { handleProviderError } = useErrorNotification()
  const { config } = useAppStore()
  const queryClient = useQueryClient()

  const checkAllowance = useCallback(
    async (token: Token, userAddress: string, spenderAddress: string): Promise<bigint> => {
      if (!provider || !token || !userAddress || !spenderAddress) return 0n

      const queryKey = keys({ address: userAddress }).allowance(token.address, userAddress, spenderAddress)

      if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        return BigInt(ethers.MaxUint256.toString())
      }

      const allowance = await queryClient.fetchQuery({
        queryKey,
        queryFn: () => fetchErc20Allowance(provider, token.address, userAddress, spenderAddress),
        staleTime: 30000, // Consider data stale after 30 seconds
      })
      return allowance
    },
    [provider, queryClient]
  )

  const updateAllowance = useCallback(
    async (token: Token, spenderAddress: string, amount: bigint): Promise<boolean> => {
      if (!signer || !userAddress || token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase() || !chainId) {
        return false
      }

      try {
        // Start the approval process
        const infiniteApproval = config.tokenApproval === 'max'
        const tx = await approveErc20Token(signer, token.address, spenderAddress, amount, infiniteApproval)

        const baseUrl = getBlockExplorerUrl(chainId)

        // Send notification for pending approval
        sendNotification(`Approving ${token.symbol} for trading`, {
          type: 'info',
          href: `${baseUrl}tx/${tx.hash}`,
          transactionParams: {
            routeType: 'approval',
            fromToken: token,
            chainId: token.chainId,
            fromAmount: amount.toString(),
            txHash: tx.hash,
            status: 'pending',
            fromAddress: userAddress,
            boosted: false,
          },
        })

        // Wait for the transaction to be mined
        const receipt = await tx.wait()

        // Update the transaction status based on the receipt
        if (receipt?.status === 1) {
          // Send notification for successful approval
          sendNotification(`Approval for ${token.symbol} Successful`, {
            type: 'success',
            href: `${baseUrl}tx/${tx.hash}`,
            transactionHash: tx.hash,
            transactionStatus: 'confirmed',
          })

          // Invalidate the query to trigger a refetch
          await queryClient.invalidateQueries({
            queryKey: keys({ address: userAddress }).allowance(token.address, userAddress, spenderAddress),
          })

          // Trigger a re-check
          setAllowanceUpdateTrigger((prev) => prev + 1)

          return true
        } else {
          // Send notification for failed approval
          sendNotification(`Approval for ${token.symbol} Failed`, {
            type: 'error',
            href: `${baseUrl}tx/${tx.hash}`,
            transactionHash: tx.hash,
            transactionStatus: 'failed',
          })
          return false
        }
      } catch (error: any) {
        // For other errors, proceed with existing error handling
        if (error.transaction?.hash) {
          sendNotification(`Approval for ${token.symbol} Failed`, {
            type: 'error',
            transactionHash: error.transaction.hash,
            transactionStatus: 'failed',
          })
        } else {
          handleProviderError(error)
        }
        return false
      }
    },
    [signer, queryClient, userAddress, chainId, sendNotification, handleProviderError, config]
  )

  const isSufficientAllowance = useCallback(
    async (token: Token, userAddress: string, spenderAddress: string, requiredAmount: bigint): Promise<boolean> => {
      if (token.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()) {
        return true
      }

      const allowance = await checkAllowance(token, userAddress, spenderAddress)
      return allowance >= requiredAmount
    },
    [checkAllowance]
  )

  return {
    checkAllowance,
    updateAllowance,
    isSufficientAllowance,
    allowanceUpdateTrigger,
  }
}

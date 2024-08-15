import { useCallback } from 'react'
import { useNotifications } from '@/context/Notifications'

export const useErrorNotification = () => {
  const { sendNotification } = useNotifications()

  const handleError = useCallback(
    (error: any) => {
      let notificationMessage = error?.message || 'An error occurred'
      let notificationType: 'error' | 'warning' = 'error'

      // Check for specific error codes
      switch (error.code) {
        case 4001: // UserRejectedRequest
          notificationMessage = `Transaction cancelled: User denied signature`
          notificationType = 'warning'
          break
        case 4100: // Unauthorized
          notificationMessage = `Unauthorized: Please check your wallet connection`
          break
        case 4200: // UnsupportedMethod
          notificationMessage = `Unsupported method: This action is not supported`
          break
        case 4900: // Disconnected
        case 4901: // ChainDisconnected
          notificationMessage = `Disconnected: Please reconnect your wallet`
          break
        default:
          // Handle other specific errors
          if (error.message?.toLowerCase().includes('approve failed')) {
            notificationMessage = `Approval failed: ${error.message}`
          } else if (error.message?.toLowerCase().includes('sign failed')) {
            notificationMessage = `Signature failed: ${error.message}`
          } else if (error.message?.toLowerCase().includes('swap failed')) {
            notificationMessage = `Swap failed: ${error.message}`
          }
      }

      // Send notification
      sendNotification(notificationMessage, {
        type: notificationType,
      })

      // Log error for debugging
      console.error('Error occurred:', error)
    },
    [sendNotification]
  )

  return {
    handleError,
    sendNotification,
  }
}

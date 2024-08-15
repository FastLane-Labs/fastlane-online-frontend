import { useCallback } from 'react'
import { ErrorCode } from 'ethers'
import { useNotifications } from '@/context/Notifications'

export const useErrorNotification = () => {
  const { sendNotification } = useNotifications()

  const handleProviderError = useCallback(
    (error: any) => {
      let notificationMessage = error?.message || 'An error occurred'
      let notificationType: 'error' | 'warning' = 'error'
      let skipNotification = false
      // Check for specific error codes
      switch (error.code) {
        case 'ACTION_REJECTED' as ErrorCode:
          notificationMessage = `Transaction cancelled: User denied signature`
          notificationType = 'warning'
          skipNotification = true
          break
        default:
          // Handle other specific errors
          notificationMessage = `Unknown error code: ${error.code}`
          break
      }

      // Send notification if not skipped
      if (!skipNotification) {
        sendNotification(notificationMessage, {
          type: notificationType,
        })
      }

      // Log error for debugging
      console.error('Error occurred:', error.code, error.message)
    },
    [sendNotification]
  )

  return {
    handleProviderError,
  }
}

import { useEffect, useMemo } from 'react'
import { useNotifications } from '@/context/Notifications'

export const useErrorNotification = (error: any | null) => {
  const { sendNotification } = useNotifications()

  // List of errors we want to create notifications for
  const validErrorList = useMemo(() => {
    return [
      { type: 'approve', message: 'approve failed' },
      { type: 'sign', message: 'sign failed' },
      { type: 'swap', message: 'swap failed' },
      // Add more error types as needed
    ]
  }, [])

  useEffect(() => {
    if (error) {
      const errorMessage = error.message.toLowerCase()

      // Check if error is one we want to create a notification for
      const matchedError = validErrorList.find((validError) => errorMessage.includes(validError.message.toLowerCase()))

      if (matchedError) {
        let notificationMessage = error.message
        let notificationType: 'error' | 'warning' = 'error'

        // Customize notification based on error type
        switch (matchedError.type) {
          case 'approve':
            notificationMessage = `Approval for failed: ${error.message}`
            break
          case 'sign':
            notificationMessage = `Signature failed: ${error.message}`
            break
          case 'swap':
            notificationMessage = `Swap failed: ${error.message}`
            break
          // Add more cases as needed
        }

        // Check for user rejection
        if (error.code === 4001 && errorMessage.includes('user denied transaction signature')) {
          notificationMessage = `Transaction cancelled: User denied signature`
          notificationType = 'warning'
        }

        // Send notification
        sendNotification(notificationMessage, {
          type: notificationType,
        })

        // Log error for debugging
        console.error('Error occurred:', error)
      }
    }
  }, [error, sendNotification, validErrorList])

  return {
    sendNotification,
  }
}

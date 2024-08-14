import { useEffect } from 'react'
import { useNotificationStore } from '@/store/useAppStore'
import { AppNotification } from '@/types'

export const useErrorNotification = (error: Error | null) => {
  const { addNotification } = useNotificationStore()

  // List of errors we want to create notifications for
  const validErrorList = [
    'approve failed', // token approval failed
    'sign failed', // user operation signing failed
    'swap failed', // tx swap failed
  ]

  useEffect(() => {
    if (error) {
      const errorMessage = error.message.toLowerCase()
      // check if error is one we want to create a notification for
      const isValidError = validErrorList.some((validError) => errorMessage.includes(validError.toLowerCase()))

      if (isValidError) {
        // create notification
        console.log(error.message)
        // const notification: AppNotification = {
        //   type: 'error',
        //   message: error.message,
        //   timestamp: Date.now(),
        // }
        // addNotification(notification)
      }
    }
  }, [error, addNotification])
}

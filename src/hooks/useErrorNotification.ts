import { useEffect } from 'react'
import { useNotifications } from '@/context/Notifications'

export const useErrorNotification = (error: Error | null) => {
  const { Add } = useNotifications()

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
        Add(error.message, { type: 'error' })
      }
    }
  }, [error])
}

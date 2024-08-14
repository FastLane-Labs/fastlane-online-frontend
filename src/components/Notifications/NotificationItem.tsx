import { AppNotification } from '@/types'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

interface NotificationItemProps {
  notification: AppNotification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className='h-6 w-6 text-success' />
      case 'error':
        return <XCircleIcon className='h-6 w-6 text-error' />
      case 'warning':
        return <InformationCircleIcon className='h-6 w-6 text-warning' />
      case 'info':
      default:
        return <InformationCircleIcon className='h-6 w-6 text-info' />
    }
  }

  return (
    <div className='flex items-center space-x-3 p-2 bg-base-200 rounded-lg'>
      <div className='flex-shrink-0'>{getIcon()}</div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-base-content'>{notification.message}</p>
        {notification.from && <p className='text-xs text-base-content/70'>From: {notification.from}</p>}
      </div>
      <div className='flex-shrink-0 text-sm text-base-content/50'>
        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

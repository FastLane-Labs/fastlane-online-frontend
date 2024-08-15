export interface State<T> {
  loading: boolean
  data?: T
  error?: string
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  type: NotificationType
  message: string
  timestamp: number
  from?: string
  href?: string
}

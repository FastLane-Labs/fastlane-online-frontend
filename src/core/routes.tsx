import React from 'react'
import SwapView from '@/views/SwapView'
import { useAppRouter } from '@/hooks/useAppRouter'
import { SwapStateProvider } from '@/context/SwapStateContext'

// Define the route types
export type Routes = 'swap'

// Define the structure for each route
export interface AppRoute {
  id: Routes
  path: string
  title: string
  headerButtons?: ('back' | 'settings' | 'history')[]
}

// Define the routes
export const routes: Record<Routes, AppRoute> = {
  swap: {
    id: 'swap',
    path: '/',
    title: 'Swap',
    headerButtons: ['settings', 'history'],
  },
}

// Define the AppRoutes component
export const AppRoutes: React.FC = () => {
  const { currentRoute } = useAppRouter()

  const allRoutes = [
    {
      id: 'swap',
      path: routes.swap.path,
      element: (
        <SwapStateProvider>
          <SwapView />
        </SwapStateProvider>
      ),
    },
  ]

  return allRoutes.find((r) => r.id === currentRoute.id)?.element ?? <span />
}

// Main App component
export const FastlaneApp: React.FC = () => {
  return (
    <div id='fastlane-widget' style={{ width: '100%', minHeight: '400px' }}>
      <div className='fastlane-container'>
        <AppRoutes />
      </div>
    </div>
  )
}

// Export the main component
export default FastlaneApp

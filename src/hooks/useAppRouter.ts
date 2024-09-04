import { useMemo, useCallback } from 'react'
import type { Routes, AppRoute } from '../core/routes'
import { useAppRouterStore, useAppStore } from '@/store/useAppStore'
import { useAnalytics } from '@/context/AnalyticsContext'

export const useAppRouter = () => {
  const { config } = useAppStore()
  const { history } = useAppRouterStore()
  const { trackEvent } = useAnalytics()

  const switchRoute = useCallback(
    (route: AppRoute, params?: { [key: string]: any | undefined }, addRouteToHistory = true) => {
      const currentHistory = useAppRouterStore.getState().history
      if (addRouteToHistory) {
        useAppRouterStore.setState({
          history: [...currentHistory, { route, params }],
        })
      } else {
        useAppRouterStore.setState({
          history: [...currentHistory.slice(0, -1), { route, params }],
        })
      }

      // Track the navigation event
      trackEvent(
        {
          type: 'FUNNEL',
          step: 'internal_navigation',
          details: route.id,
        },
        {
          params: JSON.stringify(params),
          addedToHistory: addRouteToHistory,
        }
      )
    },
    [trackEvent]
  )

  const previousRoute = useCallback(() => {
    const currentHistory = useAppRouterStore.getState().history
    if (currentHistory.length > 1) {
      const newHistory = currentHistory.slice(0, -1)
      useAppRouterStore.setState({
        history: newHistory,
      })

      // Track the navigation event
      const previousRoute = newHistory[newHistory.length - 1].route
      trackEvent(
        {
          type: 'FUNNEL',
          step: 'internal_navigation',
          details: previousRoute.id,
        },
        {
          action: 'back',
        }
      )
    }
  }, [trackEvent])

  const currentRoute = history[history.length - 1].route
  const currentRouteParams = history[history.length - 1].params

  const configRouteTitleSet = useMemo(() => {
    if (config.titles !== undefined) {
      return config.titles?.[currentRoute.id as Routes] ?? undefined
    }
    return undefined
  }, [config.titles, currentRoute])

  const currentRouteTitle = useMemo(
    () => configRouteTitleSet ?? currentRoute?.title ?? 'Atlas',
    [currentRoute?.title, configRouteTitleSet]
  )

  return {
    currentRoute,
    currentRouteTitle,
    switchRoute,
    previousRoute,
    currentRouteParams,
  }
}

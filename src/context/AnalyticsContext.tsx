'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AnalyticsEvent } from '@/types/analytics'
import ReactGA from 'react-ga4'
import { parseUrl } from 'query-string'

export type AnalyticsContextType = {
  trackPageView: (path: string) => void
  trackEvent: (event: AnalyticsEvent, additionalData?: Record<string, any>) => void
}

const defaultAnalyticsContext: AnalyticsContextType = {
  trackPageView: () => {},
  trackEvent: () => {},
}

export const AnalyticsContext = createContext<AnalyticsContextType>(defaultAnalyticsContext)

const MEASUREMENT_ID = 'G-7LHEG7ZQZX' // Replace with your actual Measurement ID

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    ReactGA.initialize(MEASUREMENT_ID)
    setIsInitialized(true)
  }, [])

  const trackEvent = useCallback(
    (event: AnalyticsEvent, additionalData: Record<string, any> = {}) => {
      if (!isInitialized) {
        console.warn('Google Analytics not initialized yet')
        return
      }

      let eventName = ''
      let eventParams: Record<string, any> = {}

      switch (event.type) {
        case 'VISITOR_UNIQUE':
          eventName = 'unique_visit'
          break
        case 'VISITOR_CONNECTED_WALLET':
          eventName = 'wallet_connected'
          eventParams = { wallet_address: event.walletAddress }
          break
        case 'QUOTE_SHOWN':
          eventName = 'quote_shown'
          eventParams = { ...event.quoteEvent }
          break
        case 'SWAP_ATTEMPTED':
          eventName = 'swap_attempted'
          eventParams = { ...event.swapEvent }
          break
        case 'SWAP_COMPLETED':
          eventName = 'swap_completed'
          eventParams = { ...event.swapEvent }
          break
        case 'SWAP_FAILED':
          eventName = 'swap_failed'
          eventParams = { ...event.swapEvent }
          break
        case 'SIGNATURE_FAILED':
          eventName = 'signature_failed'
          eventParams = { reason: additionalData.reason || 'Unknown reason' }
          break
        case 'SWAP_BOOSTED':
          eventName = 'swap_boosted'
          eventParams = { ...event.swapEvent, boosted_amount: event.boostedAmount }
          break
        case 'GEOBLOCKED':
          eventName = 'geoblocked'
          eventParams = { country: event.country }
          break
        default:
          console.warn('Unknown event type:', event)
          return
      }

      // Merge additional data
      eventParams = { ...eventParams, ...additionalData }

      // Send the event to Google Analytics
      ReactGA.event(eventName, eventParams)

      // Mark certain events as key events
      if (['swap_completed', 'swap_boosted', 'wallet_connected'].includes(eventName)) {
        ReactGA.gtag('set', 'user_properties', { key_event: true })
      }
    },
    [isInitialized]
  )

  const trackPageView = useCallback(
    (path: string) => {
      if (isInitialized) {
        const url = parseUrl(window.location.href)
        const utmParams = {
          utm_source: url.query.utm_source,
          utm_medium: url.query.utm_medium,
          utm_campaign: url.query.utm_campaign,
        }
        const referrer = document.referrer

        ReactGA.send({
          hitType: 'pageview',
          page: path,
          ...utmParams,
          referrer,
        })

        // Track funnel step
        trackEvent(
          {
            type: 'FUNNEL',
            step: 'page_view',
            details: path,
          },
          {
            ...utmParams,
            referrer,
          }
        )
      }
    },
    [isInitialized, trackEvent]
  )

  return <AnalyticsContext.Provider value={{ trackPageView, trackEvent }}>{children}</AnalyticsContext.Provider>
}

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext)
  return context
}

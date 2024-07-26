import '@rainbow-me/rainbowkit/styles.css'
import type { Metadata, Viewport } from 'next'
import { Fragment, PropsWithChildren } from 'react'
import { SITE_DESCRIPTION, SITE_EMOJI, SITE_INFO, SITE_NAME, SITE_URL } from '@/utils/siteInfo'
import { Layout } from '@/components/Layout'
import ClientWeb3Provider from '../context/ClientWeb3Provider'
import { NotificationProvider } from '@/context/Notifications'
import '../assets/globals.css'
import React from 'react'
import GeoBlock from '@/components/GeoBlock/GeoBlock'

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} · ${SITE_INFO}`,
    template: `${SITE_NAME} · %s`,
  },
  metadataBase: new URL(SITE_URL),
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    title: SITE_NAME,
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: '/opengraph-image',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout(props: PropsWithChildren) {
  let isRestricted: boolean = true
  let country: string = 'US'
  return (
    <html lang='en'>
      <head>
        <link
          rel='icon'
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${SITE_EMOJI}</text></svg>`}
        />
      </head>
      <body>
        {isRestricted ? (
          <GeoBlock country={country} />
        ) : (
          <ClientWeb3Provider>
            <NotificationProvider>
              <AppRouter>
                <Layout>{props.children}</Layout>
              </AppRouter>
            </NotificationProvider>
          </ClientWeb3Provider>
        )}
      </body>
    </html>
  )
}

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const Router = Fragment
  return <Router>{children}</Router>
}

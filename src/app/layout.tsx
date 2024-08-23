import '@rainbow-me/rainbowkit/styles.css'
import type { Viewport } from 'next'
import { Fragment, PropsWithChildren } from 'react'
import { Layout } from '@/components/Layout'
import ClientWeb3Provider from '../context/ClientWeb3Provider'
import { NotificationProvider } from '@/context/Notifications'
import '../assets/globals.css'
import React from 'react'
import GeoBlock from '@/components/GeoBlock/GeoBlock'
import { AppStateProvider } from '@/context/AppStateContext'
import { TokenPriceProvider } from '@/context/TokenPriceProvider'

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: '#F12379',
}

export default function RootLayout(props: PropsWithChildren) {
  let isRestricted: boolean = false
  let country: string = 'US'

  return (
    <html lang='en' className='bg-[#0f0f0f]'>
      <head>
        <title>Rocketboost</title>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='Rocketboost Swaps are powered by the DRFQ Atlas module built by FastLane Labs, which hosts a fully onchain request-for-quote auction for your swaps. Atlas is a generalized execution abstraction protocol for the EVM used for building intent and MEV auctions.'
        />
        <meta name='keywords' content='Atlas, Swap, DRFQ, MEV, Polygon, FastLane Labs' />
        <meta name='author' content='FastLane Labs' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@atlasevm' />
        <meta name='twitter:title' content='Rocketboost' />
        <meta
          name='twitter:description'
          content='Rocketboost Swaps are powered by the DRFQ Atlas module built by FastLane Labs.'
        />
        <meta name='twitter:image' content='https://rocketboost.me/og/rb-beta.png' />
        <meta property='og:title' content='Rocketboost' />
        <meta
          property='og:description'
          content='Rocketboost Swaps are powered by the DRFQ Atlas module built by FastLane Labs.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://rocketboost.me' />
        <meta property='og:image' content='https://rocketboost.me/og/rb-beta.png' />
        <meta property='og:image:alt' content='Rocketboost beta' />
        <meta property='og:site_name' content='Rocketboost' />
        <meta property='og:locale' content='en_US' />
        <link rel='apple-touch-icon' sizes='180x180' href='favicons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='favicons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='favicons/favicon-16x16.png' />
        <link rel='manifest' href='favicons/site.webmanifest' />
        <link rel='mask-icon' href='favicons/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#F12379' />
      </head>
      <body>
        {isRestricted ? (
          <GeoBlock country={country} />
        ) : (
          <ClientWeb3Provider>
            <TokenPriceProvider>
              <NotificationProvider>
                <AppStateProvider>
                  <AppRouter>
                    <Layout>{props.children}</Layout>
                  </AppRouter>
                </AppStateProvider>
              </NotificationProvider>
            </TokenPriceProvider>
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

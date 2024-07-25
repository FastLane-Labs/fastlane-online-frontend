'use client'
import { getDefaultConfig as rainbowGetDefaultConfig } from '@rainbow-me/rainbowkit'
import { cookieStorage, createStorage } from 'wagmi'
import { SITE_INFO, SITE_NAME, SITE_URL } from './siteInfo'
import { ETH_CHAINS } from './network'

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'temp'
if (!WALLETCONNECT_PROJECT_ID) {
  console.warn('You need to provide a NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable')
}

export const WALLETCONNECT_CONFIG = rainbowGetDefaultConfig({
  appName: SITE_NAME,
  appDescription: SITE_INFO,
  appUrl: SITE_URL,
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: ETH_CHAINS,
  ssr: true, // If your dApp uses server-side rendering (SSR)
  storage: createStorage({
    storage: cookieStorage,
  }),
})

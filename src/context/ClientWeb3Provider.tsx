'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WALLETCONNECT_CONFIG } from '@/utils/web3'
import { EthersProviderWrapper } from '@/context/EthersProviderContext'
import myCustomTheme from '@/components/Theme/RainbowkitTheme'

const queryClient = new QueryClient()

const ClientWeb3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={WALLETCONNECT_CONFIG}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize='compact' theme={myCustomTheme}>
          <EthersProviderWrapper>{children}</EthersProviderWrapper>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ClientWeb3Provider

'use client'
import React, { createContext, useContext, useMemo, ReactNode, useEffect } from 'react'
import { JsonRpcProvider, FallbackProvider, Signer } from 'ethers'
import { useEthersProvider } from '@/hooks/helper/useEthersProvider'
import { useEthersSigner } from '@/hooks/helper/useEthersSigner'
import { useAccount } from 'wagmi'
import { useAnalytics } from '@/context/AnalyticsContext'

interface EthersContextValue {
  provider: JsonRpcProvider | FallbackProvider | null
  signer: Signer | null
}

const EthersProviderContext = createContext<EthersContextValue | undefined>(undefined)

export const EthersProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ethersProvider = useEthersProvider()
  const signer = useEthersSigner()
  const { address, isConnected } = useAccount()
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    if (isConnected && address) {
      trackEvent({
        type: 'VISITOR_CONNECTED_WALLET',
        walletAddress: address,
      })
    }
  }, [isConnected, address, trackEvent])

  const value = useMemo(() => {
    return { provider: ethersProvider || null, signer: signer || null }
  }, [ethersProvider, signer])

  return <EthersProviderContext.Provider value={value}>{children}</EthersProviderContext.Provider>
}

export const useEthersProviderContext = (): EthersContextValue => {
  const context = useContext(EthersProviderContext)
  if (context === undefined) {
    throw new Error('useEthersProviderContext must be used within an EthersProviderWrapper')
  }
  return context
}

'use client'
import React, { createContext, useContext, useMemo, ReactNode } from 'react'
import { JsonRpcProvider, FallbackProvider } from 'ethers'
import { useChainId } from 'wagmi'
import { useEthersProvider } from '@/hooks/useEthersProvider'

const EthersProviderContext = createContext<JsonRpcProvider | FallbackProvider | undefined>(undefined)

export const EthersProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const chainId = useChainId()
  const ethersProvider = useEthersProvider({ chainId })
  const value = useMemo(() => ethersProvider, [ethersProvider])

  return <EthersProviderContext.Provider value={value}>{children}</EthersProviderContext.Provider>
}

export const useEthersProviderContext = (): JsonRpcProvider | FallbackProvider => {
  const context = useContext(EthersProviderContext)
  if (!context) {
    throw new Error('useEthersProviderContext must be used within an EthersProviderWrapper')
  }
  return context
}

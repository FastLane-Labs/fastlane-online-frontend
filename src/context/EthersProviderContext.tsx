'use client'
import React, { createContext, useContext, useMemo, ReactNode } from 'react'
import { JsonRpcProvider, FallbackProvider } from 'ethers'
import { useChainId } from 'wagmi'
import { useEthersProvider } from '@/hooks/useEthersProvider'

export type EthersProviderType = JsonRpcProvider | FallbackProvider | undefined

interface EthersProviderContextType {
  ethersProvider: EthersProviderType
}

const EthersProviderContext = createContext<EthersProviderContextType | null>(null)

export const EthersProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const chainId = useChainId()
  const ethersProvider = useEthersProvider({ chainId })
  const value = useMemo(() => ({ ethersProvider }), [ethersProvider])

  return <EthersProviderContext.Provider value={value}>{children}</EthersProviderContext.Provider>
}

export const useEthersProviderContext = () => {
  const context = useContext(EthersProviderContext)
  if (!context) {
    throw new Error('useEthersProviderContext must be used within an EthersProviderWrapper')
  }
  return context
}

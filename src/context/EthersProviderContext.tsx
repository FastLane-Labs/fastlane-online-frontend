'use client'
import React, { createContext, useContext, useMemo, ReactNode } from 'react'
import { JsonRpcProvider, FallbackProvider, Signer } from 'ethers'
import { useChainId } from 'wagmi'
import { useEthersProvider } from '@/hooks/helper/useEthersProvider'
import { useEthersSigner } from '@/hooks/helper/useEthersSigner'

interface EthersContextValue {
  provider: JsonRpcProvider | FallbackProvider
  signer: Signer
}

const EthersProviderContext = createContext<EthersContextValue | undefined>(undefined)

export const EthersProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const chainId = useChainId()
  const ethersProvider = useEthersProvider({ chainId })
  const signer = useEthersSigner({ chainId })

  const value = useMemo(() => {
    if (ethersProvider && signer) {
      return { provider: ethersProvider, signer }
    }
    return undefined
  }, [ethersProvider, signer])

  if (!value) {
    return null // Or you can render a loading spinner or a fallback UI
  }

  return <EthersProviderContext.Provider value={value}>{children}</EthersProviderContext.Provider>
}

export const useEthersProviderContext = (): EthersContextValue => {
  const context = useContext(EthersProviderContext)
  if (!context) {
    throw new Error('useEthersProviderContext must be used within an EthersProviderWrapper')
  }
  return context
}

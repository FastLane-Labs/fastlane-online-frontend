import { createContext, useContext, useMemo, ReactNode } from 'react'
import { JsonRpcProvider, FallbackProvider } from 'ethers'
import { useEthersProvider } from '@/hooks/useEthersProvider'

type EthersProviderType = JsonRpcProvider | FallbackProvider | undefined

interface EthersProviderContextType {
  ethersProvider: EthersProviderType
}

const EthersProviderContext = createContext<EthersProviderContextType | null>(null)

export const EthersProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ethersProvider = useEthersProvider()
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

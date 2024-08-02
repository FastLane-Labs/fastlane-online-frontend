import React, { createContext, useContext } from 'react'
import { SwapState, useSwapState } from '@/hooks/useSwapState'

const SwapStateContext = createContext<SwapState | null>(null)

export const SwapStateProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const swapState = useSwapState()

  return <SwapStateContext.Provider value={swapState}>{children}</SwapStateContext.Provider>
}

export const useSwapStateContext = () => {
  const context = useContext(SwapStateContext)
  if (!context) {
    throw new Error('useSwapContext must be used within a SwapProvider')
  }
  return context
}

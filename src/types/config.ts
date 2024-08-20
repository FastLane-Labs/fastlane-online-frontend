import { Routes } from '@/core/routes'
import { Token } from './token'
export interface AppConfig {
  slippage: number
  deadline: number
  priceImpactWarnings: {
    warning: number
    critical: number
  }
  titles?: Record<Routes, string> // Header titles
  favTokens?: Token[]
  defaultTokens?: Token[]
  tokenApproval: 'exact' | 'max' // Add this line
}

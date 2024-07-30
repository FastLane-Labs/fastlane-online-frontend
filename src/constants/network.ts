import { polygon } from 'viem/chains'
import { Chain } from 'viem/chains'

export const SUPPORTED_CHAINS = [polygon] as [Chain, ...Chain[]]

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

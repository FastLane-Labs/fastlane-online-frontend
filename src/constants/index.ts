import { AppConfigState } from '@/store/useAppStore'
import { Address } from 'viem'
export * from './network'

export enum ChainId {
  POLYGON = 137,
}

export enum Exchange {
  UNISWAPV3 = 'UNISWAPV3',
}

export enum SwapType {
  EXACT_IN = 'EXACT_IN',
  EXACT_OUT = 'EXACT_OUT',
}

interface ExchangeAddresses {
  quoter: Address
  factory: Address
  router: Address
}

type IContractAddresses = {
  [chainId in ChainId]: {
    [exchange in Exchange]: ExchangeAddresses
  }
}

export const CONTRACT_ADDRRESSES: IContractAddresses = {
  [ChainId.POLYGON]: {
    [Exchange.UNISWAPV3]: {
      quoter: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e', // QuoterV2
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // UniswapV3Factory
      router: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', // SwapRouter02
    },
  },
}

type ITokenAddresses = {
  [chainId in ChainId]: {
    wrappedNative: Address
    bestGateway: Address
  }
}

export const TOKEN_ADDRESSES: ITokenAddresses = {
  [ChainId.POLYGON]: {
    wrappedNative: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    bestGateway: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
  },
}

export const nativeEvmTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const defaultValues: AppConfigState = {
  config: {
    slippage: 50, // 0.5%
    deadline: 10, // 10 minutes
    titles: {
      swap: 'Swap',
    },
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
  },
}

export const ATLAS_GAS_SURCHARGE_PERCENTAGE = 10n
// Constants for gas estimates for swap and solver
export const SWAP_GAS_ESTIMATE = 350_000n
export const SOLVER_GAS_ESTIMATE = 1_500_000n

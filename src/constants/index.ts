import { AppConfigState } from '@/store/useAppStore'

export const nativeEvmTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const defaultValues: AppConfigState = {
  config: {
    slippage: 0.5,
    titles: {
      swap: 'Swap',
    },
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
  },
}

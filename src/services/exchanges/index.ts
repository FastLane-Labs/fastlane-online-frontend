import { ChainId, CONTRACT_ADDRRESSES, Exchange as ExchangeName } from '@/constants'
import { Exchange } from './base'
import { UniswapV3 } from './uniswapV3'
import { Address } from 'viem'

/**
 * Get an exchange class from the exchange name
 * @param exchange The exchange name
 * @returns The exchange class
 */
export function getExchange(exchange: ExchangeName): typeof Exchange {
  switch (exchange) {
    case ExchangeName.UNISWAPV3:
      return UniswapV3

    default:
      throw new Error('Exchange not supported')
  }
}

/**
 * Get the router address for an exchange
 * @param chainId The chain ID
 * @param exchange The exchange name
 * @returns The router address
 */
export function getExchangeRouter(chainId: ChainId, exchange: ExchangeName): Address {
  const chainAddresses = CONTRACT_ADDRRESSES[chainId]
  if (!chainAddresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  const exchangeAddresses = chainAddresses[exchange]
  if (!exchangeAddresses) {
    throw new Error(`Unsupported exchange: ${exchange}`)
  }

  const routerAddress = exchangeAddresses.router
  if (!routerAddress) {
    throw new Error(`Router address not found for exchange: ${exchange}`)
  }

  return routerAddress
}

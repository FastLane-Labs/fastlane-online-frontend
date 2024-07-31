import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useAccount, useConnectorClient } from 'wagmi'

function clientToSigner(client: Client<Transport, Chain, Account> | undefined): JsonRpcSigner | undefined {
  if (!client) return undefined

  const { account, chain, transport } = client
  if (!chain || !account) return undefined

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  return new JsonRpcSigner(provider, account.address)
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner(): JsonRpcSigner | undefined {
  const { chainId } = useAccount()
  const { data: client } = useConnectorClient<Config>({
    chainId,
  })

  return useMemo(() => clientToSigner(client), [client])
}

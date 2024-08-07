import React, { useState, useEffect, useCallback } from 'react'
import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import { useCurrentTokenList } from '@/hooks/useTokenList'
import { useAccount } from 'wagmi'
import { Token } from '@/types'
import { useBalances } from '@/hooks/useBalances'
import { useSwapStateContext } from '@/context/SwapStateContext'
import TokenItem from '@/components/TokenItem/TokenItem'
import TokenGrid from '@/components/TokenGrid/TokenGrid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import UnknownToken from '@/assets/svg/unknownToken.svg'
import { shortFormat, adjustAmount } from '@/utils/format'

interface TokenSelectModalProps {
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
  direction: 'buy' | 'sell'
  defaultLabel: string
}

type TokenWithBalance = Token & { balance: bigint; formattedBalance: string }

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  selectedToken,
  onSelectToken,
  direction,
  defaultLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { tokens, loading, error } = useCurrentTokenList()
  const [searchTerm, setSearchTerm] = useState('')
  const { address } = useAccount()
  const { fromToken, toToken, fromAmount, toAmount, setFromAmount, setToAmount } = useSwapStateContext()

  const balancesQuery = useBalances({
    tokens: tokens,
    userAddress: address as string,
  })

  const [hasAttemptedRefetch, setHasAttemptedRefetch] = useState(false)

  const getFormattedBalance = useCallback(
    (balance: bigint, token: Token) => shortFormat(balance, token.decimals, 4),
    []
  )

  const tokensWithBalances: TokenWithBalance[] = tokens.map((token, index) => ({
    ...token,
    balance: balancesQuery.data && balancesQuery.data.length > 0 ? balancesQuery.data[index] : 0n,
    formattedBalance:
      balancesQuery.data && balancesQuery.data.length > 0 ? getFormattedBalance(balancesQuery.data[index], token) : '0',
  }))

  const filteredTokensWithBalances = tokensWithBalances.filter((token) => {
    if (direction === 'sell' && toToken && token.address.toLowerCase() === toToken.address.toLowerCase()) {
      return false
    }
    if (direction === 'buy' && fromToken && token.address.toLowerCase() === fromToken.address.toLowerCase()) {
      return false
    }
    return (
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const sortedTokensWithBalances = filteredTokensWithBalances.sort((a, b) => Number(b.balance) - Number(a.balance))

  const popularTokens = tokensWithBalances.filter((token) => token.tags?.includes('popular'))
  const tokensWithUserBalances = sortedTokensWithBalances.filter((token) => token.balance > 0n)
  const remainingTokens = sortedTokensWithBalances.filter((token) => token.balance === 0n)

  useEffect(() => {
    if ((balancesQuery.error || balancesQuery.data === undefined) && !hasAttemptedRefetch) {
      balancesQuery.refetch({ cancelRefetch: true })
      setHasAttemptedRefetch(true) // Mark refetch attempt
    }
  }, [balancesQuery, balancesQuery.error, balancesQuery.data, hasAttemptedRefetch])

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
    }
  }, [isOpen])

  const handleSelect = (token: Token) => {
    if (direction === 'sell') {
      if (fromToken && fromAmount && fromAmount !== '') {
        const adjustedAmount = adjustAmount(fromAmount, fromToken.decimals, token.decimals)
        setFromAmount(adjustedAmount)
      }
    } else if (direction === 'buy') {
      if (toToken && toAmount && toAmount !== '') {
        const adjustedAmount = adjustAmount(toAmount, toToken.decimals, token.decimals)
        setToAmount(adjustedAmount)
      }
    }
    onSelectToken(token)
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <button
        className='h-[48px] hover:bg-secondary-content text-neutral-content p-2 rounded-xl focus:outline-none appearance-none flex items-center text-nowrap w-max'
        onClick={() => setIsOpen(true)}>
        {selectedToken ? (
          <>
            {selectedToken.logoURI ? (
              <img src={selectedToken.logoURI} alt={selectedToken.symbol} className='w-6 h-6 mr-2 rounded-full' />
            ) : (
              <UnknownToken className='w-6 h-6 mr-2 rounded-full' />
            )}
            <span>{selectedToken.symbol}</span>
          </>
        ) : (
          <span>{defaultLabel}</span>
        )}
        <svg
          className='w-4 h-4 fill-current text-neutral-content ml-2'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'>
          <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
        </svg>
      </button>
      <ModalWrapper
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        style={{ maxHeight: '90vh', minHeight: '90vh', paddingBottom: '0px' }}>
        <div className='h-fit'>
          <h2 className='text-2xl font-bold my-4 text-center'>Select a token</h2>
          <div className='relative w-full mb-4'>
            <input
              type='text'
              placeholder='Search tokens'
              className='bg-neutral w-full p-2 pl-10 rounded-xl focus:outline-none appearance-none'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
          </div>
          {loading && <div className='text-center'>Loading tokens...</div>}
          {error && <div className='text-center text-red-500'>Error loading tokens: {error.message}</div>}
          {!loading && !error && (
            <>
              <TokenGrid tokens={popularTokens} selectedToken={selectedToken!} handleSelect={handleSelect} />
              <div className='line-seperator mt-4' />
            </>
          )}
        </div>
        {!loading && !error && (
          <div className='scroll-bar flex flex-shrink flex-col overflow-y-scroll -mr-3 h-full'>
            <div className='h-full pr-2'>
              {tokensWithUserBalances.length > 0 && <h3 className='font-medium py-4 gray-text'>Your Tokens</h3>}
              <ul className='space-y-2'>
                {tokensWithUserBalances.map((token) => (
                  <TokenItem
                    key={token.address}
                    token={token}
                    selectedToken={selectedToken!}
                    handleSelect={handleSelect}
                  />
                ))}
              </ul>
              <h3 className='font-medium py-4 gray-text'>All Tokens</h3>
              <ul className='space-y-2'>
                {remainingTokens
                  .filter((token) => token.address !== selectedToken?.address)
                  .map((token) => (
                    <TokenItem
                      key={token.address}
                      token={token}
                      selectedToken={selectedToken!}
                      handleSelect={handleSelect}
                    />
                  ))}
              </ul>
            </div>
          </div>
        )}
      </ModalWrapper>
    </div>
  )
}

export default TokenSelectModal

import React, { useState } from 'react'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import tokenList from '@/constants/tokenList.json'
import ModalWrapper from '../Wrappers/ModalWrapper'

interface TokenSelectProps {
  value: string
  onChange: (tokenSymbol: string) => void
  address: `0x${string}`
  defaultLabel: string
}

const TokenSelect: React.FC<TokenSelectProps> = ({ value, onChange, address, defaultLabel }) => {
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)

  const handleSelect = (tokenSymbol: string) => {
    onChange(tokenSymbol)
    setIsDropdownActive(false)
  }

  return (
    <div className='relative'>
      <button
        className='h-[48px] hover:bg-base-100 text-neutral-content p-2 rounded-xl focus:outline-none appearance-none flex items-center text-nowrap w-max'
        onClick={() => setIsDropdownActive(true)}>
        {value && (
          <img
            src={tokenList.tokens.find((token) => token.symbol === value)?.logoURI}
            alt={value}
            className='w-6 h-6 mr-2 rounded-full'
          />
        )}
        <span>{value || defaultLabel}</span>
        <svg
          className='w-4 h-4 fill-current text-neutral-content ml-2'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'>
          <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
        </svg>
      </button>
      <ModalWrapper isVisible={isDropdownActive} onClose={() => setIsDropdownActive(false)}>
        <div>
          <div className='label text-lg font-bold mb-4'>Select a token</div>
          <ul className='space-y-2'>
            {tokenList.tokens.map((token) => (
              <li
                key={token.address}
                className='flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded-xl'
                onClick={() => handleSelect(token.symbol)}>
                <img src={token.logoURI} alt={token.symbol} className='w-6 h-6 mr-2 rounded-full' />
                <div className='flex flex-col'>
                  <span>{token.symbol}</span>
                  <span className='text-gray-500 text-sm'>{token.name}</span>
                </div>
                <span className='ml-auto'>
                  <TokenBalance address={address} tokenAddress={token.address as `0x${string}`} toFixed={2} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </ModalWrapper>
    </div>
  )
}

export default TokenSelect

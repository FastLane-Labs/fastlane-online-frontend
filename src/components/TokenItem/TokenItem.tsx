import React from 'react'
import { Token, TokenWithBalance } from '@/types'
import UnknownToken from 'src/assets/svg/unknownToken.svg'
import { formatBalanceToFixedDecimal } from '@/utils/format'

interface TokenItemProps {
  token: Token | TokenWithBalance
  selectedToken?: Token | TokenWithBalance
  handleSelect: (token: Token | TokenWithBalance) => void
  isLoading?: boolean
}

const TokenItem: React.FC<TokenItemProps> = ({ token, selectedToken, handleSelect, isLoading }) => (
  <li
    className={`flex items-center py-2 px-4 cursor-pointer hover:bg-base-100 rounded-xl font-medium ${
      token.address.toLowerCase() === selectedToken?.address?.toLowerCase() ? 'bg-primary text-white' : ''
    }`}
    onClick={() => handleSelect(token)}>
    {token.logoURI ? (
      <img src={token.logoURI} alt={token.symbol} className='w-8 h-8 mr-2 rounded-full' />
    ) : (
      <UnknownToken className='w-8 h-8 mr-2 rounded-full' />
    )}
    <div className='flex flex-col font-normal'>
      <span>{token.symbol}</span>
      <span
        className={`text-sm 
      ${token.address.toLowerCase() === selectedToken?.address?.toLowerCase() ? 'text-zinc-300' : 'text-zinc-600'}`}>
        {token.name}
      </span>
    </div>
    <span className='ml-auto'>
      {isLoading ? (
        <span className='loading loading-spinner'></span>
      ) : (token as TokenWithBalance).balance ? (
        <span className='tooltip tooltip-left	' data-tip={(token as TokenWithBalance).balance}>
          {formatBalanceToFixedDecimal((token as TokenWithBalance).balance)}
        </span>
      ) : (
        '0'
      )}
    </span>
  </li>
)

export default TokenItem

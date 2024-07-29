import React from 'react'
import { Token, TokenWithBalance } from '@/types'
import UnknownToken from 'src/assets/svg/unknownToken.svg'
import { formatBalanceToFixedDecimal } from '@/utils/format'

interface TokenItemProps {
  token: Token | TokenWithBalance
  selectedToken?: Token | TokenWithBalance
  handleSelect: (token: Token | TokenWithBalance) => void
}

const TokenItem: React.FC<TokenItemProps> = ({ token, selectedToken, handleSelect }) => (
  <li
    className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded-xl ${
      token.address.toLowerCase() === selectedToken?.address?.toLowerCase() ? 'bg-gray-600' : ''
    }`}
    onClick={() => handleSelect(token)}>
    {token.logoURI ? (
      <img src={token.logoURI} alt={token.symbol} className='w-6 h-6 mr-2 rounded-full' />
    ) : (
      <UnknownToken className='w-6 h-6 mr-2 rounded-full' />
    )}
    <div className='flex flex-col'>
      <span>{token.symbol}</span>
      <span className='text-gray-500 text-sm'>{token.name}</span>
    </div>
    <span className='ml-auto'>
      {(token as TokenWithBalance).balance ? formatBalanceToFixedDecimal((token as TokenWithBalance).balance) : '0'}
    </span>
  </li>
)

export default TokenItem

import React from 'react'
import { Token } from '@/types'
import UnknownToken from 'src/assets/svg/unknownToken.svg'

interface TokenGridProps {
  tokens: Token[]
  selectedToken?: Token
  handleSelect: (token: Token) => void
}

const TokenGrid: React.FC<TokenGridProps> = ({ tokens, selectedToken, handleSelect }) => (
  <div className='grid grid-cols-3 gap-2'>
    {tokens.map((token) => (
      <div
        key={token.address}
        className={`flex items-center justify-center p-2 cursor-pointer hover:bg-[#2e3038] border-zinc-800 border rounded-xl font-medium ${
          token.address.toLowerCase() === selectedToken?.address?.toLowerCase() ? 'bg-primary' : ''
        }`}
        onClick={() => handleSelect(token)}>
        {token.logoURI ? (
          <img src={token.logoURI} alt={token.symbol} className='w-6 h-6 mr-2 rounded-full' />
        ) : (
          <UnknownToken className='w-6 h-6 mr-2 rounded-full' />
        )}
        <span>{token.symbol}</span>
      </div>
    ))}
  </div>
)

export default TokenGrid

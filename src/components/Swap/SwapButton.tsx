import React, { useState } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

interface SwapButtonProps {
  isConnected: boolean
  sellAmount: string
  buyToken: string
  handleSwap: () => Promise<void>
  isLoading: boolean
}

const SwapButton: React.FC<SwapButtonProps> = ({ isConnected, sellAmount, buyToken, handleSwap, isLoading }) => {
  const { openConnectModal } = useConnectModal()
  const [localLoading, setLocalLoading] = useState(false)

  const handleClick = async () => {
    setLocalLoading(true)
    await handleSwap()
    setLocalLoading(false)
  }

  if (!isConnected) {
    return (
      <button className='btn rounded-2xl w-full' onClick={() => openConnectModal?.()}>
        Connect wallet
      </button>
    )
  } else if (!sellAmount) {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        Enter an amount
      </button>
    )
  } else if (!buyToken) {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        Select a token
      </button>
    )
  } else {
    return (
      <button className='btn rounded-2xl w-full' onClick={handleClick} disabled={isLoading || localLoading}>
        {localLoading ? (
          <>
            <span className='loading loading-spinner'></span>Initiating swap
          </>
        ) : (
          'Swap'
        )}
      </button>
    )
  }
}

export default SwapButton

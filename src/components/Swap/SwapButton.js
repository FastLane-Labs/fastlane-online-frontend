import React, { useState } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const SwapButton = ({ isConnected, sellAmount, buyToken, handleSwap, isLoading }) => {
  const { openConnectModal } = useConnectModal()
  const [localLoading, setLocalLoading] = useState(false)

  const handleClick = async () => {
    setLocalLoading(true)
    await handleSwap()
    setLocalLoading(false)
  }

  if (!isConnected) {
    return (
      <button className='btn bg-secondary rounded-2xl w-full text-white' onClick={() => openConnectModal()}>
        Connect wallet
      </button>
    )
  } else if (!sellAmount) {
    return (
      <button className='btn bg-secondary rounded-2xl w-full text-white' disabled>
        Enter an amount
      </button>
    )
  } else if (!buyToken) {
    return (
      <button className='btn bg-secondary rounded-2xl w-full text-white' disabled>
        Select a token
      </button>
    )
  } else {
    return (
      <button
        className='btn bg-secondary rounded-2xl w-full text-white'
        onClick={handleClick}
        disabled={isLoading || localLoading}>
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

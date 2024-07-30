import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import { useState } from 'react'
import { useSwapContext } from '@/context/SwapContext'
import UnknownToken from '@/assets/svg/unknownToken.svg'
import { Token } from '@/types'

interface SwapModalProps {
  isVisible: boolean
  onClose: () => void
  onSwap: () => Promise<boolean>
  onApprove: () => Promise<boolean>
}

const SwapModal: React.FC<SwapModalProps> = ({ isVisible, onClose, onSwap, onApprove }) => {
  const { fromToken, toToken, fromAmount, toAmount, sufficientAllowance } = useSwapContext()
  const [isApproving, setIsApproving] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapSuccess, setSwapSuccess] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await onApprove()
    } catch (error) {
      console.error('Approval Error:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleSwap = async () => {
    setIsSwapping(true)
    try {
      const success = await onSwap()
      setSwapSuccess(success)
    } catch (error) {
      console.error('Swap Error:', error)
    } finally {
      setIsSwapping(false)
    }
  }

  const renderButton = () => {
    if (!sufficientAllowance) {
      return (
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className='w-full bg-pink-500 text-white py-3 rounded-xl font-semibold text-sm disabled:bg-gray-500 hover:bg-pink-600 transition-colors'>
          {isApproving ? (
            <span className='flex items-center justify-center'>
              <svg className='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              Approving...
            </span>
          ) : (
            `Approve ${fromToken?.symbol} for spending`
          )}
        </button>
      )
    } else {
      return (
        <button
          onClick={handleSwap}
          disabled={isSwapping}
          className='w-full bg-pink-500 text-white py-3 rounded-xl font-semibold text-sm disabled:bg-gray-500 hover:bg-pink-600 transition-colors'>
          {isSwapping ? 'Swapping...' : 'Confirm swap'}
        </button>
      )
    }
  }

  const renderTokenInfo = (token: Token | null | undefined, amount: string) => (
    <div className='flex items-center'>
      {token && token.logoURI ? (
        <img src={token.logoURI} alt={token.symbol} className='w-6 h-6 mr-2 rounded-full' />
      ) : (
        <UnknownToken className='w-6 h-6 mr-2 rounded-full' />
      )}
      <span className='font-semibold'>{amount}</span>
      <span className='ml-1'>{token?.symbol || 'Unknown'}</span>
    </div>
  )

  const renderSwapDetails = () => (
    <div className='flex flex-col items-center mb-4'>
      {renderTokenInfo(fromToken, fromAmount)}
      <svg className='w-6 h-6 my-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
      </svg>
      {renderTokenInfo(toToken, toAmount)}
    </div>
  )

  const renderContent = () => {
    if (swapSuccess) {
      return (
        <>
          <div className='text-center mb-4'>
            <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h2 className='text-lg font-semibold'>Swap success!</h2>
          </div>
          {renderSwapDetails()}
          <button
            onClick={onClose}
            className='w-full bg-purple-500 text-white py-2 rounded-xl font-semibold text-sm hover:bg-purple-600 transition-colors'>
            View on Explorer
          </button>
        </>
      )
    } else if (isSwapping) {
      return (
        <>
          <div className='text-center mb-4'>
            <div className='w-16 h-16 rounded-full border-4 border-gray-300 border-t-pink-500 animate-spin mx-auto mb-4'></div>
            <h2 className='text-lg font-semibold'>Confirm swap</h2>
          </div>
          {renderSwapDetails()}
          <p className='text-center text-sm text-gray-400'>Proceed in your wallet</p>
        </>
      )
    } else if (!sufficientAllowance && !isApproving) {
      return (
        <>
          <h2 className='text-lg font-semibold mb-4 text-center'>Approve Token</h2>
          <div className='flex flex-col items-center mb-4'>{renderTokenInfo(fromToken, fromAmount)}</div>
          {renderButton()}
        </>
      )
    } else {
      return (
        <>
          <h2 className='text-lg font-semibold mb-4 text-center'>Confirm Swap</h2>
          {renderSwapDetails()}
          <p className='text-sm text-center mb-4'>
            Swap {fromAmount} {fromToken?.symbol} for {toAmount} {toToken?.symbol}
          </p>
          {renderButton()}
        </>
      )
    }
  }

  return (
    <ModalWrapper isVisible={isVisible} onClose={onClose}>
      <div className='bg-base-200 text-neutral-content p-4 rounded-xl h-auto flex flex-col justify-between'>
        {renderContent()}
      </div>
    </ModalWrapper>
  )
}

export default SwapModal

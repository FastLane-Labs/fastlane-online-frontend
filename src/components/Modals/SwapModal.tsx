import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import { useState } from 'react'
import { useSwapContext } from '@/context/SwapContext'
import UnknownToken from '@/assets/svg/unknownToken.svg'
import { Token } from '@/types'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

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
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

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
        <button onClick={handleApprove} disabled={isApproving} className='btn'>
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
        <button onClick={handleSwap} disabled={isSwapping} className='btn'>
          {isSwapping ? 'Swapping...' : 'Confirm swap'}
        </button>
      )
    }
  }

  const renderTokenInfo = (token: Token | null | undefined, amount: string, label: string) => {
    return (
      <>
        <div className='items-end justify-between flex w-full gap-3'>
          <div className='flex-col justify-start flex gap-1'>
            <h3 className='text-neutral-400 text-sm'>{label}</h3>
            <p className='text-4xl'>
              {amount.slice(0, 7)} {token?.symbol}
            </p>
          </div>
          <div className='relative flex'>
            <div className='items-center relative flex mb-1'>
              <div className='flex'>
                {token && token.logoURI ? (
                  <img src={token.logoURI} alt={token.symbol} className='rounded-full w-9 h-9' />
                ) : (
                  <UnknownToken className='rounded-full w-9 h-9' />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderTokenInfoCompact = (token: Token | null | undefined, amount: string) => {
    return (
      <>
        <div className='items-end justify-center flex w-fit gap-1.5'>
          <div className='relative flex'>
            <div className='items-center relative flex mb-1'>
              <div className='flex'>
                {token && token.logoURI ? (
                  <img src={token.logoURI} alt={token.symbol} className='rounded-full w-4 h-4' />
                ) : (
                  <UnknownToken className='rounded-full w-4 h-4' />
                )}
              </div>
            </div>
          </div>
          <div className='flex-col justify-start flex gap-1'>
            <p className='sm'>
              {amount.slice(0, 7)} {token?.symbol}
            </p>
          </div>
        </div>
      </>
    )
  }

  const renderSwapDetails = () => (
    <div className='flex flex-col w-full items-center mb-4 pt-3 gap-6'>
      {renderTokenInfo(fromToken, fromAmount, 'Sell')}
      {renderTokenInfo(toToken, toAmount, 'Buy')}
    </div>
  )

  const renderSwapDetailsCompact = () => (
    <div className='flex items-center justify-center gap-4 mb-4 w-full'>
      {renderTokenInfoCompact(fromToken, fromAmount)}
      <ArrowRightIcon className='h-8 w-8 text-neutral-content' />
      {renderTokenInfoCompact(toToken, toAmount)}
    </div>
  )

  const renderContent = () => {
    if (swapSuccess) {
      return (
        <>
          <div className='flex flex-grow flex-col w-full h-full justify-center items-center'>
            <div className='text-center mb-2'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h2 className='text-lg font-semibold'>Swap success!</h2>
            </div>
            {renderSwapDetailsCompact()}
          </div>

          <button onClick={onClose} className='btn btn-explorer'>
            View on Explorer
          </button>
        </>
      )
    } else if (isSwapping) {
      return (
        <>
          <div className='flex flex-grow flex-col w-full h-full justify-center items-center'>
            <div className='text-center mb-2'>
              <div className='w-16 h-16 rounded-full border-4 border-gray-300 border-t-pink-500 animate-spin mx-auto mb-4'></div>

              <h2 className='text-lg font-semibold'>Confirm swap</h2>
            </div>
            {renderSwapDetailsCompact()}
          </div>
          <button className='btn' disabled>
            Proceed in your wallet
          </button>
        </>
      )
    } else if (!sufficientAllowance && !isApproving) {
      return (
        <>
          <h2 className='text-lg font-semibold mb-4 text-center'>Approve Token</h2>
          <div className='flex flex-grow flex-col w-full h-full justify-center items-center'>
            <div className='text-center mb-2'>{renderTokenInfo(fromToken, fromAmount, '')}</div>
          </div>
          {renderButton()}
        </>
      )
    } else {
      return (
        <>
          <h2 className='text-lg font-semibold mb-4 text-center'>Confirm Swap</h2>
          {renderSwapDetails()}
          <div className='flex flex-col w-full justify-start pb-6 gap-2 text-sm'>
            {/* click button to show/hide expanded content */}
            <button
              className='text-black items-center cursor-pointer px-4 text-center flex w-full h-7 my-1'
              onClick={toggleExpand}>
              <div className='bg-white/[0.1] w-full h-px' />
              <div className='items-center px-4 flex min-w-fit -mr-1.5'>
                <div className='text-neutral-400'>{isExpanded ? 'Show less' : 'Show more'}</div>
                <svg className='w-4 h-4' fill='none' height='16' viewBox='0 0 17 16' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M11.6376 8.86202C11.8982 9.12269 11.8982 9.54407 11.6376 9.80473L8.97089 12.4714C8.84089 12.6014 8.6702 12.6667 8.49954 12.6667C8.32887 12.6667 8.15818 12.6014 8.02818 12.4714L5.36152 9.80473C5.10085 9.54407 5.10085 9.12269 5.36152 8.86202C5.62218 8.60136 6.04356 8.60136 6.30422 8.86202L8.49954 11.0573L10.6948 8.86202C10.9555 8.60136 11.3769 8.60136 11.6376 8.86202ZM6.30422 7.13807L8.49954 4.94275L10.6948 7.13807C10.8248 7.26807 10.9955 7.33338 11.1662 7.33338C11.3369 7.33338 11.5076 7.26807 11.6376 7.13807C11.8982 6.8774 11.8982 6.45602 11.6376 6.19536L8.97089 3.52869C8.71022 3.26802 8.28885 3.26802 8.02818 3.52869L5.36152 6.19536C5.10085 6.45602 5.10085 6.8774 5.36152 7.13807C5.62218 7.39873 6.04356 7.39873 6.30422 7.13807Z'
                    fill='rgb(94, 94, 94)'
                  />
                </svg>
              </div>
              <div className='bg-white/[0.1] w-full h-px' />
            </button>

            <div className='flex w-full items-center justify-between'>
              <h3 className='text-neutral-400'>Rate</h3>
              <div className='text-right'>
                <button className='flex justify-end'>
                  <span className='text-neutral-content'>1 DAI = 2.02927 MATIC </span>
                </button>
              </div>
            </div>

            <div className='flex w-full items-center justify-between'>
              <h3 className='text-neutral-400'>Fee (0.25%)</h3>
              <div className='flex justify-end'>{`<$0.01`}</div>
            </div>
            <div className={`expandable-content ${isExpanded ? 'expanding expanded' : 'collapsing'}`}>
              <div className='flex w-full items-center justify-between'>
                <h3 className='text-neutral-400'>Network cost</h3>
                <div className='flex items-center justify-start gap-1'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    height='24'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      clipRule='evenodd'
                      d='M15.3078 1.77827C15.7064 1.39599 16.3395 1.40923 16.7217 1.80783L20.9689 6.23633C21.2428 6.47474 21.4729 6.76205 21.6459 7.08464C21.8481 7.43172 22 7.84819 22 8.32698V16.7012C22 18.2484 20.7455 19.5 19.2 19.5C17.6536 19.5 16.4 18.2464 16.4 16.7V14.3999C16.4 13.8476 15.9523 13.3999 15.4 13.3999H14V20.5C14 20.569 13.9965 20.6372 13.9897 20.7045C13.9515 21.08 13.8095 21.4249 13.5927 21.7098C13.2274 22.19 12.6499 22.5 12 22.5H4C3.30964 22.5 2.70098 22.1502 2.34157 21.6182C2.12592 21.299 2.00001 20.9142 2 20.5V5.4999C2 3.84305 3.34315 2.4999 5 2.4999H11C12.6569 2.4999 14 3.84305 14 5.4999V11.3999H15.4C17.0569 11.3999 18.4 12.7431 18.4 14.3999V16.7C18.4 17.1418 18.7582 17.5 19.2 17.5C19.6427 17.5 20 17.1422 20 16.7012V11.3292C19.6872 11.4397 19.3506 11.4999 19 11.4999C17.3431 11.4999 16 10.1568 16 8.4999C16 7.28851 16.718 6.24482 17.7517 5.77117L15.2783 3.19217C14.896 2.79357 14.9092 2.16055 15.3078 1.77827ZM19.6098 7.70731C19.441 7.57725 19.2296 7.4999 19 7.4999C18.4477 7.4999 18 7.94762 18 8.4999C18 9.05219 18.4477 9.4999 19 9.4999C19.5523 9.4999 20 9.05219 20 8.4999C20 8.34084 19.9629 8.19045 19.8968 8.05693C19.8303 7.95164 19.7349 7.83559 19.6098 7.70731ZM5.21572 4.72463C4.66343 4.72463 4.21572 5.17235 4.21572 5.72463V9.72463C4.21572 10.2769 4.66343 10.7246 5.21572 10.7246H10.7157C11.268 10.7246 11.7157 10.2769 11.7157 9.72463V5.72463C11.7157 5.17235 11.268 4.72463 10.7157 4.72463H5.21572Z'
                      fill='rgb(94, 94, 94)'
                      fillRule='evenodd'
                    />
                  </svg>
                  <div className='text-neutral-400'>
                    <div className='items-center justify-start flex'>{`<$0.01`}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {renderButton()}
        </>
      )
    }
  }

  return (
    <ModalWrapper isVisible={isVisible} onClose={onClose} style={{ paddingBottom: '28px' }}>
      <div className='text-neutral-content flex flex-col min-h-96 w-full items-center justify-between mt-4'>
        {renderContent()}
      </div>
    </ModalWrapper>
  )
}

export default SwapModal

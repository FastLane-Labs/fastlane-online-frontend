import React from 'react'
import { Token } from '@/types'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { formatEther } from 'ethers'
import { useEstimatedSwapFees } from '@/hooks/useEstimatedSwapFees'
import { useSwapStateContext } from '@/context/SwapStateContext'

interface SwapStepProps {
  step: 'approve' | 'sign' | 'swap' | 'success'
  onAction: (action: 'approve' | 'sign' | 'swap') => Promise<boolean>
  isLoading: boolean
  error: Error | null
}

const SwapStep: React.FC<SwapStepProps> = ({ step, onAction, isLoading, error }) => {
  const { fromToken, toToken, fromAmount, toAmount, nativeToken, hasSufficientAllowance } = useSwapStateContext()
  const { data: estimatedFees } = useEstimatedSwapFees()

  const renderTokenInfo = (token: Token | null, amount: string, label: string) => (
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
              <div className='rounded-full w-9 h-9 bg-gray-300'></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSwapDetails = () => (
    <div className='flex flex-col w-full items-center mb-4 pt-3 gap-6'>
      {renderTokenInfo(fromToken, fromAmount, 'Sell')}
      {renderTokenInfo(toToken, toAmount, 'Buy')}
    </div>
  )

  const renderButton = () => {
    let buttonText = ''
    let action: 'approve' | 'sign' | 'swap' = 'approve'
    let isDisabled = isLoading

    switch (step) {
      case 'approve':
        if (hasSufficientAllowance) {
          buttonText = 'Continue'
          action = 'sign'
        } else {
          buttonText = isLoading ? 'Approving...' : `Approve ${fromToken?.symbol} for spending`
          action = 'approve'
          isDisabled = isLoading
        }
        break
      case 'sign':
        buttonText = 'Proceed in your wallet'
        action = 'sign'
        isDisabled = true
        break
      case 'swap':
        buttonText = 'Proceed in your wallet'
        action = 'swap'
        isDisabled = true
        break
      case 'success':
        buttonText = 'View on Explorer'
        isDisabled = false
        break
    }

    return (
      <button
        onClick={async () => {
          if (action === 'approve' && !hasSufficientAllowance) {
            const success = await onAction(action)
            if (!success) {
              // If approval fails or is cancelled, don't progress
              return
            }
          }
          onAction(action)
        }}
        disabled={isDisabled}
        className='btn w-full'>
        {buttonText}
      </button>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 'approve':
        return (
          <>
            <h2 className='text-lg font-semibold mb-4 text-center'>
              {hasSufficientAllowance ? 'Ready to Sign' : 'Approve Token'}
            </h2>
            <div className='flex flex-grow flex-col w-full h-full justify-center items-center'>
              <div className='text-center mb-2'>{renderTokenInfo(fromToken, fromAmount, '')}</div>
            </div>
            {hasSufficientAllowance && (
              <p className='text-sm text-green-500 mb-4'>
                You have sufficient allowance. You can proceed to sign the swap.
              </p>
            )}
          </>
        )
      case 'sign':
      case 'swap':
        return (
          <>
            <div className='flex flex-grow flex-col w-full h-full justify-center items-center'>
              <div className='text-center mb-2'>
                <div className='w-16 h-16 rounded-full border-4 border-gray-300 border-t-pink-500 animate-spin mx-auto mb-4'></div>
                <h2 className='text-lg font-semibold'>{step === 'sign' ? 'Sign Swap' : 'Confirm Swap'}</h2>
              </div>
              {renderSwapDetails()}
            </div>
          </>
        )
      case 'success':
        return (
          <div className='flex flex-grow flex-col w-full h-full justify-center items-center'>
            <div className='text-center mb-2'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h2 className='text-lg font-semibold'>Swap success!</h2>
            </div>
            <div className='flex items-center justify-center gap-4 mb-4'>
              {renderTokenInfo(fromToken, fromAmount, '')}
              <ArrowRightIcon className='h-6 w-6 text-neutral-content' />
              {renderTokenInfo(toToken, toAmount, '')}
            </div>
          </div>
        )
    }
  }

  return (
    <div className='text-neutral-content flex flex-col min-h-96 w-full items-center justify-between mt-4'>
      <div className='flex-grow w-full'>
        {renderStepContent()}
        {error && <p className='text-red-500 mt-2'>{error.message}</p>}
      </div>
      <div className='w-full mt-4'>
        {renderButton()}
        {step !== 'approve' && step !== 'success' && (
          <div className='mt-4 text-sm text-neutral-400'>
            Estimated network cost: {estimatedFees ? formatEther(estimatedFees.totalFeesInWei) : '0'}{' '}
            {nativeToken?.symbol}
          </div>
        )}
      </div>
    </div>
  )
}

export default SwapStep

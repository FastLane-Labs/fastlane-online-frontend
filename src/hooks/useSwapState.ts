import { useState, useEffect, useCallback, useMemo } from 'react'
import { QuoteResult, SwapCallData, SwapDirection, SwapResult, Token } from '@/types'
import { useCurrentTokenList } from './useTokenList'
import { useAccount } from 'wagmi'
import { toBigInt } from '@/utils/format'
import useDebounce from '@/hooks/useDebounce'
import { useAllowanceManager } from './useAllowanceManager'
import { nativeEvmTokenAddress } from '@/constants'
import { useFastLaneAddresses } from './useFastLaneAddresses'

export interface SwapState {
  // Token States
  fromToken: Token | null
  toToken: Token | null
  nativeToken: Token | null

  // Amount States
  fromAmount: string
  toAmount: string

  // Swap Configuration
  swapDirection: SwapDirection

  // Quote States
  quote: QuoteResult | null
  isQuoteing: boolean
  allowQuoteUpdate: boolean

  // Swap Data
  swapData: SwapCallData | null
  swapResult: SwapResult | null

  // Allowance State
  hasSufficientAllowance: boolean

  // Progress States
  isApproving: boolean
  isSwapping: boolean
  isSigning: boolean
  hasUserOperationSignature: boolean

  // State Setters
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setSwapDirection: (direction: SwapDirection) => void
  setQuote: (quote: QuoteResult | null) => void
  setIsQuoteing: (isQuoteing: boolean) => void
  setAllowQuoteUpdate: (allowQuoteUpdate: boolean) => void
  setSwapData: (data: SwapCallData | null) => void
  setSwapResult: (result: SwapResult | null) => void
  setIsApproving: (isApproving: boolean) => void
  setIsSwapping: (isSwapping: boolean) => void
  setIsSigning: (isSigning: boolean) => void
  setHasUserOperationSignature: (hasUserOperationSignature: boolean) => void
  setSwapDataSigned: (isSigned: boolean) => void

  // Actions
  swapTokens: () => void
  resetSelections: () => void

  // Allowance functions
  checkAllowance: (token: Token, userAddress: string, spenderAddress: string) => Promise<bigint>
  updateAllowance: (token: Token, spenderAddress: string, amount: bigint) => Promise<boolean>
}

export const useSwapState = (): SwapState => {
  // External hooks and derived values
  const { chainId, address: userAddress } = useAccount()
  const { tokens } = useCurrentTokenList()
  const { atlasAddress: spenderAddress } = useFastLaneAddresses()
  const allowanceManager = useAllowanceManager()

  // Derived token values
  const defaultToken = useMemo(() => tokens.find((token) => token.tags?.includes('default')) as Token | null, [tokens])
  const nativeToken = useMemo(
    () => tokens.find((token) => token.address === nativeEvmTokenAddress) as Token | null,
    [tokens]
  )

  // Token states
  const [fromToken, setFromToken] = useState<Token | null>(() => defaultToken)
  const [toToken, setToToken] = useState<Token | null>(null)

  // Amount states
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const debouncedFromAmount = useDebounce(fromAmount, 500) // 500ms delay

  // Swap configuration
  const [swapDirection, setSwapDirection] = useState<SwapDirection>('sell')

  // Quote states
  const [quote, setQuote] = useState<QuoteResult | null>(null)
  const [isQuoteing, setIsQuoteing] = useState<boolean>(false)
  const [allowQuoteUpdate, setAllowQuoteUpdate] = useState<boolean>(true)

  // Swap data and result
  const [swapData, setSwapData] = useState<SwapCallData | null>(null)
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null)

  // Progress states
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [hasUserOperationSignature, setHasUserOperationSignature] = useState<boolean>(false)

  // Allowance state
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState<boolean>(false)

  useEffect(() => {
    const checkAllowance = async () => {
      if (!fromToken || !userAddress || !spenderAddress || !debouncedFromAmount) {
        setHasSufficientAllowance(false)
        return
      }
      const requiredAmount = toBigInt(debouncedFromAmount, fromToken.decimals)
      const isAllowanceSufficient = await allowanceManager.isSufficientAllowance(
        fromToken,
        userAddress,
        spenderAddress,
        requiredAmount
      )
      setHasSufficientAllowance(isAllowanceSufficient)
    }

    checkAllowance()
  }, [
    fromToken,
    userAddress,
    spenderAddress,
    debouncedFromAmount,
    allowanceManager.isSufficientAllowance,
    allowanceManager.allowanceUpdateTrigger,
  ])

  const resetSelections = useCallback(() => {
    setFromToken(defaultToken)
    setToToken(null)
    setFromAmount('')
    setToAmount('')
    setQuote(null)
    setSwapData(null)
  }, [defaultToken])

  useEffect(() => {
    if (chainId && tokens.length > 0) {
      resetSelections()
    }
  }, [chainId, tokens, resetSelections])

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    setSwapData(null)
  }, [fromToken, toToken, fromAmount, toAmount])

  useEffect(() => {
    setSwapData(null)
  }, [fromToken, toToken, fromAmount, toAmount, swapDirection])

  const checkSignatureValidity = useCallback(() => {
    if (!swapData?.userOperation?.toStruct) {
      setHasUserOperationSignature(false)
      return
    }
    const signature = swapData.userOperation.toStruct().signature
    const isValid = signature !== undefined && signature !== '0x'
    setHasUserOperationSignature(isValid)
    if (isValid) {
      console.log(signature)
    }
  }, [swapData])

  useEffect(() => {
    checkSignatureValidity()
  }, [checkSignatureValidity])

  const setSwapDataSigned = useCallback(
    (isSigned: boolean) => {
      setSwapData((prevData) => (prevData ? { ...prevData, isSigned } : null))
      if (isSigned) {
        checkSignatureValidity()
      }
    },
    [checkSignatureValidity]
  )

  return {
    // Token and Amount States
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    nativeToken,
    // Quote States
    quote,
    isQuoteing,
    allowQuoteUpdate,

    // Approve State
    isApproving,

    // Swap Direction
    swapDirection,

    // Swap Data
    swapData,
    hasUserOperationSignature,
    swapResult,

    // Allowance State
    hasSufficientAllowance,

    // State Setters
    setSwapDirection,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setQuote,
    setAllowQuoteUpdate,
    setIsQuoteing,
    setSwapData,
    setSwapResult,
    setHasUserOperationSignature,
    setSwapDataSigned,
    setIsSigning,
    setIsSwapping,
    setIsApproving,

    // Actions
    swapTokens: handleSwapTokens,
    resetSelections,

    // Allowance functions (from useAllowanceManager)
    checkAllowance: allowanceManager.checkAllowance,
    updateAllowance: allowanceManager.updateAllowance,

    // Swap Progress State
    isSwapping,
    isSigning,
  }
}

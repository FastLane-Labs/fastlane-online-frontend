'use client'
import React, { useState, useEffect } from 'react'
import SellComponent from './SellComponent'
import BuyComponent from './BuyComponent'
import SwapButton from './SwapButton'
import { useAccount } from 'wagmi'
import FlipButton from './FlipButton'
import SettingsModal from './SettingsModal'
import tokenList from '@/constants/tokenList.json'
import SettingsButton from './SettingsButton'
// import HandleSwap from './HandleSwap'
import HandleAtlas from './HandleAtlas'
// import UseSimulateQuote from '@/hooks/getQuote'

const SwapCard = () => {
  const { address } = useAccount()
  const [sellToken, setSellToken] = useState('ETH')
  const [buyToken, setBuyToken] = useState('')
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false)
  const [settings, setSettings] = useState({
    slippageTolerance: 0.5,
    transactionDeadline: 20,
  })
  // wallet Info
  const [balance, setBalance] = useState('0')
  const [decimals, setDecimals] = useState(18)
  const [quoteLoading, setQuoteLoading] = useState(false)

  const getTokenDetails = (symbol) => {
    const token = tokenList.tokens.find((token) => token.symbol === symbol)
    return token || {}
  }

  const { address: sellTokenAddress, decimals: tokenDecimals = 18 } = getTokenDetails(sellToken)

  useEffect(() => {
    setDecimals(tokenDecimals)
  }, [sellToken, tokenDecimals])

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings)
  }

  useEffect(() => {
    const simulateQuote = async () => {
      if (!sellToken || !sellAmount) {
        setBuyAmount(0)
        return
      }

      setQuoteLoading(true)
      // setError(null)

      try {
        // const response = await axios.post('/api/quote', {
        //   sellToken,
        //   sellAmount,
        // })
        // setBuyAmount(response.data.buyAmount)
        setTimeout(() => {
          setBuyAmount(6969)
        }, 3000)
      } catch (error) {
        // setError(error.message)
        setBuyAmount('')
      } finally {
        setTimeout(() => {
          setQuoteLoading(false)
        }, 2000)
      }
    }

    simulateQuote()
  }, [sellToken, sellAmount, buyToken])

  return (
    <div className='relative max-w-md mx-auto p-6 rounded-3xl'>
      <div className='flex justify-end items-center mb-2'>
        {/* <h2 className='btn'>Exchange</h2> */}
        <SettingsButton settings={settings} setIsSettingsModalVisible={setIsSettingsModalVisible} />
      </div>
      <SellComponent
        sellToken={sellToken}
        setSellToken={setSellToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        address={address}
        balance={balance}
        setBalance={setBalance}
        decimals={decimals}
        sellTokenAddress={sellTokenAddress}
      />
      <FlipButton
        sellToken={sellToken}
        setSellToken={setSellToken}
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
      />
      <BuyComponent
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
        address={address}
        quoteLoading={quoteLoading}
      />
      {/* OPTION A:
      initiate atlas-sdk as a REST /route */}
      {/* <HandleSwap
        sellToken={sellToken}
        buyToken={buyToken}
        sellAmount={sellAmount}
        slippageTolerance={settings.slippageTolerance}
        transactionDeadline={settings.transactionDeadline}
        address={address}
      /> */}
      {/* OPTION B:
      initiate atlas-sdk as a hook */}
      <HandleAtlas
        sellToken={sellToken}
        buyToken={buyToken}
        sellAmount={sellAmount}
        slippageTolerance={settings.slippageTolerance}
        transactionDeadline={settings.transactionDeadline}
        address={address}
      />
      {/* <SwapButton isConnected={isConnected} sellAmount={sellAmount} buyToken={buyToken} /> */}
      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
        onSave={handleSettingsSave}
      />
    </div>
  )
}

export default SwapCard

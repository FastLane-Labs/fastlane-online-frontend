'use client'
import React, { useState, useEffect } from 'react'
import SellComponent from './SellComponent'
import BuyComponent from './BuyComponent'
import { useAccount } from 'wagmi'
import FlipButton from './FlipButton'
import SettingsModal from './SettingsModal'
import tokenList from '@/constants/tokenList.json'
import SettingsButton from './SettingsButton'
import HandleAtlas from './HandleAtlas'
import { Settings } from '@/types' // Adjust the path as necessary
import BackgroundGradient from '@/components/BackgroundGradient'
import SwapButton from './SwapButton'

const SwapCard: React.FC = () => {
  const { address } = useAccount()
  const [sellToken, setSellToken] = useState<string>('ETH')
  const [buyToken, setBuyToken] = useState<string>('')
  const [sellAmount, setSellAmount] = useState<string>('')
  const [buyAmount, setBuyAmount] = useState<string>('')
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const [settings, setSettings] = useState<Settings>({
    slippageTolerance: 0.5,
    transactionDeadline: 20,
  })

  const [balance, setBalance] = useState<string>('0')
  const [decimals, setDecimals] = useState<number>(18)
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)

  const getTokenDetails = (symbol: string) => {
    const token = tokenList.tokens.find((token) => token.symbol === symbol)
    return token || null
  }

  const tokenDetails = getTokenDetails(sellToken)

  const sellTokenAddress =
    (tokenDetails?.address as `0x${string}`) ?? ('0x0000000000000000000000000000000000000000' as `0x${string}`)
  const tokenDecimals = tokenDetails?.decimals ?? 18

  useEffect(() => {
    setDecimals(tokenDecimals)
  }, [sellToken, tokenDecimals])

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  useEffect(() => {
    const simulateQuote = async () => {
      if (!sellToken || !sellAmount) {
        setBuyAmount('')
        return
      }

      setQuoteLoading(true)

      try {
        setTimeout(() => {
          setBuyAmount('6969')
        }, 1000)
      } catch (error) {
        setBuyAmount('')
      } finally {
        setTimeout(() => {
          setQuoteLoading(false)
        }, 1000)
      }
    }

    simulateQuote()
  }, [sellToken, sellAmount, buyToken])

  if (!address) {
    return <div>Please connect your wallet to continue.</div>
  }

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <div
        className='relative rounded-3xl'
        style={{
          background: 'rgba(0, 0, 0, .3)',
        }}>
        <div
          className='relative max-w-md mx-auto p-4 rounded-3xl border border-accent'
          style={{
            // background: 'linear-gradient(293deg, rgba(190, 5, 255, .1) 18.05%, rgba(7, 76, 255, .1) 99.54%)',
            background: 'linear-gradient(290deg, rgba(241,35,121, .1) 10%, rgba(7, 76, 255 , .1) 100%)',
            boxShadow: 'rgba(241, 32, 116, .2) 0px 5px 90px 4px', // red
            // boxShadow: 'rgba(243, 160, 66, 0.3) 0px 4px 100px 0px', // orange
          }}>
          <div className='flex justify-end items-center mb-2'>
            {/* <h2 className='btn bg-base-100 hover:bg-base-100 mb-2 rounded-xl w-24 text-center border border-secondary text-base-300 cursor-default hover:border-secondary'>
          Exchange
        </h2> */}
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
          {/* <HandleSwap
            sellToken={sellToken}
            buyToken={buyToken}
            sellAmount={sellAmount}
            slippageTolerance={settings.slippageTolerance}
            transactionDeadline={settings.transactionDeadline}
            address={address}
          /> */}
          <SwapButton sellAmount={sellAmount} buyToken={buyToken} />
          <SettingsModal
            isVisible={isSettingsModalVisible}
            onClose={() => setIsSettingsModalVisible(false)}
            onSave={handleSettingsSave}
          />
        </div>
      </div>
    </div>
  )
}

export default SwapCard

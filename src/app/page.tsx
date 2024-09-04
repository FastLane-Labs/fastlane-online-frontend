'use client'
import { useEffect } from 'react'
import { useAnalytics } from '@/context/AnalyticsContext'
import Logo from '@/components/Logo/Logo'
import FastlaneApp from '@/core/routes'
import { Header } from '@/components/Navbar/Header'
import { Footer } from '@/components/Footer/Footer'

export default function Home() {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(window.location.pathname)
  }, [trackPageView])

  return (
    <>
      <Header />
      <Logo />
      <FastlaneApp />
      <Footer />
    </>
  )
}

import React, { PropsWithChildren } from 'react'
import { Header } from './Navbar/Header'
import { Footer } from './Footer/Footer'

export function Layout(props: PropsWithChildren) {
  return (
    <div
      className='flex flex-col min-h-screen h-full bg-base-300 bg-[url("https://storage.googleapis.com/brutalist-landing/bg-grain.png")] '
      style={{
        backgroundAttachment: 'fixed',
        backgroundSize: '200px 100px',
        backgroundPosition: 'center',
      }}>
      <Header />
      <main className='flex-grow px-4 container max-w-3xl mx-auto'>{props.children}</main>
      <Footer />
    </div>
  )
}

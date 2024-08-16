import React from 'react'
import { Connect } from './Connect'
import { NotificationsDrawer } from '../Notifications/NotificationsDrawer'
import ThemeToggle from '@/components/Theme/ThemeToggle'

export function Header() {
  return (
    <header className='navbar flex justify-end p-4 pt-0'>
      <div className='flex gap-2'>
        <Connect />
        <ThemeToggle />
        <NotificationsDrawer />
      </div>
    </header>
  )
}

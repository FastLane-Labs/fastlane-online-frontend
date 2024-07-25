import React from 'react'

const BackgroundGradient: React.FC = () => {
  return (
    <>
      <div
        className='absolute top-1/4 -left-28 bg-accent bottom-4 w-3/5 rounded-full z-0 hidden sm:block'
        style={{ filter: 'blur(150px)', opacity: 0.6 }}></div>
      <div
        className='absolute bottom-1/4 -right-20 bg-secondary top-4 w-3/5 rounded-full z-0 hidden sm:block'
        style={{ filter: 'blur(150px)', opacity: 0.6 }}></div>
    </>
  )
}

export default BackgroundGradient

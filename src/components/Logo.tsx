import React from 'react'
import Image from 'next/image'
// import LinkComponent from '@/utils/LinkComponent';

const Logo: React.FC = () => {
  return (
    <div className='flex justify-center mt-7 mb-9'>
      {/* <LinkComponent href='/'> */}
      <Image src='/rocketswap-logo-white.png' alt='RocketSwap Logo' width={220} height={220} />
      {/* </LinkComponent> */}
    </div>
  )
}

export default Logo

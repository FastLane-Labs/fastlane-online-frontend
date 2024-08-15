import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import Image from 'next/image'

interface IUXModalProps {
  isVisible: boolean
  onClose: () => void
}
const IUXModal: React.FC<IUXModalProps> = ({ isVisible, onClose }) => {
  const closeModal = () => {
    onClose()
  }
  return (
    <ModalWrapper isVisible={isVisible} onClose={closeModal} style={{ paddingBottom: '28px' }}>
      <div className='flex overflow-scroll md:overflow-visible -mr-2.5 md:mr-0 text-neutral-content flex-col justify-start pt-4 gap-3 xl:pl-0 xl:pr-0'>
        <h2 className='text-5xl'>The Bots Work for Us Now</h2>
        <h4 className='text-xl font-medium'>Fully onchain best execution for your Polygon swaps using Atlas.</h4>
        <div className='flex flex-col gap-1.5 gray-text'>
          <p>
            Rocketboost Swaps are powered by the DRFQ Atlas module built by us at FastLane Labs, which hosts a fully
            onchain request-for-quote auction for your swaps. Atlas is a generalized execution abstraction protocol for
            the EVM used for building intent and MEV auctions.
          </p>
          <p>
            Your swaps are gossipped permissionlessly to searchers over the Polygon mempool, who actually frontrun you
            (yes frontrun you) but in doing so compete to give you the best price in the form of Rocketboost rebates.
            {/* <a className='text-primary ml-1' href='/'>
              Learn more
              <svg
                className='cursor-pointer inline-block w-3 h-3 ml-1 lg:h-4  lg:w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </a> */}
          </p>
        </div>
        <div className='relative w-full rounded-2xl md:overflow-hidden'>
          <Image
            src='/rboost-beta-gif.gif'
            alt='RocketBoost branding graphic'
            layout='responsive'
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </ModalWrapper>
  )
}

export default IUXModal

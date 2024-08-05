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
      <div className='text-neutral-content flex-col grid-cols-1 justify-start pt-4 hidden gap-4 md:flex xl:pl-0 xl:pr-0'>
        <h2 className='text-5xl'>MEV Powered Swap Quotes</h2>
        <div className='gray-text text-xl'>
          Boost your swap quotes lorem ipsum dolor sit amet, consectetur adipiscing elit
        </div>
        <h4 className='text-2xl font-semibold'>Ut porta eu RocketBoost</h4>
        <div className='gray-text'>
          Sit amet posuere lectus egestas non. Mauris tempor justo vitae risus venenatis, at aliquam diam Atlas by
          FastLane Labs.
          <a
            className='text-primary ml-1'
            href='https://www.jito.network/blog/reward-bearing-vs-rebasing-solana-liquid-staking-tokens/'>
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
          </a>
        </div>
        <div className='relative w-full rounded-2xl overflow-hidden'>
          <Image
            src='/rb-gif.gif'
            alt='RocketSwap branding graphic'
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

import Logo from '../Logo/Logo'

interface GeoBlockProps {
  country: string
}

const GeoBlock: React.FC<GeoBlockProps> = ({ country }) => {
  return (
    <div className='relative overflow-hidden'>
      <div
        className='bg-base-300 bg-[url("https://storage.googleapis.com/brutalist-landing/bg-grain.png")]'
        style={{
          backgroundAttachment: 'fixed',
          backgroundSize: '235px 235px',
        }}>
        <div className='items-center flex-col justify-center relative flex w-screen h-screen overflow-hidden p-3'>
          <div className='gradient-1-geoblock' />
          <div className='gradient-2-geoblock' />
          <Logo />
          <div className='text-center'>
            <h1 className='text-neutral-content text-5xl font-bold'>Access Restricted</h1>

            <p className='text-white/[0.6] max-[30rem] mt-7'>
              Unfortunately, RocketBoost is unavailable in your country
              {/* <span> {country}</span> */}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeoBlock

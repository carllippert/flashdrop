import Image from 'next/image'
import logoPic from '../public/FlashDrop.png'

function Avatar() {
  return (
    <>
      <Image
        src={logoPic}
        alt="FlashDrop"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
      />
    </>
  )
}

export default Avatar;
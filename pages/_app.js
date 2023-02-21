import localFont from '@next/font/local'
import '../styles/globals.css'
import Image from 'next/image';
import IMG from './img/logoAlt.png'

const myFont = localFont({ src: './fonts/SourceSansPro-SemiBold.ttf'})

function MyApp({ Component, pageProps }) {
  return (
    <div className='anim_gradient w-screen min-h-screen pb-1'>
      <div className={myFont.className}>
        <nav className="relative p-3 px-5 bg-black
          border-solid border-b-8 border-violet-500">
          <div className="flex items-center justify-between">
            <div>
              <Image src={IMG} alt={""} className="max-w-[20%]"/>
            </div>
            <div className="navbar hidden space-x-6 md:flex">
              <a href="/">Home</a>
              <a href="/create-nft">Sell NFT</a>
              <a href="/my-nfts">My NFTs</a>
              <a href="/dashboard">Dashboard</a>
            </div>
          </div>
        </nav>

        <div>
          <Component {...pageProps}/>
        </div>
      </div>
    </div>
  );
}

export default MyApp
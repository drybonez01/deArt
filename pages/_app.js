import '../styles/globals.css'
import Image from 'next/image';
import IMG from './img/logo.png'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="relative p-3 px-5 bg-sky-200
        border-solid border-b-8 border-sky-500">
        <div className="flex items-center justify-between">
          <div>
            <Image src={IMG} alt={""} className="max-w-[20%]"/>
          </div>
          <div className="hidden space-x-5 md:flex">
            <a href="/" className="btn-primary">Home</a>
            <a href="/create-nft" className="btn-primary">Sell NFT</a>
            <a href="/my-nfts" className="btn-primary">My NFTs</a>
            <a href="/dashboard" className="btn-primary">Dashboard</a>
          </div>
        </div>
      </nav>

      <div style={{
        zIndex: -1,
        position: "fixed",
        width: "100vw",
        height: "100vh"
      }}>
        <Image
          src="/sfondo.png"
          alt="sfondo"
          fill
          style={"cover"}
        />
      </div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp
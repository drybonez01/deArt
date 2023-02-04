import '../styles/globals.css'
import Image from 'next/image';
import IMG from './img/logo.svg'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
        <nav className="relative container mx-auto p-6" style={{borderBottom:"inset"}}>
            <div className="flex items-center justify-between">
            <div className="pt-2" >
                <Image src={IMG} alt={""} style={{background:"cornflowerblue"}}/>
            </div>

                <div className="hidden space-x-6 md:flex" style={{color: "midnightBlue"}}>
                    <a href="/" className="hover:text">Home</a>
                    <a href="/create-nft" className="hover:text-darkGrayishBlue">Sell NFT</a>
                    <a href="/my-nfts" className="hover:text-darkGrayishBlue">My NFTs</a>
                    <a href="/dashboard" className="hover:text-darkGrayishBlue">Dashboard</a>
                </div>

                <button
                id="menu-btn"
                className="block hamburger md:hidden focus:outline-none"
                >
                <span className="hamburger-top"></span>
                <span className="hamburger-middle"></span>
                <span className="hamburger-bottom"></span>
                </button>
            </div>
        </nav>
        <Component {...pageProps} />
    </div>
  );
}

export default MyApp
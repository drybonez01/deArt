import '../styles/globals.css'
import Image from 'next/image';
import IMG from './img/logo.svg'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
        <nav class="relative container mx-auto p-6">
            <div class="flex items-center justify-between">
            <div class="pt-2">
                <Image src={IMG} alt={""}/>
            </div>

                <div class="hidden space-x-6 md:flex">
                    <a href="/" class="hover:text-darkGrayishBlue">Home</a>
                    <a href="/create-nft" class="hover:text-darkGrayishBlue">Sell NFT</a>
                    <a href="/my-nfts" class="hover:text-darkGrayishBlue">My NFTs</a>
                    <a href="/dashboard" class="hover:text-darkGrayishBlue">Dashboard</a>
                </div>

                <button
                id="menu-btn"
                class="block hamburger md:hidden focus:outline-none"
                >
                <span class="hamburger-top"></span>
                <span class="hamburger-middle"></span>
                <span class="hamburger-bottom"></span>
                </button>
            </div>
        </nav>
        <Component {...pageProps} />
    </div>
  );
}

export default MyApp
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await contract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))

    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (
    <div className="flex justify-center">
      <h1 className="px-10 py-7 my-10 rounded text-3xl bg-black/75 text-white">
        No NFTs listed
      </h1>
    </div>
  )
  return (
    <div>
      <div className="p-4 m-5 rounded bg-black/75
        flex flex-col">
        <h2 className="text-4xl text-center text-white mb-5">Items Listed</h2>

        <div className='inline-flex items-center justify-center w-full my-1'>
          <hr className='w-11/12 border-2 rounded border-violet-500'/>
        </div>

        <div className='flex flex-row flex-wrap my-6 justify-center w-full'>
        {
          nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded overflow-hidden w-5/12 mx-8 my-4">
              <div className='flex flex-row'>
                <div className='w-8/12 h-72'>
                  <img src={nft.image} className="object-cover h-full w-full"/>
                </div>

                <div className="w-4/12 p-4 bg-black">
                  <p className="text-xl font-bold text-white">{nft.name}</p>
                  <hr className='my-1 border-2 rounded border-violet-500'/>
                  <p className="text-xl text-white">{nft.price} Eth</p>
                </div>
              </div>

              <div className='p-2 bg-violet-300 h-28 overflow-scroll'>
                <p>
                  {nft.description}
                </p>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}

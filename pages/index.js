import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image';
import Web3Modal from 'web3modal'
import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      console.log(tokenUri)
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
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <div className="flex justify-center">
      <h1 className="px-10 py-7 my-10 rounded text-3xl bg-black/75 text-white">
        No items are currently available.
      </h1>
    </div> 
  )

  return (
    <div>
      <div className="p-4 m-5 rounded bg-black/75
        flex flex-col">
        <div className='flex flex-row flex-wrap my-6 justify-center w-full'>
        {
          nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded overflow-hidden w-5/12 mx-8 my-4">
              <div className='flex flex-row'>
                <div className='w-full h-72'>
                  <img src={nft.image} className="object-cover h-full w-full"/>
                </div>
              </div>

              <div className="w-full h-64 p-4 bg-black">
                <p className="text-3xl font-bold text-white">{nft.name}</p>
                <hr className='my-2 border-2 rounded border-violet-500'/>
                <p className="text-xl text-white">{nft.price} Eth</p>
              </div>

              <div className='inline-flex items-center justify-center w-full bg-black'>
                <button className="btn-primary m-3 p-2 w-11/12"
                    onClick={() => buyNft(nft)}>Buy</button>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}
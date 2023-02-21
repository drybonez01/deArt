import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  async function listNFTForSale() {
    if (!price) return
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-8/12 px-5 py-5 mx-40 my-10
          rounded bg-black/75 text-white">
        <div className='w-full'>
        {
          image && (
            <img className="object-cover h-full w-full rounded" src={image} />
          )
        }
        </div>

        <hr className='my-1 border-2 rounded border-violet-500 my-5'/>

        <div className='flex flex-row space-x-4'>
          <input
            placeholder="Asset Price in Eth"
            className="p-4 text-black border rounded flex-1"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />

          <button onClick={listNFTForSale} className="btn-primary p-4">
            List NFT
          </button>
        </div>
      </div>
    </div>
  )
}
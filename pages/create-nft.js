import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { Formik, Form } from "formik"
import * as yup from "yup"

const projectId = "2KuUpyWSM4W0QeXy5mdRdJzwl6A";
const projectSecret = "63c20345fceffcb679e37f434ec37e92";
const auth = 'Basic ' + btoa(projectId + ':' + projectSecret);
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
      authorization: auth,
  }
});

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log('received: ${prog}')
        }
      )
      const add = added.path
      const url = 'https://ipfs.io/ipfs/' + add
      //const url = 'https://sdurl.infura-ipfs.io/ipfs/${added.path}'
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function uploadToIPFS () {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    
    try {
      const added = await client.add(data)
      const add = added.path
      const url = 'https://ipfs.io/ipfs/' + add
      //const url = 'https://sdurl.infura-ipfs.io/ipfs/${added.path}'
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')//ether
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
  });
  return (
    /*<div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>*/

    <div className="flex justify-center">
      <Formik
        initialValues={initialValues}
        onSubmit={listNFTForSale}
        validateOnMount
        validationSchema={validationSchema}>
        {({ isValid }) => (
          <Form className="w-full px-5 py-4 mx-40 my-10
          rounded bg-black/75 text-white">
            <h1 className="text-3xl font-bold">
              Create new item
            </h1>
            
            <div className="flex flex-col lg:flex-row pt-5">
              <div tabIndex="0"
                className="h-96 sm:w-96 flex justify-center items-center overflow-hidden
                lg:mr-4 cursor-pointer rounded-lg border-dashed border-2">
                <input type="file" 
                  accept="image/jpeg, image/png" 
                  autoComplete="off" tabIndex="-1" 
                  onChange={onChange}/>

                {
                  fileUrl && (
                    <img className="rounded mt-4" width="350" src={fileUrl} />
                  )
                }
              </div>
              
              <div className="flex-1 flex flex-col pt-2 lg:pt-0">
                <input 
                  placeholder="Asset Name"
                  className="mt-2 border rounded p-4"
                  onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />

                <textarea
                  placeholder="Asset Description"
                  className="flex-1 mt-2 border rounded p-4"
                  onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />

                <input
                  placeholder="Asset Price in Eth"
                  className="mt-2 border rounded p-4"
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
          
                <button onClick={listNFTForSale} className="font-bold mt-4 text-white rounded
                p-4 shadow-lg" style={{background:"cornflowerblue"}}>
                  Create NFT
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
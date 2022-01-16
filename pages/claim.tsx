import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { hasMetamask } from '../utils/ethereum'
import Avatar from '../components/Avatar'
import Flashdrop from '../contracts/artifacts/TradeableCashflow.json'

const Claim: NextPage = () => {
  const [connectedWalletAddress, setConnectedWalletAddress] = useState('')
  const [flashdropNftId, setFlashdropNftId] = useState('')
  const [referrerAddress, setReferrerAddress] = useState('')
  const [hasClaimed, setHasClaimed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { query } = useRouter()

  // request metamask accounts
  const requestAccounts = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  const fetchSignerAddress = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    return signer.getAddress()
  }

  const fetchConnectedWalletAddress = async () => {
    const fetch = async () => {
      const address = await fetchSignerAddress()
      setConnectedWalletAddress(address)
    }

    try {
      await fetch()
    }
    catch {
      await requestAccounts()
      await fetch();
    }
  }

  // Call smart contract, set new value
  const claimStream = async (flashdropId: string) => {
    if (!hasMetamask()) {
      setConnectedWalletAddress('')
      return
    }

    await fetchConnectedWalletAddress()

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract("0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00", Flashdrop.abi, signer)
    
    const transaction = await contract.claimStream(flashdropId)
    await transaction.wait()

    setHasClaimed(true)
  }
  
  // get metamask wallets
  useEffect(() => {
    fetchConnectedWalletAddress()
  })

  // get token id using the query param id
  useEffect(() => {
    const fetchTokenId = async () => {
      const uuid = Array.isArray(query.id) ? query.id[0] : query.id
      if (!uuid) {
        setErrorMessage('The provided link is malformed!')
        return
      }

      setFlashdropNftId(uuid)
    }

    fetchTokenId()
  })

  // get referrer address from query
  useEffect(() => {
    const referrer = Array.isArray(query.referrer) ? query.referrer[0] : query.referrer;
    if (!referrer) { return }
    setReferrerAddress(referrer)
  })

  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Flashdrop | Claim Super Tokens</title>
        <meta name="description" content="Flashdrop | Claim Super Tokens" />
        <link rel="icon" href="/favicon-16x16.png" />
      </Head>

      <main className="h-screen">

        <Avatar />

        <div className="flex w-full p-10">
          <p className='text-white'>Tokens will stream for the duration of the ad period or until funds are exhausted.</p>
        </div>
        <div>
          <p className='text-white'>The tokens are yours as soon as they land in your wallet. Enjoy!</p>
        </div>
        <div>&nbsp; </div>
        <br></br>


        {connectedWalletAddress ? (
          <button 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded space-y-3.5" 
            onClick={() => claimStream(flashdropNftId)}
          >
            Claim my token stream
          </button>
        ) : (
          <p className="text-md">
            To get started, connect your MetaMask account by refreshing this page. Need MetaMask? <a target="_blank" rel="noreferrer" className='link' href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your browser.
            </a>
          </p>
        )}

        <h1 className="title p-10 text-white">
          Learn about streaming <a href="https://www.superfluid.finance/home" className='link'>Super Tokens</a>
        </h1>
      </main>

      <footer className="mt-20">
        {/* <a
          href="https://github.com/tomhirst/solidity-nextjs-starter/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          Read the docs
        </a> */}
      </footer>
    </div>
  )
}

export default Claim

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Avatar from '../components/Avatar'

const Home: NextPage = () => {
  const [connectedWalletAddress, setConnectedWalletAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // request metamask accounts
  const requestAccounts = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  const fetchSignerAddress = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    return signer.getAddress()
  }

  useEffect(() => {
    const fetchConnectedWalletAddress = async () => {
      try {
        const address = await fetchSignerAddress()
        setConnectedWalletAddress(address)
      }
      catch {
        await requestAccounts()
        const address = await fetchSignerAddress()
        setConnectedWalletAddress(address)
      }
    }
    fetchConnectedWalletAddress();
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
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded space-y-3.5">Claim my token stream</button>
        ) : (
          <p className="text-md">
            To get started, connect your MetaMask account by refreshing this page. Need MetaMask? <a target="_blank" className='link' href={`https://metamask.io/download.html`}>
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

export default Home

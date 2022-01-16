import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen bg-gradient-to-b from-red-200 to-red-500">
        <h1 className="title">
          Claim your streaming <a href="https://www.superfluid.finance/home">Super Tokens</a>
        </h1>
        { connectedWalletAddress ? (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded">Claim my token stream</button>
        ) : (
          <p className="text-md">
            Get started by connecting your MetaMask account
          </p>
        ) }
      </main>

      <footer className="mt-20">
        <a
          href="https://github.com/tomhirst/solidity-nextjs-starter/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          Read the docs
        </a>
      </footer>
    </div>
  )
}

export default Home

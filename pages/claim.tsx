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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen">
        <header className="flex w-full p-5 justify-between text-grey-700">
          {/* LEFT */}
          <div className="flex space-x-4 items-center p-10">
            <p className="link"> About</p>
          </div>
          {/* RIGHT */}



        </header>
        <Avatar />


        {connectedWalletAddress ? (
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded space-y-3.5">Claim my token stream</button>
        ) : (
          <p className="text-md">
            Get started by connecting your MetaMask account
          </p>
        )}

        <h1 className="title text-white">
          Learn about streaming <a href="https://www.superfluid.finance/home" className='link'>Super Tokens</a>
        </h1>
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

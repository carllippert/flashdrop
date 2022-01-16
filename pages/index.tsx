import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ethers, Wallet } from 'ethers'
import Avatar from '../components/Avatar'
import Flashdrop from '../contracts/artifacts/TradeableCashflow.json'

const Home: NextPage = () => {
  const [connectedWalletAddress, setConnectedWalletAddress] = useState('')
  const [mintLoading, setMintLoading] = useState(false)
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

  const fetchQrCode = async () => {
    const response = await fetch('/api/qr', { method: 'POST' })
    return response.json()
  }

  const mint = async (amount: number) => {
    setMintLoading(true)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const token = new ethers.Contract("0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00", Flashdrop.abi, signer)
      const contract = new ethers.Contract("0xd63a778287832Eb7F8c257dD531186FDAeae2C1D", Flashdrop.abi, signer)

      await token.approve("0xd63a778287832Eb7F8c257dD531186FDAeae2C1D", amount)

      const { qrCodeUrl, randomId } = await fetchQrCode()

      await contract.mintFlashDrop(
        "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
        amount/10,
        qrCodeUrl,
        randomId, 
        100,
        10,
      )
    }
    catch(err) {
      console.error(err)
    }

    setMintLoading(false)
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
        <title>Flashdrop | Mint your QR code</title>
        <meta name="description" content="Flashdrop | Mint your QR code" />
        <link rel="icon" href="/favicon-16x16.png" />
      </Head>

      <main className="h-screen">

        <Avatar />
        <div className="flex w-full p-10">

          <p className='text-white'>Create your campaign to start airdropping tokens to your flash mob!</p>
        </div>

        {connectedWalletAddress ? (
          <p className='text-white'>Step 1: Completed. Your wallet is connected.</p>
        ) : (
          <p className="text-md text-white p-5">
            Step 1: Connect your MetaMask wallet by refreshing this page. Need MetaMask? <a target="_blank" rel="noreferrer" className='link' href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        )}

        <div>
          <p className='text-white'>Step 2: Mint your QR code below.</p>
        </div>
        <div>&nbsp; </div>
        <br></br>

        {connectedWalletAddress ? (
          <button
            className={`${mintLoading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-700'} text-white font-bold py-4 px-8 rounded space-y-3.5`}
            onClick={() => mint(10000000000)}
            disabled={mintLoading}
          >
            Mint my QR Code
          </button>
        ) : (
          <p className="text-md">
            Get started by connecting your MetaMask account
          </p>
        )}

        <h1 className="title p-10 text-center text-white">
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

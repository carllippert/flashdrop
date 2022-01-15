import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styles from '../styles/Home.module.css'

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
    <div className={styles.container}>
      <Head>
        <title>Flashdrop | Claim Super Tokens</title>
        <meta name="description" content="Flashdrop | Claim Super Tokens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Claim your streaming <a href="https://www.superfluid.finance/home">Super Tokens</a>
        </h1>
        { connectedWalletAddress ? (
          <button>Claim my token stream</button>
        ) : (
          <p className={styles.description}>
            Get started by connecting your MetaMask account
          </p>
        ) }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home

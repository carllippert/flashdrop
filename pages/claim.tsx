import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { hasMetamask } from '../utils/ethereum'
import { getTokenId } from '../utils/db'
import styles from '../styles/Home.module.css'
import Flashdrop from '../src/artifacts/contracts/Flashdrop.sol/Flashdrop.json'

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
  const claimStream = async (flashdropId: string, referrerAddress?: string) => {
    if (!hasMetamask()) {
      setConnectedWalletAddress('')
      return
    }

    await fetchConnectedWalletAddress()

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FLASHDROP_ADDRESS!, Flashdrop.abi, signer)
    
    const transaction = await contract.claimStream(flashdropId, referrerAddress)
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

      const tokenId = await getTokenId(uuid)
      setFlashdropNftId(tokenId)
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
          hasClaimed ? (
            <button onClick={() => claimStream(flashdropNftId, referrerAddress)}>Claim my token stream</button>
          ) : (
            <p className={styles.description}>
              You have claimed your stream! Visit <a href="https://app.superfluid.finance">https://app.superfluid.finance</a> to see your streams in real time
            </p>
          )
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

export default Claim

import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasMetamask } from '../utils/ethereum'
import Avatar from '../components/Avatar'

const Greeter = { abi: null } // TODO: replace Greeter stuff with Flashdrop

export default function Home() {
  const [greeting, setGreetingState] = useState('')
  const [newGreeting, setNewGreetingState] = useState('')
  const [newGreetingMessage, setNewGreetingMessageState] = useState('')
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
  const newGreetingInputRef = useRef();

  // request metamask accounts
  const requestAccounts = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  

  // If wallet is already connected...
  useEffect( () => {
    if(! hasMetamask()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      try {
        const signerAddress = await signer.getAddress()
        setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
      } catch {
        setConnectedWalletAddressState('No wallet connected')
        return;
      }
    }
    setConnectedWalletAddress();
  },[])
  
  // Request access to MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  // Call smart contract, fetch current value
  async function fetchGreeting() {
    if ( ! hasMetamask() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS, Greeter.abi, provider)
    try {
      const data = await contract.greet()
      setGreetingState(data)
    } catch(error) {
      console.log(error)
    }
  }

  // Call smart contract, set new value
  async function setGreeting() {
    if ( ! hasMetamask() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    if(! newGreeting ) {
      setNewGreetingMessageState('Add a new greeting first.')
      return
    }
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS, Greeter.abi, signer)
    const transaction = await contract.setGreeting(newGreeting)
    await transaction.wait()
    setNewGreetingMessageState(`Greeting updated to ${newGreeting} from ${greeting}.`)
    newGreetingInputRef.current.value = ''
    setNewGreetingState('')
  }

  return (
    

    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>FlashDrop</title>
        <meta name="description" content="Fund your flash mob." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen">
        { ! process.env.NEXT_PUBLIC_GREETER_ADDRESS ? (
            <p className="text-md">
              Please add a value to the <pre>NEXT_PUBLIC_GREETER_ADDRESS</pre> environment variable.
            </p>
        ) : (
          <>
           <header className="flex w-full p-5 justify-between text-grey-700">
            {/* LEFT */}
            <div className="flex space-x-4 items-center p-10">
            <p className="link"> About</p>
            </div>
            {/* RIGHT */}
            <div className="flex space-x-4 items-center p-10">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded w-full">
  Connect Wallet
</button>
            </div>


           </header>
            <Avatar />
            <div className="flex w-full p-10">

              <p className='text-white'>Create your campaign to start airdropping tokens to your flash mob!</p>
              </div>
              <div>
              <p className='text-white'>Step 1: Connect your wallet.</p>
            </div>
              <div>
              <p className='text-white'>Step 2: Mint your QR code below.</p>
            </div>
            <div>&nbsp; </div>
            <div className="space-y-8">
                {/* <div className="flex flex-col space-y-4">
                  <input
                    className="border p-4 w-100 text-center"
                    placeholder="A fetched greeting will show here"
                    value={greeting}
                    disabled
                  />
                  <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md w-full"
                      onClick={fetchGreeting}
                    >
                      Fetch greeting from the blockchain
                    </button>
                </div> */}
                {/* <div className="space-y-8">
                  <div className="flex flex-col space-y-4">
                    <input
                      className="border p-4 text-center"
                      onChange={ e => setNewGreetingState(e.target.value)}
                      placeholder="Write a new greeting"
                      ref={newGreetingInputRef}
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"
                      onClick={setGreeting}
                    >
                      Set new greeting on the blockchain
                    </button>
                    <div className="h-2">
                      { newGreetingMessage && <span className="text-sm text-gray-500 italic">{newGreetingMessage}</span> }
                    </div>
                  </div>
                </div> */}
                <div className="h-4">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded">
  Mint my QR Code
</button>
                  { connectedWalletAddress && <p className="text-md">{connectedWalletAddress}</p> }
                </div>
            </div>
          </>
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

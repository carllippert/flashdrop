import { useEffect, useState } from "react";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
 
  useEffect(async () => { //TODO: implement
    
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
   
  };

  const onMintPressed = async () => { //TODO: implement
    
  };

  return (
    <div className="Minter">
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded space-y-3.5" id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
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
<br></br>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded space-y-3.5" id="mintButton" onClick={onMintPressed}>
        Mint Your QR Code
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
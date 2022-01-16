import { useEffect, useState } from "react";

const StreamConnect = (props) => {

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
    <div className="StreamConnect p-12">
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
<p className='text-white'>Tokens will stream for the duration of the ad period or until funds are exhausted.</p>
</div>
<div>
<p className='text-white'>The tokens are yours as soon as they land in your wallet. Enjoy!</p>
</div>
<div>&nbsp; </div>
<br></br>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded space-y-3.5" id="mintButton" onClick={onMintPressed}>
        Claim My Token Stream
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default StreamConnect;
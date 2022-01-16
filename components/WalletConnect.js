import { useEffect, useState } from "react";

const WalletConnect = (props) => {

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
    <div className="WalletConnect">
      <div>
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
      </div>
    </div>
  );
};

export default WalletConnect;
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
            <div>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded space-y-3.5" id="mintButton" onClick={onMintPressed}>
      Mint my QR Code
      </button>
      <p id="status">
        {status}
      </p>
      </div>
    </div>
  );
};

export default Minter;
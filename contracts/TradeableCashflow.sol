 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {RedirectAll, ISuperToken, IConstantFlowAgreementV1, ISuperfluid} from "./RedirectAll.sol";

import { Base64 } from "./Base64Encode.sol";

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TradeableCashflow is ERC721URIStorage, RedirectAll {
  
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;



  constructor (
    address owner,
    string memory _name,
    string memory _symbol,
    ISuperfluid host,
    IConstantFlowAgreementV1 cfa,
    ISuperToken acceptedToken
  )
    ERC721 ( _name, _symbol )
    RedirectAll (
      host,
      cfa,
      acceptedToken,
      owner
     )
      {
        // mintFlashMob(); 
      // _mint(owner, 1);
  }

  // //now I will insert a nice little hook in the _transfer, including the RedirectAll function I need
  // function _beforeTokenTransfer(
  //   address /*from*/,
  //   address to,
  //   uint256 /*tokenId*/
  // ) internal override {
  //     _changeReceiver(to);
  // }

  function mintFlashMob  (
    // value: airdrop amount
    // string uuid, 
    string memory imageURL,
    string memory uuid,
    uint totalFlowRate
    ) public payable {

  // require(msg.value >= 0.05 ether, "Not enough ETH sent: check price.");

    //basic minting stuff
    uint256 newItemId = _tokenIds.current(); 
    _safeMint(msg.sender, newItemId); 
  //art*
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // We set the title of our NFT as the generated word.
                    "Flashdrop!",
                    '", "description": "IRL Airdop!", "image": "imageURL,"}'
                )
            )
        )
    );

     // Just like before, we prepend data:application/json;base64, to our data.
    string memory tokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );
  
    _setTokenURI(newItemId, tokenUri);
    _tokenIds.increment(); //unlimited NFT's


  _createFlashDrop(); 

    }
}
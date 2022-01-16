 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {RedirectAll, ISuperToken, IConstantFlowAgreementV1, ISuperfluid} from "./RedirectAll.sol";

import { Base64 } from "./Base64Encode.sol";
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
      //somethign here
  }

  function claimStream(string memory uuid) public {
    _claimFlashDrop(uuid, msg.sender); 
  }

  function mintFlashMob  (
    string memory imageURL,
    string memory uuid,
    uint totalFlowRate,
    uint maxClaims
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
                    '", "description": "IRL Airdrops powered by Superfluid!", "image": "',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    imageURL,
                    '"}'
                )
            )
        )
    );

     // Just like before, we prepend data:application/json;base64, to our data.
    string memory tokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );
  
    _setTokenURI(newItemId, tokenUri); //set image and name
    _tokenIds.increment(); //unlimited NFT's

    //function _createFlashDrop(string memory uuid, uint totalFlowRate, uint maxClaims ) 
    _createFlashDrop(uuid, totalFlowRate, maxClaims); 

    }
}
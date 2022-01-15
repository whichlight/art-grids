//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//part of the hardhat sample
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract GridFactory is ERC721{
    using SafeMath for uint256;
    using Counters for Counters.Counter;


    Counters.Counter private _tokenIds;
    uint256 dnaDigits = 12; //64*64 or 2^11
    uint256 dnaModulus = 10**dnaDigits;

    // token info 
    string token_name = "grid";
    string token_symbol = "GRID";

    //create a few grids, use NFT to create 
    constructor() ERC721(token_name, token_symbol)  {
        _generateGrid("yay");
        _generateGrid("cool");
        _generateGrid("fun");
    }

    struct Grid {
        //an efficient representation of the grid data.
        uint256 dna;
    }

    Grid[] public grids;

    mapping(uint256 => uint256) public idToDna;
    mapping(uint256 => address) public gridToOwner;

  
    // creating a grid based on a string
    function _generateGrid(string memory _str) internal {
        uint256 val = uint256(keccak256(abi.encodePacked(_str)));
        _createGrid(val % dnaModulus);
    }

    //creating a grid based on someone's public key
    /*
    this isn't working bc of the address and string conversion 
    function createGridAddress() public {
        //need to convert address to string. running encodepacked twice, is this okay? 
        uint256 gridDna = _generateGrid(abi.encodePacked(msg.sender));
    }
    */ 


// creates a grid and mints it 
      function _createGrid(uint256 _dna) internal {
        uint256 id;
        id = mint(msg.sender);
        grids.push(Grid(_dna));
        idToDna[id] = _dna;
        gridToOwner[id] = msg.sender;

    }

    //retrieve a grid given the id
    function getGrid(uint256 id) public view returns (uint256) {
        return idToDna[id];
    }

    //retrieve a list of existing grid id's. this is just the index up to the length. 
    // do we want another way to represent id? 
    // is the return calldata or memory 
    // these return as hex for some reason  (?) 
    function getGridIds() public view returns (uint256[] memory) {
        uint256 len = grids.length;
        uint256[] memory result = new uint256[](len);
        uint counter = 0;

        for (uint256 i = 0; i < grids.length; i++) {
                result[counter] = i;
                counter++;
    
        }
        return result;
    }

// allow anyone to mint, removed tokenuri
    function mint(address recipient) public returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
      //  _setTokenURI(newItemId, tokenURI); // might need ERC721Full
        return newItemId;
    }
}

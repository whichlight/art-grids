//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//part of the hardhat sample
import "hardhat/console.sol";

/* 
these are standard/existing contracts. can replace them with links to ones on openzeppelin 
https://docs.openzeppelin.com/contracts/2.x/api/token/erc721
https://docs.openzeppelin.com/contracts/2.x/api/math
https://docs.openzeppelin.com/contracts/4.x/access-control

*/
import "./erc721.sol";
import "./safemath.sol";
import "./ownable.sol";

contract GridFactory {
    using SafeMath for uint256;

    uint256 dnaDigits = 12; //64*64 or 2^11
    uint256 dnaModulus = 10**dnaDigits;

    struct Grid {
        //an efficient representation of the grid data.
        uint256 dna;
    }

    Grid[] public grids;

    mapping(uint256 => uint256) public idToDna;
    mapping(uint256 => address) public gridToOwner;

    function _createGrid(uint256 _dna) internal {
        uint256 id = grids.push(Grid(_dna)) - 1;
        idToDna[id] = _dna;

        //should we do this?
        gridToOwner[id] = msg.sender;
    }

    // creating a grid based on a string
    function _generateGrid(string _str) internal returns (uint256) {
        uint256 val = uint256(keccak256(abi.encodePacked(_str)));
        _createGrid(val % dnaModulus);
    }

    //creating a grid based on someone's public key
    function createGridAddress() public {
        uint256 gridDna = _generateGrid(msg.sender);
    }

    //retrieve a grid given the id
    function getGrid(uint256 id) public view returns (uint256) {
        return idToDna[id];
    }

    //retrieve a list of existing grid id's. this is just the index up to the length. 
    // do we want another way to represent id? 
    function getGridIds() public view returns (uint256[]) {
        uint256 len = grids.length;
        uint256[] memory result = new uint256[](len);
        for (uint256 i = 0; i < grids.length; i++) {
                result[counter] = i;
                counter++;
    
        }
        return result;
    }
}

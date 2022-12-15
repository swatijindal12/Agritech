//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FarmToken is ERC20, Ownable{

    uint256 private tokenPrice;
    uint256 private exitPrice;
    address private mintedNftAddr;

    uint256 decimal;

    constructor(string memory name_, 
                string memory symbol_, uint256 _decimals) ERC20(name_, symbol_){
                    decimal = _decimals;
    }

    function mint(uint256 totalSupply) external onlyOwner(){
        _mint(msg.sender, totalSupply * 10**decimal);
    }
}
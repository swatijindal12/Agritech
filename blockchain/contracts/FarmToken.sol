//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FarmToken is ERC20, Ownable{

    uint256 decimal;

    constructor(string memory name_, string memory symbol_, uint256 _decimals, uint256 _initalSupply) 
    ERC20(name_, symbol_){
        decimal = _decimals;
        _mint(msg.sender, _initalSupply* 10**decimal);
    }

    function mint(uint256 _totalSupply) external onlyOwner(){
        _mint(msg.sender, _totalSupply * 10**decimal);
    }
}
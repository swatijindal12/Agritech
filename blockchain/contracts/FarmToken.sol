//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FarmToken is ERC20, Ownable{

     
    uint256 public decimal;

    constructor(string memory name_, string memory symbol_, uint256 _decimals, uint256 _initalSupply) 
    ERC20(name_, symbol_){
        decimal = _decimals;
        _mint(msg.sender, _initalSupply* 10**decimal);
    }

    /**
     * @dev Creates tokens and assigns them to `msg.sender`.
     * @param _amount uint256 
     * Requirements:
     *
     * - `_amount` cannot be the zero.
     */
    function mint(uint256 _amount) external onlyOwner(){
        require(_amount != 0 , "Insufficient token to mint");
        _mint(msg.sender, _amount * 10**decimal);
    }
}
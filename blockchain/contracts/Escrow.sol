// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Escrow{
    using SafeERC20 for IERC20;
    IERC20 public farmToken;

    constructor(IERC20 _farmToken) {
        farmToken = _farmToken;
    }

    function withdraw(uint256 amount, address receiver) external{
        require(amount !=0, "Insufficient amount");
        
        farmToken.safeTransfer(receiver, amount);
    }
}
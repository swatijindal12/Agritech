//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable{

  uint256 private userId;

  enum Role{
    Farmer,
    Buyer,
    Validator
  }
  
  Role public role;
  
  struct userInfo{
    address userAddr;
    uint256 userId;
    Role _role;
    string ipfsURL;
  }
    
  mapping(uint256 => userInfo) public userDetails;
   
  function addUser(address _userAddr, uint256 _userRole, string memory _ipfsURL) external onlyOwner(){
    unchecked{
      userId++;
    }
    checkAddr(_userAddr);
    if(uint256(Role.Farmer) == _userRole){
      role = Role.Farmer;
      userDetails[userId]._role = (role);
    } else if(uint256(Role.Buyer) == _userRole){
      role = Role.Buyer;
      userDetails[userId]._role = (role);
    } else{
       role = Role.Validator;
       userDetails[userId]._role = (role);
    }

     _addUser(_userAddr, userId, _ipfsURL);
  }

    function _addUser(address _userAddr, uint256 _userId, string memory _ipfsURL) internal{
      userDetails[_userId].userAddr = _userAddr;
      userDetails[_userId].userId = _userId;
      userDetails[_userId].ipfsURL = _ipfsURL;
    }

    function checkAddr(address userAddr_) internal view{
      for(uint256 i=1; i<=userId; ){
        require(userAddr_ != userDetails[i].userAddr, "Already added user");
        unchecked{
          i++;
        }
      }
    }

}
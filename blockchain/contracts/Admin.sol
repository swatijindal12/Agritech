//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable {
    uint256 private userId;

    enum Role {
        Farmer,
        Buyer
    }

    Role public role;

    struct userInfo {
        address userAddr;
        uint256 userId;
        Role _role;
        string name;
        string location;
        string email;
        uint256 contactNo;
    }

    mapping(uint256 => userInfo) public userDetails;

    function addUser(
        address _userAddr,
        uint256 _userRole,
        string memory _name,
        string memory _address,
        string memory _email,
        uint256 _contactNo
    ) external onlyOwner {
        unchecked {
            userId++;
        }
        checkAddr(_userAddr);
        if (uint256(Role.Farmer) == _userRole) {
            role = Role.Farmer;
        } else if (uint256(Role.Buyer) == _userRole) {
            role = Role.Buyer;
        }
        userDetails[userId]._role = (role);
        _addUser(_userAddr, userId, _name, _address, _email, _contactNo);
    }

    function _addUser(
        address _userAddr,
        uint256 _userId,
        string memory _name,
        string memory _address,
        string memory _email,
        uint256 _contactNo
    ) internal {
        userDetails[_userId].userAddr = _userAddr;
        userDetails[_userId].userId = _userId;
        userDetails[_userId].name = _name;
        userDetails[userId].location = _address;
        userDetails[userId].email = _email;
        userDetails[userId].contactNo = _contactNo;
    }

    function checkAddr(address userAddr_) internal view {
        for (uint256 i = 1; i <= userId; ) {
            require(userAddr_ != userDetails[i].userAddr, "Already added user");
            unchecked {
                i++;
            }
        }
    }
}

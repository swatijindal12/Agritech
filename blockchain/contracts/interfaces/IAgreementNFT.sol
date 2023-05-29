// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IAgreementNFT is IERC721 {
    function createAgreement(
        address farmerAddr_,
        string memory tokenURI_
    ) external returns (uint256);

    function updateAgreement(uint256 agreementNFTId_, string memory updateTokenURI_) external;

    function changeOwnership(address newOwner_) external;
}

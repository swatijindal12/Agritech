// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IAgreementNFT is IERC721 {
    function createAgreement(
        address farmerAddr,
        string memory _tokenURI
    ) external returns (uint256);

    function closeAgreement(address _buyerAddr, uint256 _agreementId) external;
 
    function updateAgreement(uint256 agreementNFTId, string memory updateTokenURI) external;

    function changeOwnership(address newOwner) external;
}

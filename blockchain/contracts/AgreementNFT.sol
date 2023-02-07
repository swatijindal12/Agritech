// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AgreementNFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private agreementTokenId;

    event CreateAgreement(
        address indexed CreateAgreementerAddr,
        uint256 farmId,
        string tokenURI
    );
    
    
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    /**
    @dev mint farm NFT & set token URI.
    @param _farmerAddr address of farmer
    @param _tokenURI Ipfs URL of farm
    * emits a {CreateAgreement} event.
     */
    function createAgreement(
        address _farmerAddr,
        string memory _tokenURI
    ) external returns (uint256) {
        agreementTokenId.increment();
        uint256 agreementId = agreementTokenId.current();

        emit CreateAgreement(_farmerAddr, agreementId, _tokenURI);

        _safeMint(_farmerAddr, agreementId);
        _setTokenURI(agreementId, _tokenURI);
        return agreementId;
    }

    function updateAgreement(uint256 agreementNFTId, string memory agreementIPFSUrl) external{
        _setTokenURI(agreementNFTId, agreementIPFSUrl);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

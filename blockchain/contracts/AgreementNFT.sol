// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AgreementNFT is ERC721URIStorageUpgradeable, ERC721EnumerableUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private agreementTokenId;

    event CreateAgreement(
        address indexed CreateAgreementerAddr,
        uint256 farmId,
        string tokenURI
    );
    
    
    function initialize() initializer external {
        __ERC721_init("AgreementNFTToken", "ATK");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
    }
    /**
    @dev mint farm NFT & set token URI.
    @param farmerAddr_ address of farmer
    @param tokenURI_ Ipfs URL of farm
    * emits a {CreateAgreement} event.
     */
    function createAgreement(
        address farmerAddr_,
        string memory tokenURI_
    ) external onlyOwner returns (uint256) {
        agreementTokenId.increment();
        uint256 agreementId = agreementTokenId.current();

        emit CreateAgreement(farmerAddr_, agreementId, tokenURI_);

        _safeMint(farmerAddr_, agreementId);
        _setTokenURI(agreementId, tokenURI_);
        return agreementId;
    }

    function updateAgreement(uint256 agreementNFTId_, string memory updateTokenURI_) external onlyOwner{
        _setTokenURI(agreementNFTId_, updateTokenURI_);
    }

    function changeOwnership(address newOwner_) external{
        transferOwnership(newOwner_);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


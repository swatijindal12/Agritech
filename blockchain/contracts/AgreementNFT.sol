// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract AgreementNFT is ERC721URIStorageUpgradeable, ERC721EnumerableUpgradeable {
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
    }
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

    function updateAgreement(uint256 agreementNFTId, string memory updateTokenURI) external{
        _setTokenURI(agreementNFTId, updateTokenURI);
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


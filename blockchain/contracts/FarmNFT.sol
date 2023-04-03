// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract FarmNFT is ERC721URIStorageUpgradeable, ERC721EnumerableUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    //Mapping from farmer address to list of NFT Id
    mapping(address => uint256[]) private farmList;

    event Mint(address indexed minterAddr, uint256 farmId, string tokenURI);
    event UpdateFarm(uint256 indexed farmId, string updatedTokenURI);

    function initialize() initializer external {
        __ERC721_init("FarmNFTToken", "FTK");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
    }

    /**
    @dev mint farm NFT
    @param farmerAddr address of farmer
    @param _tokenURI Ipfs URL of farm
    * emits a {Mint} event.
     */
    function mint(
        address farmerAddr,
        string memory _tokenURI
    ) external onlyOwner {
        _tokenIdCounter.increment();
        uint256 farmId = _tokenIdCounter.current();

        emit Mint(farmerAddr, farmId, _tokenURI);

        _safeMint(msg.sender, farmId);
        farmList[farmerAddr].push(farmId);
        _setTokenURI(farmId, _tokenURI);
    }

    function updateFarm(uint256 farmId, string memory _updateTokenUri) external onlyOwner{
        _setTokenURI(farmId, _updateTokenUri);
        emit UpdateFarm(farmId, _updateTokenUri);
    }
    
    /**
    @dev To get farm list of articular farmer
    * return array of NFT Id.
    */
    function getFarmList(
        address farmerAddr
    ) external view returns (uint256[] memory) {
        return farmList[farmerAddr];
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

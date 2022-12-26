// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract FarmNFT is ERC721URIStorage, ERC721Enumerable{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(address => uint256[]) public farmList;
    event Mint(address minterAddr, uint256 farmId, string tokenURI);
    
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    function mint(string memory _tokenURI) external {
        _tokenIdCounter.increment();
        uint256 farmId = _tokenIdCounter.current();

        emit Mint(msg.sender, farmId, _tokenURI);
        
        _safeMint(msg.sender, farmId);
        farmList[msg.sender].push(farmId);
        _setTokenURI(farmId, _tokenURI); 
    }

    function getFarmList() external view returns(uint256[] memory){
        return farmList[msg.sender];
    }


    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

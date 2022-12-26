// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AgreementNFT is ERC721URIStorage, ERC721Enumerable{
    using Counters for Counters.Counter;

    Counters.Counter private agreementTokenId;

    event CreateAgreement(address indexed CreateAgreementerAddr, uint256 farmId, string tokenURI);

     struct AgreementDetails {
        uint256 agreementId; 
        uint256 startDate;
        uint256 endDate;
        address buyer;
        address seller;
    }

    mapping(uint256 => AgreementDetails) public agreementInfo;
    mapping(address => uint256[]) private agreementList; 
   
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}


    function createAgreement(address _farmerAddr, uint256 _endDate, string memory _tokenURI) external returns(uint256){
        agreementTokenId.increment();
        uint256 agreementId = agreementTokenId.current();

        emit CreateAgreement(_farmerAddr, agreementId, _tokenURI);

        agreementInfo[agreementId].agreementId = agreementId;
        agreementInfo[agreementId].startDate = block.timestamp;
        agreementInfo[agreementId].endDate = _endDate;
        agreementInfo[agreementId].seller = _farmerAddr;

        _safeMint(_farmerAddr, agreementId);
        agreementList[_farmerAddr].push(agreementId);
        _setTokenURI(agreementId, _tokenURI);

        return agreementId;
    }

    function acceptAgreement(address _buyerAddr, uint256 _agreementId) external{
       require(agreementInfo[_agreementId].agreementId == _agreementId, "Different TokenId");
       agreementList[_buyerAddr].push(_agreementId);
       agreementInfo[_agreementId].buyer = _buyerAddr;
    }

    function closeAgreement(address _buyerAddr, uint256 _agreementId) external{
       require(agreementInfo[_agreementId].agreementId == _agreementId, "Different TokenId");
       require(agreementInfo[_agreementId].buyer == _buyerAddr, "Different TokenId");
       delete agreementInfo[_agreementId];
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

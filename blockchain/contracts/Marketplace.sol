// SPDX-License-Identifier: NONE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IAgreementNFT.sol";

contract Marketplace is Ownable {
    event Sell(
        uint256 indexed farmNFTId,
        uint256 indexed price,
        uint256 agreementNFTId
    );
    event ClosedContractNFT(uint256 indexed farmNFTId);
    event Buy(
        address indexed buyer,
        uint256 indexed farmNFTId,
        uint256 agreementNFTId,
        string updateTokenURI
    );
    event UpdateAgreementData(
        uint256 indexed agreementNFTId,
        uint256 price, 
        string updatedIPFSUrl
    );

    struct AgreementInfo {
        uint256 farmNFTId;
        uint256 price;
        uint256 agreementNftId;
        uint256 startDate;
        uint256 endDate;
        address buyer;
        address farmerAddr;
        string razorTransId;
        bool isClosedContract;
    }
    // Mapping from agreementNFTId to AgreementInfo struct
    mapping(uint256 => AgreementInfo) public agreementDetails;

    // Mapping from buyer address to buy contractNFT list
    mapping(address => uint256[]) private agreementList;

    IERC721 private immutable farmNFT;
    IAgreementNFT private immutable agreementNFT;

    constructor(address farmNFT_, address agreementNFT_) {
        require(
            farmNFT_ != address(0) && agreementNFT_ != address(0),
            "Zero Address"
        );
        farmNFT = IERC721(farmNFT_);
        agreementNFT = IAgreementNFT(agreementNFT_);
    }
    
    /**
    @dev put contract NFT on sell & call createAgreement() to create Contract NFT
    * Requirements:
    * - `price_` must be greater than 0
    - `startDate_` must be greater than current timestamp
    - `endDate_` must be greater than startDate_
    Emits a {Sell} event.
    */
    function putContractOnSell(
        address farmerAddr_,
        uint256 farmNFTId_,
        uint256 price_,
        uint256 startDate_,
        uint256 endDate_,
        string memory agreementNftUri_
    ) external onlyOwner {
        require(price_ != 0, "Invalid price");
        require(startDate_ < endDate_, "end date should not be less");

        uint256 agreementNftId_ = IAgreementNFT(agreementNFT).createAgreement(
            msg.sender,
            agreementNftUri_
        );

        agreementDetails[agreementNftId_].farmNFTId = farmNFTId_;
        agreementDetails[agreementNftId_].farmerAddr = farmerAddr_;
        agreementDetails[agreementNftId_].price = price_;
        agreementDetails[agreementNftId_].startDate = startDate_;
        agreementDetails[agreementNftId_].endDate = endDate_;

        agreementDetails[agreementNftId_].agreementNftId = agreementNftId_;

        emit Sell(farmNFTId_, price_, agreementNftId_);
    }

    /**
    @dev to update contract NFT data
    @param price_ uint256 updated price of contract
    @param agreementNftId contract NFT id
    @param startDate_ uint256 updated start date of contract
    @param endDate_ uint256 updated end date of contract
    Requirements:
    -`price_` should not be zero 
    -`starDate endDate` startDate should be less than endDate
     */
    function updateAgreementData(
        uint256 agreementNftId,
        uint256 price_,
        uint256 startDate_,
        uint256 endDate_,
        string memory updateTokenURI ) external onlyOwner{
           require(price_ != 0, "Invalid price");
           require(startDate_ < endDate_, "end date should not be less");
           
           IAgreementNFT(agreementNFT).updateAgreement(agreementNftId, updateTokenURI);

            agreementDetails[agreementNftId].price = price_;
            agreementDetails[agreementNftId].startDate = startDate_;
            agreementDetails[agreementNftId].endDate = endDate_;

            emit UpdateAgreementData(agreementNftId, price_, updateTokenURI);
    }


    /**
    @dev to buy contract NFT
    @param buyerAddr buyer address
    @param agreementNftId_ array of contract NFT id
    @param transactionId array of razorpay transaction id
    @param updateTokenURI array of updated IPFS URL
    Requirements:
    -`buyerAddr` buyer address should not be zero address
    -`agreementNftId_ & transactionId` length of array must be equal
    `agreementNftId_ & updateTokenURI` length of array must be equal
    */

    function buyContract(
        address buyerAddr,
        uint256[] memory agreementNftId_,
        string[] memory transactionId,
        string[] memory updateTokenURI
    ) external {
        require(buyerAddr != address(0), "Zero address");
        require(
            agreementNftId_.length == transactionId.length,
            "Array length not same"
        );
        require(
            agreementNftId_.length == updateTokenURI.length,
            "Length of array different"
        );
        uint256 arrayLength = agreementNftId_.length;

        for (uint256 i = 0; i < arrayLength; ) {
            agreementList[msg.sender].push(agreementNftId_[i]);
            agreementDetails[agreementNftId_[i]].buyer = buyerAddr;
            agreementDetails[agreementNftId_[i]].razorTransId = transactionId[
                i
            ];
            IAgreementNFT(agreementNFT).updateAgreement(agreementNftId_[i], updateTokenURI[i]);

            emit Buy(
                buyerAddr,
                agreementDetails[agreementNftId_[i]].farmNFTId,
                agreementNftId_[i],
                updateTokenURI[i]
            );
            unchecked {
                ++i;
            }
        }
    }

    /**
    @dev to closed contract NFT
    @param agreementNftId_ contract NFT id
    
    Emits a {ClosedContractNFT} event.
     */

    function closeContractNFT(uint256 agreementNftId_) external {
       agreementDetails[agreementNftId_].isClosedContract = true;

        emit ClosedContractNFT(agreementNftId_);
    }

    /**
    @dev to get sell detail
    @param agreementNFTId array of contract NFT Id
    - returns a agreement data.
     */

    function getSellDetailByTokenId(
        uint256[] calldata agreementNFTId
    ) external view returns (AgreementInfo[] memory) {
        AgreementInfo[] memory agreementData = new AgreementInfo[](
            agreementNFTId.length
        );
        for (uint256 i = 0; i < agreementNFTId.length; i++) {
            agreementData[i] = agreementDetails[agreementNFTId[i]];
        }
        return agreementData;
    }

    /**
    @dev to get all active contract list of particular buyer
    @param _buyerAddr buyer address
    - returns all array of contract list of buyer
     */
    function getAcceptedContractList(
        address _buyerAddr
    ) external view returns (uint256[] memory) {
        return agreementList[_buyerAddr];
    }
}

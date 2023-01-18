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
        uint256 agreementNFTId
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
        require(
            block.timestamp <= startDate_,
            "startDate less than current time"
        );
        require(startDate_ < endDate_, "end date should be less");

        uint256 agreementNftId_ = IAgreementNFT(agreementNFT).createAgreement(
            msg.sender,
            agreementNftUri_
        );

        agreementDetails[agreementNftId_].farmNFTId = farmNFTId_;
        agreementDetails[agreementNftId_].farmerAddr = farmerAddr_;
        agreementDetails[agreementNftId_].price = price_;
        agreementDetails[agreementNftId_].startDate = startDate_;
        agreementDetails[agreementNftId_].endDate = endDate_;

        IERC721(farmNFT).transferFrom(
            msg.sender,
            address(this),
            farmNFTId_
        );
        agreementDetails[agreementNftId_].agreementNftId = agreementNftId_;

        emit Sell(farmNFTId_, price_, agreementNftId_);
    }

    /**
    @dev to buy contract NFT
    @param agreementNftId_ array of contract NFT id
    @param transactionId array of razorpay transaction id
    Requirements:
    -`agreementNftId_ & transactionId` length of array must be equal
    -`msg.sender` must not be equal to farmerAddr & owner
     */

    function buyContract(
        uint256[] memory agreementNftId_,
        string[] memory transactionId
    ) external {
        require(
            agreementNftId_.length == transactionId.length,
            "Array length not same"
        );
        uint256 arrayLength = agreementNftId_.length;

        for (uint256 i = 0; i < arrayLength; ) {
            require(
                msg.sender != agreementDetails[agreementNftId_[i]].farmerAddr &&
                    msg.sender != owner(),
                "Owner can't buy"
            );
            require(
                agreementDetails[agreementNftId_[i]].agreementNftId != 0,
                "Not on sale"
            );

            agreementList[msg.sender].push(agreementNftId_[i]);
            agreementDetails[agreementNftId_[i]].buyer = msg.sender;
            agreementDetails[agreementNftId_[i]].razorTransId = transactionId[
                i
            ];

            emit Buy(
                msg.sender,
                agreementDetails[agreementNftId_[i]].farmNFTId,
                agreementNftId_[i]
            );
            unchecked {
                ++i;
            }
        }
    }

    /**
    @dev to closed contract NFT
    @param agreementNftId_ contract NFT id
    Requirements:
    -`isClosedContract` to check whether contract NFT is on sale or not.
    -`buyer` msg.sender must equal to buyer address
    Emits a {ClosedContractNFT} event.
     */

    function soldContractNFT(uint256 agreementNftId_) external {
        require(
            !(agreementDetails[agreementNftId_].isClosedContract),
            "Not on sale"
        );
        require(
            msg.sender == agreementDetails[agreementNftId_].buyer,
            "Only Buyer"
        );

        IERC721(farmNFT).transferFrom(address(this), owner(), agreementDetails[agreementNftId_].farmNFTId);
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

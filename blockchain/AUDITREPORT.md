
Marketplace.buyContract(address,uint256[],string,string[]) (contracts/Marketplace.sol#131-160) has external calls inside a loop: IAgreementNFT(agreementNFT).updateAgreement(agreementNftId_[i],updateTokenURI[i]) (contracts/Marketplace.sol#148)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation/#calls-inside-a-loop

Reentrancy in AgreementNFT.createAgreement(address,string) (contracts/AgreementNFT.sol#33-45):
        External calls:
        - _safeMint(_farmerAddr,agreementId) (contracts/AgreementNFT.sol#42)
                - IERC721ReceiverUpgradeable(to).onERC721Received(_msgSender(),from,tokenId,data) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#441-452)
        State variables written after the call(s):
        - _setTokenURI(agreementId,_tokenURI) (contracts/AgreementNFT.sol#43)
                - _tokenURIs[tokenId] = _tokenURI (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol#53)
Reentrancy in FarmNFT.mint(address,string) (contracts/FarmNFT.sol#33-45):
        External calls:
        - _safeMint(msg.sender,farmId) (contracts/FarmNFT.sol#42)
                - IERC721ReceiverUpgradeable(to).onERC721Received(_msgSender(),from,tokenId,data) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol#441-452)
        State variables written after the call(s):
        - _setTokenURI(farmId,_tokenURI) (contracts/FarmNFT.sol#44)
                - _tokenURIs[tokenId] = _tokenURI (node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol#53)
        - farmList[farmerAddr].push(farmId) (contracts/FarmNFT.sol#43)
Reentrancy in Marketplace.putContractOnSell(address,uint256,uint256,uint256,uint256,string) (contracts/Marketplace.sol#64-89):
        External calls:
        - agreementNftId_ = IAgreementNFT(agreementNFT).createAgreement(msg.sender,agreementNftUri_) (contracts/Marketplace.sol#75-78)
        State variables written after the call(s):
        - agreementDetails[agreementNftId_].farmNFTId = farmNFTId_ (contracts/Marketplace.sol#80)
        - agreementDetails[agreementNftId_].farmerAddr = farmerAddr_ (contracts/Marketplace.sol#81)
        - agreementDetails[agreementNftId_].price = price_ (contracts/Marketplace.sol#82)
        - agreementDetails[agreementNftId_].startDate = startDate_ (contracts/Marketplace.sol#83)
        - agreementDetails[agreementNftId_].endDate = endDate_ (contracts/Marketplace.sol#84)
        - agreementDetails[agreementNftId_].agreementNftId = agreementNftId_ (contracts/Marketplace.sol#86)
Reentrancy in Marketplace.updateAgreementData(uint256,uint256,uint256,uint256,string) (contracts/Marketplace.sol#101-117):
        External calls:
        - IAgreementNFT(agreementNFT).updateAgreement(agreementNftId,updateTokenURI) (contracts/Marketplace.sol#110)
        State variables written after the call(s):
        - agreementDetails[agreementNftId].price = price_ (contracts/Marketplace.sol#112)
        - agreementDetails[agreementNftId].startDate = startDate_ (contracts/Marketplace.sol#113)
        - agreementDetails[agreementNftId].endDate = endDate_ (contracts/Marketplace.sol#114)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-2

Reentrancy in Marketplace.buyContract(address,uint256[],string,string[]) (contracts/Marketplace.sol#131-160):
        External calls:
        - IAgreementNFT(agreementNFT).updateAgreement(agreementNftId_[i],updateTokenURI[i]) (contracts/Marketplace.sol#148)
        Event emitted after the call(s):
        - Buy(buyerAddr,agreementDetails[agreementNftId_[i]].farmNFTId,agreementNftId_[i],updateTokenURI[i]) (contracts/Marketplace.sol#150-155)
Reentrancy in Marketplace.putContractOnSell(address,uint256,uint256,uint256,uint256,string) (contracts/Marketplace.sol#64-89):
        External calls:
        - agreementNftId_ = IAgreementNFT(agreementNFT).createAgreement(msg.sender,agreementNftUri_) (contracts/Marketplace.sol#75-78)
        Event emitted after the call(s):
        - Sell(farmNFTId_,price_,agreementNftId_) (contracts/Marketplace.sol#88)
Reentrancy in Marketplace.updateAgreementData(uint256,uint256,uint256,uint256,string) (contracts/Marketplace.sol#101-117):
        External calls:
        - IAgreementNFT(agreementNFT).updateAgreement(agreementNftId,updateTokenURI) (contracts/Marketplace.sol#110)
        Event emitted after the call(s):
        - UpdateAgreementData(agreementNftId,price_,updateTokenURI) (contracts/Marketplace.sol#116)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3


AgreementNFT._burn(uint256) (contracts/AgreementNFT.sol#62-67) is never used and should be removed
FarmNFT._burn(uint256) (contracts/FarmNFT.sol#69-74) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code

# AgriTech

CONTRACT:
1. MintNFT Contract (in this farmer can mint NFT & add/update metadata of their tokenId)


Features:

    1. mintNFT:  arguments(uint256 tokenId) In this user has to pass tokenId, & mint their land.

    2. addMetadata: arguments (uint256 tokenId, string memory tokenURI) in this user can add their metadata & update their metadata.
    

2.  Marketplace Contract (in this farmer can put their land on sell, buyer can buy)
    
Features:

    1. Struct sellerDetails:{ address sellerAddr,  uint256 price, uint256 tokenId }
    
    
    2. putLandOnSell: argument (uint256 tokenId, uint256 priceOfLand) It is onlyOwner function. & store all details into sellerDetails struct.
    
    
    3. removeFromSell: argument(uint256 tokenId) onlyOwner can remove land from sell. It is a close contract feature. 
    
    
    4. buyLand: argument (uint256 tokenId/ structId) in this function buyer can buy land and pay price to the farmer. 




Custody wallet which supports polygon network:

1. Venly wallet 
2. Circle 
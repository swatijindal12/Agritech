const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("Farm Token", function () {
    async function deployNFT() {
      const [owner, otherAccount] = await ethers.getSigners();
  
      const FarmToken = await ethers.getContractFactory("FarmToken");
      const tokenAddr = await FarmToken.deploy("FarmToken", "FT", 18, 10000);
  
      return { tokenAddr, owner, otherAccount };
    }
  
    describe("Checking name & symbol", function () {
      it("Should equal to name of the NFT", async function () {
        const { tokenAddr} = await loadFixture(deployNFT);
  
        expect(await tokenAddr.name()).to.equal("FarmToken");
      });

      it("Should equal to symbol of the NFT", async function () {
        const { tokenAddr} = await loadFixture(deployNFT);
  
        expect(await tokenAddr.symbol()).to.equal("FT");
      });

     
    });

    describe("Mint Token", function() {
        it("only owner can mint token", async function(){
            const {tokenAddr, owner} = await loadFixture(deployNFT);

            await tokenAddr.connect(owner).mint(1000000)
            expect(await tokenAddr.balanceOf(owner.address)).to.equal("1000000000000000000000000")
      })
        it("reverted if owner not mint token", async function(){
            const {tokenAddr, otherAccount} = await loadFixture(deployNFT);
            await expect(tokenAddr.connect(otherAccount).mint(1000000)).to.be.reverted;
      
        })
    })
});
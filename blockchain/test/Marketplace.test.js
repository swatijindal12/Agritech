const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

  const farm1IPFSURL = "https://gateway.pinata.cloud/ipfs/QmXtaQiw3Z9m1cXpjUrwniTkGH8KUFat8icCUirRHg1KZu"
  const farm2IPFSURL = "https://gateway.pinata.cloud/ipfs/QmeH8Cf6rypikXcpJDVT4oZBeA4JJ5EJv4nTV2yLKCTVa5"
  const agreementIPFSURI = "https://gateway.pinata.cloud/ipfs/QmVcGw4MuoSkgPx2L25isQKsxNyEztAewLXQV9vLBwyG8b"
  const agreementIPFSURI2 = "https://gateway.pinata.cloud/ipfs/QmdKnH4mdFy8Xnb8KbUxtx51NyPWKwAFEiCVR8pGc7SkcY"
  
  describe("Marketplace", function () {
    async function deployNFT() {
      const [owner, farmer1, farmer2, buyer1, buyer2, validator1, validator2] = await ethers.getSigners();
  
      const FarmNFT = await ethers.getContractFactory("FarmNFT");
      const farmNFT = await FarmNFT.deploy("FarmNFT", "FT");

      const AgreementNFT = await ethers.getContractFactory("AgreementNFT");
      const agreementNFT = await AgreementNFT.deploy("AgreementNFT", "ANFT");

      const MarketPlace = await ethers.getContractFactory("Marketplace");
      const marketplace = await MarketPlace.deploy(farmNFT.address, agreementNFT.address);
      
      return { farmNFT, agreementNFT, marketplace, owner, farmer1, farmer2, buyer1, buyer2 };
    }
  
    describe("Checking name & symbol of the agreement NFT", function () {
      it("Should equal to name of the NFT", async function () {
        const { agreementNFT} = await loadFixture(deployNFT);
  
        expect(await agreementNFT.name()).to.equal("AgreementNFT");
      });

      it("Should equal to symbol of the NFT", async function () {
        const { agreementNFT} = await loadFixture(deployNFT);
  
        expect(await agreementNFT.symbol()).to.equal("ANFT");
      });
    });

    describe("Put farm NFT on sell", function() {
      it("only farmer can put farm on sell", async function(){
        const {farmNFT, agreementNFT, marketplace, owner, farmer1} = await loadFixture(deployNFT);
        await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
        expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

        await farmNFT.connect(owner).approve(marketplace.address, 1);
        await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

        const      sellvalue = (await marketplace.agreementDetails(1));
        // console.log(sellvalue)
        expect(sellvalue.farmNFTId).to.be.equal(1)
        expect(sellvalue.price).to.be.equal(10)
        expect(sellvalue.agreementNftId).to.be.equal(1)
        expect(sellvalue.farmerAddr).to.be.equal(farmer1.address)
       })

      it("reverted if owner not put farm on sell", async function(){
        const {farmNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

        await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
        expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

        await farmNFT.connect(owner).approve(marketplace.address, 1);
        await expect(marketplace.connect(buyer1).putContractOnSell(farmer1.address, 1, 10,1674181243, 1684549243, 
          agreementIPFSURI)).to.be.revertedWith('Ownable: caller is not the owner');
      })

      // it("reverted if start time is before current time", async function(){
      //   const {farmNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

      //   await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
      //   expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

      //   await farmNFT.connect(owner).approve(marketplace.address, 1);
      //   await expect(marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10,1673250841, 1684549243, 
      //     agreementIPFSURI)).to.be.revertedWith('startDate less than current time');
       
      // })

      it("reverted if end time is before start time", async function(){
        const {farmNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);
 
        await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
        expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

        await farmNFT.connect(owner).approve(marketplace.address, 1);
        await expect(marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10,1684549243, 1673250841, 
          agreementIPFSURI)).to.be.revertedWith('end date should be less');
       
      })

      it("put 2 nft's on sell", async function(){
        const {farmNFT, marketplace, owner, farmer1,farmer2} = await loadFixture(deployNFT);

        await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
        await farmNFT.connect(owner).mint(farmer2.address, farm2IPFSURL)
        expect(await farmNFT.balanceOf(owner.address)).to.be.equal("2");

        await farmNFT.connect(owner).approve(marketplace.address, 1);
        await farmNFT.connect(owner).approve(marketplace.address, 2)
        await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);
        await marketplace.connect(owner).putContractOnSell(farmer2.address, 2, 23, 1674181243, 1684549243, agreementIPFSURI2);

        
        const sellvalue = await marketplace.getSellDetailByTokenId([1,2])

        expect(sellvalue[0].farmNFTId).to.be.equal(1)
        expect(sellvalue[0].price).to.be.equal(10)
        expect(sellvalue[0].agreementNftId).to.be.equal(1)
        expect(sellvalue[0].farmerAddr).to.be.equal(farmer1.address)

        expect(sellvalue[1].farmNFTId).to.be.equal(2)
        expect(sellvalue[1].price).to.be.equal(23)
        expect(sellvalue[1].agreementNftId).to.be.equal(2)
        expect(sellvalue[1].farmerAddr).to.be.equal(farmer2.address)
      })

      it("Reverted if price of NFT is zero", async function(){
        const {farmNFT, marketplace, owner, farmer1} = await loadFixture(deployNFT);

          
        await farmNFT.connect(owner).mint(farmer1.address,farm1IPFSURL);
        expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

        await expect(marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 0, 1674181243, 1684549243, 
          agreementIPFSURI)).to.be.revertedWith("Invalid price");
      })
    })

    describe("Buy NFT", async function(){
      it("Buyer buy farm NFT & create contract agreement", async function(){
        const {farmNFT, agreementNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

        await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
        expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

        await farmNFT.connect(owner).approve(marketplace.address, 1);
        await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

        expect(await agreementNFT.tokenURI(1)).to.be.equal(agreementIPFSURI)
        await marketplace.connect(buyer1).buyContract([1], ["TID1"])

        const sellvalue = (await marketplace.agreementDetails(1));
        expect(sellvalue.farmNFTId).to.be.equal(1)
        expect(sellvalue.price).to.be.equal(10)
        expect(sellvalue.agreementNftId).to.be.equal(1)
        expect(sellvalue.farmerAddr).to.be.equal(farmer1.address)
        expect(sellvalue.buyer).to.be.equal(buyer1.address)    

    })

    it("Reverted if farmer can try to buy NFT", async function(){
      const {farmNFT, marketplace, owner, farmer1} = await loadFixture(deployNFT);

      await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
      expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

      await farmNFT.connect(owner).approve(marketplace.address, 1);
      await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

      await expect(marketplace.connect(owner).buyContract([1], ["TID1"])).to.be.revertedWith("Owner can't buy")

    })

    it("Reverted if NFT is not on sale", async function(){
      const {tokenAddr, farmNFT, marketplace, owner, farmer1, buyer1, validator1} 
      = await loadFixture(deployNFT);

      await farmNFT.connect(owner).mint(farmer1.address,farm1IPFSURL);
      expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

      await farmNFT.connect(owner).approve(marketplace.address, 1);
      await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

      await expect(marketplace.connect(buyer1).buyContract([2], ["TID1"])).to.be.revertedWith("Not on sale")
    
    })

    it("Buyer buy contract NFT", async function(){
      const {farmNFT, agreementNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

      await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
      expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

      await farmNFT.connect(owner).approve(marketplace.address, 1);
      await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

      await marketplace.connect(buyer1).buyContract([1], ["TID1"]);
      await marketplace.getAcceptedContractList(buyer1.address)
    })

    it("reverted if array length not same", async function(){
      const {farmNFT, agreementNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

      await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
      expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

      await farmNFT.connect(owner).approve(marketplace.address, 1);
      await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

      await expect(marketplace.connect(buyer1).buyContract([1], [])).to.be.revertedWith("Array length not same");
      
    })
  })

  describe("closed agreement", async function(){
    it("buyer will close the agreement", async function(){
      const {farmNFT, agreementNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

      await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
      expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

      await farmNFT.connect(owner).approve(marketplace.address, 1);
      await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

      await marketplace.connect(buyer1).buyContract([1], ["TID1"])

      await marketplace.connect(buyer1).soldContractNFT(1)
    })

    // it("Reverted if buyer not closed agreement", async function(){
    //   const {farmNFT, agreementNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

    //   await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
    //   expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

    //   await farmNFT.connect(owner).approve(marketplace.address, 1);
    //   await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

    //   await marketplace.connect(buyer1).buyContract([1], ["TID1"])

    //   await expect(marketplace.connect(owner).soldContractNFT(1)).to.be.revertedWith("Only Buyer")
    // })

    it("Reverted if contract already closed", async function(){
      const {farmNFT, agreementNFT, marketplace, owner, farmer1, buyer1} = await loadFixture(deployNFT);

      await farmNFT.connect(owner).mint(farmer1.address, farm1IPFSURL);
      expect(await farmNFT.balanceOf(owner.address)).to.be.equal("1");

      await farmNFT.connect(owner).approve(marketplace.address, 1);
      await marketplace.connect(owner).putContractOnSell(farmer1.address, 1, 10, 1674181243, 1684549243, agreementIPFSURI);

      await marketplace.connect(buyer1).buyContract([1], ["TID1"])
      await marketplace.connect(buyer1).soldContractNFT(1)
      await expect(marketplace.connect(buyer1).soldContractNFT(1)).to.be.revertedWith("Not on sale")
    })
  })
});
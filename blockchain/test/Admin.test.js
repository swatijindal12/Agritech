const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
  
describe.skip("Admin", function () {
    async function deployNFT() {
      const [owner, farmer1, farmer2, buyer1] = await ethers.getSigners();
  
      const AdminContract = await ethers.getContractFactory("Admin");
      const adminContract = await AdminContract.deploy();

      return { adminContract, owner, farmer1, farmer2, buyer1 };
    }

    describe("Add Farmer", function () {
        it("only owner can add user", async function () {
          const { adminContract, owner, farmer1} = await loadFixture(deployNFT);
    
          await adminContract.connect(owner).addUser(farmer1.address, 0, "Lekhram", 
          "c/o Lekhram Nimbu Farms Kotputli - Delhi Highway, Rajasthan", "lyfsoul@gmail.com", 7048946004)

          console.log(await adminContract.userDetails(1))
        });
  
        it("Reverted if owner cannot add user", async function () {
          const { adminContract, owner, farmer1} = await loadFixture(deployNFT);
    
          await expect(adminContract.connect(farmer1).addUser(farmer1.address, 0, "Lekhram", 
          "c/o Lekhram Nimbu Farms Kotputli - Delhi Highway, Rajasthan", "lyfsoul@gmail.com", 7048946004)).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });


      describe("Add Buyer", function () {
        it("only owner can add user", async function () {
          const { adminContract, owner, buyer1} = await loadFixture(deployNFT);
    
          await adminContract.connect(owner).addUser(buyer1.address, 1, "Rajeev Kumar", "Noida", "ajeevk@halehitlabs.com", 9810006220);
        });
  
        it("Reverted if owner cannot add user", async function () {
          const { adminContract, owner, buyer1} = await loadFixture(deployNFT);
    
          await expect(adminContract.connect(buyer1).addUser(buyer1.address, 1, "Rajeev Kumar", "Noida", "ajeevk@halehitlabs.com", 9810006220)).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });
})
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect } = require('chai')
const { ethers, upgrades } = require('hardhat')


const farm1IPFSURL =
	'https://gateway.pinata.cloud/ipfs/QmXtaQiw3Z9m1cXpjUrwniTkGH8KUFat8icCUirRHg1KZu'
const farm2IPFSURL =
	'https://gateway.pinata.cloud/ipfs/QmeH8Cf6rypikXcpJDVT4oZBeA4JJ5EJv4nTV2yLKCTVa5'

const updateFarm1IPFSURL =
	'https://gateway.pinata.cloud/ipfs/QmT6iT1VnfyAx6h3s5i33r39Cuuijbt1FhRps1B27XjxuE'

describe('Farm NFT', function () {
	async function deployNFT() {
		const [owner, farmer1, farmer2, farmer3] = await ethers.getSigners()

		const FarmNFT = await ethers.getContractFactory('FarmNFT')
		const nftAddr = await upgrades.deployProxy(FarmNFT)

		await nftAddr.deployed()

		return { nftAddr, owner, farmer1, farmer2, farmer3 }
	}

	describe('Should check name & symbol', function () {
		it('Should equal to name of the NFT', async function () {
			const { nftAddr } = await loadFixture(deployNFT)

			expect(await nftAddr.name()).to.equal('FarmNFTToken')
		})

		it('Should equal to symbol of the NFT', async function () {
			const { nftAddr } = await loadFixture(deployNFT)
			expect(await nftAddr.symbol()).to.equal('FTK')
		})
	})

	describe('Mint NFT', function () {
		it('farmer1 mint NFT', async function () {
			const { nftAddr, farmer1, owner } = await loadFixture(deployNFT)
			await nftAddr.connect(owner).mint(farmer1.address, farm1IPFSURL)
			expect(await nftAddr.balanceOf(owner.address)).to.be.equal('1')
		})

		it('Farmer2 mint NFT', async function () {
			const { nftAddr, owner, farmer2 } = await loadFixture(deployNFT)
			await nftAddr.connect(owner).mint(farmer2.address, farm2IPFSURL)
			expect(await nftAddr.balanceOf(owner.address)).to.be.equal('1')
		})
	})

	describe('Get Farm list', function () {
		it('get token list of farmer1', async function () {
			const { nftAddr, farmer1, owner } = await loadFixture(deployNFT)
			await nftAddr.connect(owner).mint(farmer1.address, farm1IPFSURL)
			await nftAddr.connect(owner).mint(farmer1.address, 'Hello')
			const tokenList = await nftAddr.getFarmList(farmer1.address)
			expect(tokenList[0]).to.be.equal(1)
			expect(tokenList[1]).to.be.equal(2)
		})

		it('get token URI of token id1', async function () {
			const { nftAddr, farmer1, owner } = await loadFixture(deployNFT)
			await nftAddr.connect(owner).mint(farmer1.address, farm1IPFSURL)
			await nftAddr.connect(owner).mint(farmer1.address, 'Hello')
			expect(await nftAddr.tokenURI(1)).to.be.equal(farm1IPFSURL)
		})
	})

	describe('Modify Farm NFT', function () {
		it('If owner update farm NFT details', async function () {
			const { nftAddr, owner, farmer1 } = await loadFixture(deployNFT)

			await nftAddr.connect(owner).mint(farmer1.address, farm1IPFSURL)
			expect(await nftAddr.balanceOf(owner.address)).to.be.equal('1')
			expect(await nftAddr.tokenURI(1)).to.be.equal(farm1IPFSURL)

			await nftAddr.connect(owner).updateFarm(1, updateFarm1IPFSURL)
			expect(await nftAddr.tokenURI(1)).to.be.equal(updateFarm1IPFSURL)
		})

		it('reverted if farm nft not minted & owner try to update data', async function () {
			const { nftAddr, owner, farmer1 } = await loadFixture(deployNFT)

			await expect(
				nftAddr.connect(owner).updateFarm(1, updateFarm1IPFSURL)
			).to.be.revertedWith(
				'ERC721URIStorage: URI set of nonexistent token'
			)
		})
	})
})

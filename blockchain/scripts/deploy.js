// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

async function main() {
	const FarmNFT = await ethers.getContractFactory('FarmNFT')
	const farmNFT = await upgrades.deployProxy(FarmNFT)
	await farmNFT.deployed()

	const AgreementNFT = await ethers.getContractFactory('AgreementNFT')
	const agreementNFT = await upgrades.deployProxy(AgreementNFT)

	const MarketPlace = await ethers.getContractFactory('Marketplace')
	const marketplace = await upgrades.deployProxy(MarketPlace, [
		farmNFT.address,
		agreementNFT.address,
	])
	await farmNFT.deployed()
	await agreementNFT.deployed()
	await marketplace.deployed()

	console.log('Farm NFT deployed to', farmNFT.address)
	console.log('Agreement NFT deployed to', agreementNFT.address)
	console.log('Marketplace NFT deployed to', marketplace.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})

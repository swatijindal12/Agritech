const config = require('../hardhat.config')
const hre = require('hardhat')
async function main() {
	await config.getPrivateKey()
	hre.config.networks.matic.accounts = config.default.networks.matic.accounts
	hre.config.networks.matic.url = config.default.networks.matic.url
	// console.log('accounts value', hre.config.networks.matic, hre.config.networks.matic.url)

	const FarmNFT = await ethers.getContractFactory('FarmNFT')
	const farmNFT = await upgrades.deployProxy(FarmNFT)
	
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

	// await farmNFT.initialize()
	// await agreementNFT.initialize()
	// await marketplace.initialize(farmNFT.address, agreementNFT.address)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})

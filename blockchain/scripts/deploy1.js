const config = require('../hardhat.config')
const hre = require('hardhat')
const { upgrades } = require('hardhat')

async function main() {
	await config.getPrivateKey()
	hre.config.networks.matic.accounts = config.default.networks.matic.accounts
	// console.log('accounts value', hre.config.networks.matic)
	// console.log(
	// 	await upgrades.erc1967.getImplementationAddress(
	// 		'0xd5D440C0F688c040F094508259A2F2e7bFDE6560'
	// 	),
	// 	' getImplementationAddress'
	// )
	// console.log(
	// 	await upgrades.erc1967.getAdminAddress(
	// 		'0xd5D440C0F688c040F094508259A2F2e7bFDE6560'
	// 	),
	// 	' getAdminAddress'
	// )

	const AgreementNFT = await ethers.getContractFactory('AgreementNFT')

	let updateAgreementAdr = await upgrades.upgradeProxy(
		'0xFEaa4a8538812d4fEfd73AD97a109600F2a24548',
		AgreementNFT
	)

	
	const MarketPlace = await ethers.getContractFactory('Marketplace')
	const marketplace = await upgrades.upgradeProxy(
		'0xd0Dc414F9C407a165A229231dc2a55DF97150c9c',
		MarketPlace
	)
	
	await updateAgreementAdr.deployed()
	await marketplace.deployed()

	console.log('Agreement NFT deployed to', updateAgreementAdr.address)
	console.log('Marketplace NFT deployed to', marketplace.address)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})

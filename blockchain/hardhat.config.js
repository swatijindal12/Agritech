require('@nomicfoundation/hardhat-toolbox')
require('@openzeppelin/hardhat-upgrades')
require('dotenv').config()
const private_key = require('./awsKey')

const config = {
	solidity: '0.8.17',
	networks: {
		matic: {
			url: process.env.RPC_URL,
			accounts: [],
			chainId: Number(process.env.CHAIN_ID),
		},
	},
	etherscan: {
		apiKey: process.env.MATIC_API_KEY,
	},
	gasReporter: {
		enabled: true,
	},
}

async function getPrivateKey() {
	try {
		const privateKeyValue = await private_key.getEnvVariable()
		const MATIC_KEY = `0x${privateKeyValue['POLYGON_PRIVATE_KEY']}`
		const RPC_URL = `${process.env.RPC_URL}${privateKeyValue['ALCHEMY_KEY']}`

		config.networks.matic.accounts = [MATIC_KEY]
		config.networks.matic.url = [RPC_URL]
		// config.networks.matic.accounts.push(MATIC_KEY)
		// console.log(
		// 	'account address',
		// 	config.networks.matic.accounts,
		// 	config.networks.matic.url
		// )
	} catch (err) {
		console.log(err)
	}
}
module.exports = { getPrivateKey }

module.exports.default = config

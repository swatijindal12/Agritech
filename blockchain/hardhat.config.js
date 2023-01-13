require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
const MATIC_KEY = process.env.MATIC_PRIVATE_KEY
// console.log(MATIC_KEY)
module.exports = {
	solidity: '0.8.17',
	networks: {
		matic: {
			url: process.env.MUMBAI_RPC_URL,
			accounts: [`0x${MATIC_KEY}`],
			chainId: 80001,
		},
	},
	etherscan: {
		apiKey: process.env.MATIC_API_KEY, //for polygonscan (mumbai)
	},
}

//Farm NFT deployed to 0xb2114c3Bf73A88A75a13d02bA3AEFFb8b68F7757
// Agreement NFT deployed to 0x96531521cb47760d064bc2069b170A0B8CA2E614
// Marketplace NFT deployed to 0xa62d7d8b9F504452EE72FAd7B4F65D4381D05f3D

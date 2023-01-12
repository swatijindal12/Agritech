const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require('../models/users');

// Importig PinataSDK For IPFS
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });


// Import for Blockchain
const Web3 = require('web3');

const Private_Key = 'a91dc609634962d2316d3b6f01ce4ebcc6a0fe19b36c8ba5ce76f34bec7c8ac5';
const adminAddr = '0xB7D2FFB669a4F39d81aaF1E6A53708206C9b5795';
const farmNFTAddr = '0xD6c134D20E259E89005C46004180b29dA358EADa'
const farmNFTContractABI = [{ "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minterAddr", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "farmId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "farmerAddr", "type": "address" }], "name": "getFarmList", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "farmerAddr", "type": "address" }, { "internalType": "string", "name": "_tokenURI", "type": "string" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenArray", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const provider = new Web3.providers.WebsocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/k8eQGQDtTk8X8EyDrhxrQHeMsTXzVoUk");

const web3 = new Web3(provider);
const farmNFTContract = new web3.eth.Contract(farmNFTContractABI, farmNFTAddr);


exports.validate = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    if (!req.files || !req.files.file) {
        response.error = "no file selected";
        response.httpStatus = 400
    }
    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    if (data) {
        response.httpStatus = 200;
        response.data = data
    }
    return response;
}

exports.createFarmer = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    // Read Json file and then add it DB
    if (!req.files || !req.files.file) {
        response.error = "no file selected",
            response.httpStatus = 400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    Farmer.insertMany(data).then(function () {
        response.message = "Data Insertion successful",
            response.httpStatus = 200
        response.data = data
    }).catch(function (error) {
        response.message = `Insertion failed ${error}`,
            response.httpStatus = 400
    });

    return response
}

exports.getFarmers = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    let farmers;
    try {
        farmers = await Farmer.find().select('-__v');
        response.data = farmers,
            response.httpStatus = 200
    } catch (error) {
        response.error = "failed operation",
            response.httpStatus = 400
    }
    return response
}

exports.createCustomer = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    if (!req.files || !req.files.file) {
        response.error = "no file selected",
            response.httpStatus = 400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    User.insertMany(data).then(function () {
        response.message = "Data Insertion successful",
            response.httpStatus = 200
        response.data = data
    }).catch(function (error) {
        response.message = `Insertion failed ${error}`,
            response.httpStatus = 400
    });
    return response
}

exports.createFarm = async (req) => {
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    // Read Json file and then add it DB
    if (!req.files || !req.files.file) {
        response.error = 'no file selected',
        response.error = 400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    const updatedData = await Promise.all(data.map(async (farm, index) => {
        farm.ipfs_url = "";
        const options = {
            pinataMetadata: {
                name: farm.farmer_id.toString(),
            },
            pinataOptions: {
                cidVersion: 0,
            },
        };

        const ipfsHash = await pinata.pinJSONToIPFS(farm, options);
        farm.ipfs_url = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;

        //BlockChain ---------------------


        const farmerAddr = '0x9Ad7A54D8f4D2D2002a2761eaBE019e0916e1e2c' //wallet adres

        const gasLimit = await farmNFTContract.methods.mint(farmerAddr, `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`)
            .estimateGas({ from: adminAddr });

        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(2),
        );

        const encodedData = farmNFTContract.methods.mint(farmerAddr, `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`).encodeABI();

        const gasPrice = await web3.eth.getGasPrice();
        const transactionFee = parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString());

        console.log("transactionFee : ", transactionFee);

        const tx = {
            gas: web3.utils.toHex(bufferedGasLimit),
            to: farmNFTAddr,
            value: '0x00',
            data: encodedData,
            from: adminAddr,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
            tx,
            Private_Key,
        );
        console.log("signedTx : ", signedTx);

        const transaction = await web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
        )
        // console.log('Transaction : ', transaction);
        
        let farmnft_id=null;
        web3.eth.getBlockNumber().then(latestBlock => {
            farmNFTContract.getPastEvents('Mint', {
                fromBlock: latestBlock,
                toBlock: latestBlock
            }, function (error, events) {
                console.log(events[0]);
                const result = events[0].returnValues
                farmnft_id = result[1];
                 console.log("Fram Id", result[1])
                console.log("error :" , error);
            });
        });

        //BlockChain ---------------------
        // let farmnft_id = `sdjsdksSDFTSD532GSGDG${index}`;
        return { ...farm, farmnft_id: farmnft_id, user_id: farm.farmer_id };
    }));
    // return from api
    console.log("updatedData : ", updatedData);


    // Save Farm data in mongoDB , skip id,s.no key in json

    // try {
    //     const farms = await Farm.create(updatedData);
    //     console.log("farms : ", farms);
    //     if (farms.insertedCount === updatedData.length) {
    //         response.message = "Data Insertion successful",
    //         response.httpStatus = 200,
    //         response.data = updatedData
    //     } else {
    //         response.error = "Data Insertion failed duplicate data",
    //         response.httpStatus = 500
    //     }

    // } catch (error) {
    //     response.error = `Insertion failed ${error}`,
    //     response.httpStatus = 400
    // }

    if (updatedData) {
        response.message = "working",
        response.httpStatus = 200
        response.data = updatedData
    }

    return response
}

exports.getFarms = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    let farms;
    try {
        farms = await Farm.find().select('-__v');
        response.data = farms,
            response.httpStatus = 200
    } catch (error) {
        response.error = "failed operation",
            response.httpStatus = 400
    }
    return response
}
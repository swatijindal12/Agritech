const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require("../models/users");

// Importig PinataSDK For IPFS
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });

// Import for Blockchain
const Web3 = require("web3");
const farmNFTContractABI = require("../web3/farmContractABI");
// const mintFarm = require("../web3/mintFarm");

const Private_Key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;
const farmNFTAddr = process.env.FARM_NFT_ADDR;

const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL);

const web3 = new Web3(provider);
const farmNFTContract = new web3.eth.Contract(farmNFTContractABI, farmNFTAddr);

exports.validate = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  }
  // Read the contents of the file
  const fileContent = req.files.file.data.toString();

  // Parse the JSON data
  const data = JSON.parse(fileContent);

  if (data) {
    response.httpStatus = 200;
    response.data = data;
  }
  return response;
};

exports.createFarmer = async (req) => {
  console.log("createFarmer service :", createFarmer);
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Read Json file and then add it DB
  if (!req.files || !req.files.file) {
    (response.error = "no file selected"), (response.httpStatus = 400);
  }

  // Read the contents of the file
  const fileContent = req.files.file.data.toString();

  // Parse the JSON data
  const data = JSON.parse(fileContent);

  // Save Farm data in mongoDB , skip id,s.no key in json
  try {
    const farmers = await Farmer.create(data);
    console.log("farmers : ", farmers);
    if (farmers.length != 0) {
      response.message = "Data Insertion successful";
      response.httpStatus = 201;
      response.data = data;
    } else {
      (response.error = "Data Insertion failed, duplicate data"),
        (response.httpStatus = 500);
    }
  } catch (error) {
    (response.error = `Insertion failed ${error}`), (response.httpStatus = 400);
  }
  return response;
};

exports.getFarmers = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let farmers;
  try {
    farmers = await Farmer.find().select("-__v");
    (response.data = farmers), (response.httpStatus = 200);
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 400);
  }
  return response;
};

exports.createFarm = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  console.log("Inside createFarm services");

  // Read Json file and then add it DB
  if (!req.files || !req.files.file) {
    (response.error = "no file selected"), (response.error = 400);
  }

  // Read the contents of the file
  const fileContent = req.files.file.data.toString();

  // Parse the JSON data
  const data = JSON.parse(fileContent);

  const updatedData = await Promise.all(
    data.map(async (farm, index) => {
      farm.ipfs_url = "";

      // -------------- IPFS --------------------
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
      // -------------- IPFS --------------------
      return { ...farm, user_id: farm.farmer_id };
    })
  );

  // return from api
  // console.log("updatedData : ", updatedData);

  // BlockChain Start
  const mintPromises = [];
  for (let index = 0; index < updatedData.length; index++) {
    const farm = updatedData[index];
    farm.farm_nft_id = "";
    console.log(`ipfs ${index}:`, farm.ipfs_url);
    // BlockChain Start
    const farmerAddr = process.env.FARMER_ADDR; //wallet adres

    const gasLimit = await farmNFTContract.methods
      .mint(farmerAddr, `https://ipfs.io/ipfs/${farm.ipfs_url}`)
      .estimateGas({ from: adminAddr });

    const bufferedGasLimit = Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2)
    );

    const encodedData = farmNFTContract.methods
      .mint(farmerAddr, `https://ipfs.io/ipfs/${farm.ipfs_url}`)
      .encodeABI();

    const gasPrice = await web3.eth.getGasPrice();
    const transactionFee =
      parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString());

    console.log("transactionFee : ", transactionFee);

    const tx = {
      gas: web3.utils.toHex(bufferedGasLimit),
      to: farmNFTAddr,
      value: "0x00",
      data: encodedData,
      from: adminAddr,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key);
    console.log("signedTx : ", signedTx);

    const transaction = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log("Transaction : ", transaction);

    let farm_nft_id = null;
    const mintPromise = web3.eth.getBlockNumber().then((latestBlock) => {
      farmNFTContract.getPastEvents(
        "Mint",
        {
          fromBlock: latestBlock,
          toBlock: latestBlock,
        },
        function (error, events) {
          console.log(events[0]);
          const result = events[0].returnValues;
          farm_nft_id = result[1];
          console.log("Farm Id", result[1]);
          farm.farm_nft_id = result[1];
          console.log("error :", error);
        }
      );
    });
    mintPromises.push(mintPromise);
    // console.log("farmnft_id : ", farmnft_id);
  }
  await Promise.all(mintPromises);
  // BlockChain End

  console.log("updatedData 2 :- ", updatedData);

  // Save Farm data in mongoDB , skip id,s.no key in json

  try {
    const farms = await Farm.create(updatedData);
    console.log("farms : ", farms);
    if (farms.length != 0) {
      (response.message = "Data Insertion successful"),
        (response.httpStatus = 200),
        (response.data = updatedData);
    } else {
      (response.error = "Data Insertion failed duplicate data"),
        (response.httpStatus = 500);
    }
  } catch (error) {
    (response.error = `Insertion failed ${error}`), (response.httpStatus = 400);
  }

  return response;
};

exports.getFarms = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let farms;
  try {
    farms = await Farm.find().select("-__v");
    console.log("farms : ", farms);
    response.data = farms;
    response.httpStatus = 200;
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 400);
  }
  return response;
};

exports.createCustomer = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    (response.error = "no file selected"), (response.httpStatus = 400);
  }

  try {
    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    const customers = await User.create(data);
    const prvCustomers = await User.find();
    console.log("farms : ", customers);
    console.log("prvCustomers : ", prvCustomers);
    if (customers.length != 0 && customers != prvCustomers) {
      console.log("1");
      response.message = "Data Insertion successful";
      response.httpStatus = 200;
      response.data = data;
    } else {
      console.log("2");
      (response.error = "Data Insertion failed duplicate data"),
        (response.httpStatus = 500);
    }
  } catch (error) {
    console.log("3");
    (response.error = `Insertion failed ${error}`), (response.httpStatus = 400);
  }

  return response;
};

exports.getCustomers = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let customers;
  try {
    customers = await User.find().select("-__v");
    (response.data = customers), (response.httpStatus = 200);
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 400);
  }
  return response;
};

exports.getdashBoard = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: {
      farms: null,
      contracts: null,
      farmers: null,
      customers: null,
    },
  };

  try {
    const farms = await Farm.countDocuments();
    const farmers = await Farmer.countDocuments();
    const customers = await User.countDocuments();

    console.log("farms , farmers, customers :- ", farms, farmers, customers);
    (response.httpStatus = 200), (response.data.farmers = farmers);
    response.data.customers = customers;
    response.data.farms = farms;
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 500);
  }

  return response;
};

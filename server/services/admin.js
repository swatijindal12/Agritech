const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require("../models/users");
const Agreement = require("../models/agreements");
const StageAgreement = require("../models/stageAgreement");
const csvToJson = require("../utils/csvToJson");
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
  } else {
    // Read the contents of the file
    // const fileContent = req.files.file.data.toString(); //JSON DATA
    const file = req.files.file;
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
    const data = await csvToJson(file);
    const errorLines = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      for (const key in item) {
        if (item[key] === "farm_nft_id") {
          if (!isNaN(item[key])) {
            errorLines.push(i);
            break;
          }
        }
        if (item[key] === "farm_id") {
          if (!isNaN(item[key])) {
            errorLines.push(i);
            break;
          }
        }
        if (!item[key] || item[key].length < 1) {
          // console.log("check :- ");
          errorLines.push(i);
          break;
        }
      }
    }

    if (errorLines.length >= 1) {
      // There are error some lines missing data
      (response.httpStatus = 400), (response.error = errorLines);
    } else {
      // No error
      (response.httpStatus = 200), (response.message = "validation successful");
    }
    response.data = data;
  }
  return response;
};

exports.stagedAgreements = async (req) => {
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
  } else {
    try {
      const file = req.files.file;
      const data = await csvToJson(file);

      // Insert record into DB (stageAgreement)
      const stageAgreement = await StageAgreement.create(data);

      response.httpStatus = 200;
      response.message = "Insertion succeesful";
      response.data = stageAgreement;
    } catch (error) {
      response.error = `failed operation ${error}`;
      response.httpStatus = 500;
    }
  }
  return response;
};

exports.getStagedAgreements = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };
  try {
    // read the data {stage_status:true}, all the data in stage state
    const stageAgreementpending = await StageAgreement.find({
      stage_status: true,
      approval_status: false,
    }).select("-createdAt -updatedAt -__v");
    // Note :- while inserting update the status to approval_status true
    // if approval status true ,stage_staus:true means this data should be
    // inserted into the Agreement table.
    response.httpStatus = 200;
    response.data =
      stageAgreementpending.length > 1 ? stageAgreementpending : null;
  } catch (error) {
    response.error = `operation failed ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

exports.createFarmer = async (req) => {
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

  // Save Farm data in mongoDB , skip id,s.no key in json

  try {
    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    const farmers = await Farmer.create(data);

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
  const sortOrder = req.query.sortOrder;

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let farmers;
  try {
    if (sortOrder === "low") {
      farmers = await Farmer.find().sort({ rating: 1 }).select("-__v");
    } else if (sortOrder === "high") {
      farmers = await Farmer.find().sort({ rating: -1 }).select("-__v");
    } else if (sortOrder === undefined) {
      farmers = await Farmer.find().select("-__v");
    }
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

  // Read Json file and then add it DB
  if (!req.files || !req.files.file) {
    (response.error = "no file selected"), (response.error = 400);
  }

  // Read the contents of the file
  const fileContent = req.files.file.data.toString();

  // Parse the JSON data
  const data = JSON.parse(fileContent);
  console.log("data :", data);

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

  // BlockChain Start
  const mintPromises = [];
  const Tran = "https://mumbai.polygonscan.com/tx";
  for (let index = 0; index < updatedData.length; index++) {
    const farm = updatedData[index];
    farm.farm_nft_id = "";
    console.log(`ipfs ${index}:`, farm.ipfs_url);
    // BlockChain Start
    const farmerAddr = process.env.FARMER_ADDR; //wallet adres

    const gasLimit = await farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .estimateGas({ from: adminAddr });

    const bufferedGasLimit = Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2)
    );

    const encodedData = farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .encodeABI();

    const gasPrice = await web3.eth.getGasPrice();
    const transactionFee =
      parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString());

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
    // console.log("Transaction : ", transaction.transactionHash);
    console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
    farm.tx_hash = `${Tran}/${transaction.transactionHash}`;

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
  }
  await Promise.all(mintPromises);
  // BlockChain End

  // Save Farm data in mongoDB , skip id,s.no key in json

  try {
    const farms = await Farm.create(updatedData);

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
  const sortOrder = req.query.sortOrder;
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

    // sort based on rating.
    if (sortOrder === "low") {
      farms = await Farm.find().sort({ rating: 1 }).select("-__v");
    } else if (sortOrder === "high") {
      farms = await Farm.find().sort({ rating: -1 }).select("-__v");
    } else if (sortOrder === undefined) {
      farms = await Farm.find().select("-__v");
    }

    // filter based on crop types
    if (req.query.cropTypes) {
      let cropTypes = req.query.cropTypes.split(",");
      farms = farms.filter((farm) => {
        for (let i = 0; i < cropTypes.length; i++) {
          if (farm[cropTypes[i]] === true) {
            return true;
          }
        }
        return false;
      });
      response.data = farms;
      response.httpStatus = 200;
    } else {
      response.data = farms;
      response.httpStatus = 200;
    }
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

    if (customers.length != 0) {
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

exports.getAgreementsForAdmin = async (req) => {
  // console.log("Inside getAgreementsOfCustomer Service", req.user);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // // Grouping farm... for Admin to show in their active/close Tab
  try {
    const activeContractswithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          agreementclose_status: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer_data",
        },
      },
      {
        $group: {
          _id: {
            crop: "$crop",
            start_date: "$start_date",
            end_date: "$end_date",
            price: "$price",
            area: "$area",
            farm_id: "$farm_id",
            customer_id: "$customer_id",
          },
          address: { $first: "$address" },
          farmer_name: { $first: "$farmer_name" },
          agreements: { $push: "$_id" },
          ipfs_url: { $push: "$ipfs_url" },
          tx_hash: { $push: "$tx_hash" },
          agreement_nft_id: { $push: "$agreement_nft_id" },
          unit_bought: { $sum: 1 },
          customer_name: {
            $first: { $arrayElemAt: ["$customer_data.name", 0] },
          },
          customer_email: {
            $first: { $arrayElemAt: ["$customer_data.email", 0] },
          },
          customer_phone: {
            $first: { $arrayElemAt: ["$customer_data.phone", 0] },
          },
          customer_address: {
            $first: { $arrayElemAt: ["$customer_data.address", 0] },
          },
        },
      },
    ]);

    // const activeContractsWithCustomerData = await Agreement.aggregate([
    //   {
    //     $match: {
    //       sold_status: true,
    //       agreementclose_status: false,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$area",
    //       farmer_name: { $first: "$farmer_name" },
    //       farm_id: { $first: "$farm_id" },
    //       crop: { $first: "$crop" },
    //       address: { $first: "$address" },
    //       price: { $first: "$price" },
    //       start_date: { $first: "$start_date" },
    //       end_date: { $first: "$end_date" },
    //       agreements: { $push: "$_id" },
    //       customer_id: { $push: "$customer_id" },
    //       ipfs_url: { $push: "$ipfs_url" },
    //       tx_hash: { $push: "$tx_hash" },
    //       agreement_nft_id: { $push: "$agreement_nft_id" },
    //       unit_available: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "customer_id",
    //       foreignField: "_id",
    //       as: "customer_data",
    //     },
    //   },
    //   {
    //     $unwind: "$customer_data",
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       farmer_name: { $first: "$farmer_name" },
    //       farm_id: { $first: "$farm_id" },
    //       crop: { $first: "$crop" },
    //       address: { $first: "$address" },
    //       price: { $first: "$price" },
    //       start_date: { $first: "$start_date" },
    //       end_date: { $first: "$end_date" },
    //       agreements: { $first: "$agreements" },
    //       customer_id: { $first: "$customer_id" },
    //       ipfs_url: { $first: "$ipfs_url" },
    //       tx_hash: { $first: "$tx_hash" },
    //       agreement_nft_id: { $first: "$agreement_nft_id" },
    //       unit_available: { $first: "$unit_available" },
    //       customer_name: { $first: "$customer_data.name" },
    //       customer_phone: { $first: "$customer_data.phone" },
    //       customer_email: { $first: "$customer_data.email" },
    //       customer_address: { $first: "$customer_data.address" },
    //     },
    //   },
    // ]);

    const closeContractswithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          agreementclose_status: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer_data",
        },
      },
      {
        $group: {
          _id: {
            crop: "$crop",
            start_date: "$start_date",
            end_date: "$end_date",
            price: "$price",
            area: "$area",
            farm_id: "$farm_id",
            customer_id: "$customer_id",
          },
          address: { $first: "$address" },
          farmer_name: { $first: "$farmer_name" },
          agreements: { $push: "$_id" },
          ipfs_url: { $push: "$ipfs_url" },
          tx_hash: { $push: "$tx_hash" },
          agreement_nft_id: { $push: "$agreement_nft_id" },
          unit_bought: { $sum: 1 },
          customer_name: {
            $first: { $arrayElemAt: ["$customer_data.name", 0] },
          },
          customer_email: {
            $first: { $arrayElemAt: ["$customer_data.email", 0] },
          },
          customer_phone: {
            $first: { $arrayElemAt: ["$customer_data.phone", 0] },
          },
          customer_address: {
            $first: { $arrayElemAt: ["$customer_data.address", 0] },
          },
        },
      },
    ]);

    response.httpStatus = 200;
    response.data = {
      active: activeContractswithCustomerData,
      close: closeContractswithCustomerData,
    };
  } catch (error) {
    response.httpStatus = 400;
    response.error = "failed operation";
  }
  return response;
};

exports.closeAgreement = async (req) => {
  //console.log("Inside closeAgreement");
  const { id } = req.params; // Agreement Id agreement to Update
  //console.log("id :- ", id);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  try {
    // Update ageementClose status to true :-
    const agreementUpdated = await Agreement.updateOne(
      { _id: id },
      { agreementclose_status: true }
    );
    console.log("agreementUpdated :- ", agreementUpdated);
    response.message = "Agreement closed Successful";
    response.httpStatus = 200;
  } catch (error) {
    response.error = `failed operation ${error}`;
    response.httpStatus = 200;
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
    const agreements = await Agreement.countDocuments({ sold_status: false });
    (response.httpStatus = 200), (response.data.farmers = farmers);
    response.data.customers = customers;
    response.data.farms = farms;
    response.data.contracts = agreements;
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 500);
  }

  return response;
};

const Farmer = require("../models/farmers");
const Farm = require("../models/farms");

const StageAgreement = require("../models/stageAgreement");
const TestAgreement = require("../models/testAgreement");
const epocTimeConv = require("../utils/epocTimeConv");
const Agreement = require("../models/agreements");
const Web3 = require("web3");
const marketplaceContractABI = require("../web3/marketPlaceABI");
const farmNFTContractABI = require("../web3/farmContractABI");
const ENVIRONMENT = process.env.NODE_ENV.trim();

// Importig PinataSDK For IPFS
const pinataSDK = require("@pinata/sdk");
// const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });
const { getKeyFromAWS } = require("../config/awsParamsFetcher");
const { logger } = require("../utils/logger");
const { errorLog } = require("../utils/commonError");

let pinata = "";

// Initialize the pinata object using an asynchronous IIFE
(async () => {
  pinata = new pinataSDK({
    pinataJWTKey: await getKeyFromAWS("IPFS_BEARER_TOKEN"),
  });
})();

// Importing for Blockchain
// const Private_Key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;
const farmNFTAddr = process.env.FARM_NFT_ADDR;
const marketplaceAddr = process.env.MARKETPLACE_ADDR;

// const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL);
// const web3 = new Web3(provider);

//--------
let web3;
let marketplaceContract;
let farmNFTContract;
const newProvider = async () => {
  const ALCHEMY_KEY = await getKeyFromAWS("ALCHEMY_KEY");
  const provider = new Web3.providers.WebsocketProvider(
    `${process.env.ALCHEMY_CONN_URL}/${ALCHEMY_KEY}`,
    {
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false,
      },
    }
  );
  web3 = new Web3(provider);

  farmNFTContract = new web3.eth.Contract(farmNFTContractABI, farmNFTAddr);

  marketplaceContract = new web3.eth.Contract(
    marketplaceContractABI,
    marketplaceAddr
  );
};

newProvider();

//--------

exports.getFarmById = async (req) => {
  const { id } = req.params;

  // id of the farm
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Find the farm By farm id
  try {
    const farm = await Farm.findOne({ _id: id });
    const farmer = await Farmer.findOne({ _id: farm.farmer_id });
    response.httpStatus = 200;
    response.data = {
      farm,
      farmer,
    };
  } catch (error) {
    response.httpStatus = 404;
    response.error = "Not found";
  }

  return response;
};

// Get all the active and close agreement of customer
exports.getAgreementsOfCustomer = async (req) => {
  const userId = req.user._id; // User Logged In.
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // // Grouping farm... for customer to show in their active/close Tab
  try {
    const activeContractsWithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          customer_id: userId,
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
      {
        $sort: {
          "_id.start_date": 1,
          "_id.crop": 1,
        },
      },
    ]);

    const activeContractsWithCustomerDataTest = await TestAgreement.aggregate([
      {
        $match: {
          sold_status: true,
          customer_id: userId,
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
      {
        $sort: {
          "_id.start_date": 1,
          "_id.crop": 1,
        },
      },
    ]);

    const closeContractsWithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          customer_id: userId,
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

    const closeContractsWithCustomerDataTest = await TestAgreement.aggregate([
      {
        $match: {
          sold_status: true,
          customer_id: userId,
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

    if (ENVIRONMENT == "beta") {
      const concatTestAndRealActive = activeContractsWithCustomerData.concat(
        activeContractsWithCustomerDataTest
      );
      const concatTestAndRealClose = closeContractsWithCustomerData.concat(
        closeContractsWithCustomerDataTest
      );
      response.data = {
        active: concatTestAndRealActive,
        close: concatTestAndRealClose,
      };
    } else {
      response.data = {
        active: activeContractsWithCustomerData,
        close: closeContractsWithCustomerData,
      };
    }
    response.httpStatus = 200;
    logger.log("info", "Data fetch is successful");
  } catch (error) {
    response.httpStatus = 400;
    response.error = "failed operation";
    errorLog(req, error);
  }

  return response;
};

exports.createAgreement = async (req) => {
  console.log("Inside createAgreement beta test");
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Checking password header
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password
  // Getting private From aws params store
  const Private_Key = await getKeyFromAWS("POLYGON_PRIVATE_KEY"); //

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    logger.log("info", "Invalid password");
    return response;
  }

  try {
    const data = req.body;

    /* NOTE:- first update in stagetable to  (stage_status:false, aprroval_status:true)
     stage_status: false & approval_staus: false:- will not show in review list
     stage_status: true & approval_status: false :- will show in rejected list */

    const farm = await Farm.findOne({ farm_id: data.farm_id });
    // const agreement = await Agreement.findOne({ _id: data._id })

    // // Read the req.body and add ipfs_url to json data
    const updatedData = await Promise.all(
      data.map(async (contract) => {
        const {
          file_name,
          farmer_name,
          address,
          agreement_nft_id,
          tx_hash,
          farm_nft_id,
          price,
          ipfs_url,
          createdAt,
          updatedAt,
          __v,
          ...rest
        } = contract;
        rest.farmer_id = farm.farmer_id;
        rest.location = farm.location;
        rest.customer_id = "null";
        rest.sold_status = "false";
        rest.agreementclose_status = "false";

        await StageAgreement.updateOne(
          { _id: contract._id },
          { stage_status: false, approval_status: true }
        );
        contract.ipfs_url = "";

        // -------------- IPFS --------------------
        const options = {
          pinataMetadata: {
            name: contract.farm_nft_id.toString(),
          },
          pinataOptions: {
            cidVersion: 0,
          },
        };

        const ipfsHash = await pinata.pinJSONToIPFS(rest, options);
        contract.ipfs_url = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;
        // -------------- IPFS --------------------
        return { ...contract };
      })
    );

    // Blockchain Integration
    const mintPromises = [];
    const Tran = process.env.POLYGON_TRAN_URL;
    for (let index = 0; index < updatedData.length; index++) {
      const contract = updatedData[index];
      contract.agreement_nft_id = "";
      // console.log("Single contract: ", contract);
      const farmerAddr = process.env.FARMER_ADDR;

      const start_date = epocTimeConv(contract.start_date);
      const end_date = epocTimeConv(contract.end_date);
      const gasLimit = await marketplaceContract.methods
        .putContractOnSell(
          farmerAddr,
          contract.farm_nft_id,
          contract.price,
          start_date,
          end_date,
          contract.ipfs_url
        )
        .estimateGas({ from: adminAddr });

      // console.log(gasLimit);

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2)
      );

      // console.log("bufferedGasLimit", bufferedGasLimit);
      const sell = marketplaceContract.methods
        .putContractOnSell(
          farmerAddr,
          contract.farm_nft_id,
          contract.price,
          start_date,
          end_date,
          contract.ipfs_url
        )
        .encodeABI();

      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: marketplaceAddr,
        value: "0x00",
        data: sell,
        from: adminAddr,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key);

      const transaction = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
      contract.tx_hash = `${Tran}/${transaction.transactionHash}`;

      // console.log(await web3.eth.getBlockNumber());
      let agreement_nft_id = null;
      const mintPromise = web3.eth
        .getBlockNumber()
        .then((latestBlock) => {
          return new Promise((resolve, reject) => {
            marketplaceContract.getPastEvents(
              "Sell",
              {
                fromBlock: latestBlock,
                toBlock: latestBlock,
              },
              function (error, events) {
                if (error) {
                  reject(error);
                } else if (events.length > 0) {
                  const result = events[0].returnValues;
                  agreement_nft_id = result[2];
                  contract.agreement_nft_id = result[2];
                  resolve(contract);
                } else {
                  resolve(contract);
                }
              }
            );
          });
        })
        .catch((error) => {
          response.error = `failed operation ${error}`;
          response.httpStatus = 400;
          errorLog(req, error);
        });
      mintPromises.push(mintPromise);
    }
    await Promise.all(mintPromises);

    // BlockChain end

    // updating in stage table and giving data to agreement collection to insert.

    let agreements = null;

    if (ENVIRONMENT == "beta") {
      agreements = await TestAgreement.create(updatedData, {
        select: `-_id -stage_status -approval_status -file_name`,
      });
    } else {
      agreements = await Agreement.create(updatedData, {
        select: `-_id -stage_status -approval_status -file_name`,
      });
    }
    // Removing from staging stable
    await StageAgreement.deleteMany({
      _id: { $in: data.map((contr) => contr._id) },
      stage_status: false,
    });

    response.message = "Data Insertion successful";
    response.httpStatus = 200;
    response.data = agreements;
    logger.log("info", "Data Insertion successful");
  } catch (error) {
    response.error = `operation failed  ${error}`;
    response.httpStatus = 500;
    errorLog(req, error);
  }

  return response;
};

//market place for customer as well as buyer
exports.getAgreements = async (req) => {
  const searchString = req.query.search;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    let match = { sold_status: false };

    let searchQuery = {};
    if (searchString) {
      searchQuery["$or"] = [
        { farmer_name: { $regex: new RegExp(searchString, "i") } },
        { crop: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    match = { $and: [match, searchQuery] };

    const realContractResult = await Agreement.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            crop: "$crop",
            start_date: "$start_date",
            end_date: "$end_date",
            price: "$price",
            area: "$area",
            farm_id: "$farm_id",
          },
          address: { $first: "$address" },
          farmer_name: { $first: "$farmer_name" },
          agreements: { $push: "$_id" },
          ipfs_url: { $push: "$ipfs_url" },
          tx_hash: { $push: "$tx_hash" },
          agreement_nft_id: { $push: "$agreement_nft_id" },
          unit_available: { $sum: 1 },
        },
      },
      {
        $match: { farmer_name: { $exists: true } }, // only include documents with farmer_name
      },
      {
        $sort: {
          "_id.start_date": 1,
          "_id.crop": 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const testContractResult = await TestAgreement.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            crop: "$crop",
            start_date: "$start_date",
            end_date: "$end_date",
            price: "$price",
            area: "$area",
            farm_id: "$farm_id",
          },
          address: { $first: "$address" },
          farmer_name: { $first: "$farmer_name" },
          agreements: { $push: "$_id" },
          ipfs_url: { $push: "$ipfs_url" },
          tx_hash: { $push: "$tx_hash" },
          agreement_nft_id: { $push: "$agreement_nft_id" },
          unit_available: { $sum: 1 },
        },
      },
      {
        $match: { farmer_name: { $exists: true } }, // only include documents with farmer_name
      },
      {
        $sort: {
          "_id.start_date": 1,
          "_id.crop": 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    if (ENVIRONMENT == "beta") {
      const combinedResult = realContractResult[0].data.concat(
        testContractResult[0].data
      );

      response.data = {
        data: combinedResult,
        totalPages:
          Math.ceil(
            realContractResult[0].metadata[0].total / limit +
              testContractResult[0].metadata[0].total / limit
          ) - 1,
      };
    } else {
      response.data = {
        data: realContractResult[0].data,
        totalPages: Math.ceil(realContractResult[0].metadata[0].total / limit),
      };
    }

    response.httpStatus = 200;
    logger.log("info", "Data fetch is successful");
  } catch (err) {
    response.error = "failed operation";
    errorLog(req, err);
  }

  return response;
};

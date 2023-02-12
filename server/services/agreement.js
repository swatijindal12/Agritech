const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require("../models/users");
const Cart = require("../models/cart");
const StageAgreement = require("../models/stageAgreement");
const epocTimeConv = require("../utils/epocTimeConv");
const Agreement = require("../models/agreements");
const Web3 = require("web3");
const marketplaceContractABI = require("../web3/marketPlaceABI");
const farmNFTContractABI = require("../web3/farmContractABI");
const csvToJson = require("../utils/csvToJson");
// Importig PinataSDK For IPFS
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });

// Importing for Blockchain
const Private_Key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;
const farmNFTAddr = process.env.FARM_NFT_ADDR;
const marketplaceAddr = process.env.MARKETPLACE_ADDR;

const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL);
const web3 = new Web3(provider);
const farmNFTContract = new web3.eth.Contract(farmNFTContractABI, farmNFTAddr);
const marketplaceContract = new web3.eth.Contract(
  marketplaceContractABI,
  marketplaceAddr
);

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
    const farm = await Farm.findOne({ farmer_id: id });
    const farmer = await Farmer.findOne({ farmer_id: id });
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
    // const activeContractsOfCustomer = await Agreement.aggregate([
    //   {
    //     $match: {
    //       sold_status: true,
    //       customer_id: userId,
    //       agreementclose_status: false,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         crop: "$crop",
    //         start_date: "$start_date",
    //         end_date: "$end_date",
    //         price: "$price",
    //         area: "$area",
    //         farm_id: "$farm_id",
    //       },
    //       address: { $first: "$address" },
    //       farmer_name: { $first: "$farmer_name" },
    //       agreements: { $push: "$_id" },
    //       ipfs_url: { $push: "$ipfs_url" },
    //       tx_hash: { $push: "$tx_hash" },
    //       agreement_nft_id: { $push: "$agreement_nft_id" },
    //       unit_bought: { $sum: 1 },
    //     },
    //   },
    // ]);

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

    response.httpStatus = 200;
    response.data = {
      active: activeContractsWithCustomerData,
      close: closeContractsWithCustomerData,
    };
  } catch (error) {
    response.httpStatus = 400;
    response.error = "failed operation";
  }

  return response;
};

// Creating Agreement Bulk Import.. On Upload.
exports.createAgreement = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // if (!req.files || !req.files.file) {
  //   response.error = "no file selected";
  //   response.httpStatus = 400;
  // }

  try {
    // const fileContent = req.files.file.data.toString(); //For JSON.
    // const file = req.files.file;
    // // Convert to the JSON data
    // const data = await csvToJson(file);
    const data = req.body;
    console.log("data :- ", data);

    /* NOTE:- first update in stagetable to  (stage_status:false, aprroval_status:true)
     stage_status: false & approval_staus: false:- will not show in review list
     stage_status: true & approval_status: false :- will show in rejected list */

    // // Parse the JSON data
    // const data = JSON.parse(fileContent); //For JSON.

    // Read the req.body and add ipfs_url to json data
    const updatedData = await Promise.all(
      data.map(async (contract) => {
        await StageAgreement.updateOne(
          { _id: contract._id, stage_status: true, approval_status: false },
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

        const ipfsHash = await pinata.pinJSONToIPFS(contract, options);
        contract.ipfs_url = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;
        // -------------- IPFS --------------------
        return { ...contract };
      })
    );

    // Blockchain Integration
    const mintPromises = [];
    const Tran = "https://mumbai.polygonscan.com/tx";
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
      const mintPromise = web3.eth.getBlockNumber().then((latestBlock) => {
        marketplaceContract.getPastEvents(
          "Sell",
          {
            fromBlock: latestBlock,
            toBlock: latestBlock,
          },
          function (error, events) {
            const result = events[0].returnValues;
            // console.log("result : - ", result);
            agreement_nft_id = result[2];
            // console.log("agreement_nft_id :- ", agreement_nft_id);
            contract.agreement_nft_id = result[2];
            // console.log(events[0]);
          }
        );
      });
      mintPromises.push(mintPromise);
    }
    await Promise.all(mintPromises);
    // BlockChain end

    // Validating this Before Inserting..

    // updating in stage table and giving data to agreement collection to insert.

    const agreements = await Agreement.create(updatedData, {
      select: `-_id -stage_status -approval_status -file_name`,
    });
    (response.message = "Data Insertion successful"),
      (response.httpStatus = 200),
      (response.data = agreements);
  } catch (error) {
    response.error = `operation failed  ${error}`;
    response.httpStatus = 500;
  }

  return response;
};

// Marketplace both customer & admin
exports.getAgreements = async (req) => {
  // const searchString = req.query.search;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  try {
    const result = await Agreement.aggregate([
      {
        $match: {
          sold_status: false,
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
          unit_available: { $sum: 1 },
        },
      },
    ]);
    // console.log("Result: ", result);
    response.data = result;
    response.httpStatus = 200;
  } catch (err) {
    response.error = "failed operation";
    response.httpStatus = 500;
  }

  return response;
};

exports.addToCart = async (req) => {
  console.log("Inside addToCart service");
  const id = req.user._id.toString();
  const agreementIds = req.body.agreementIds;
  const unitPrice = req.body.unit_price;

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Logic for Creating Cart Start ...
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: id });
    if (!cart) {
      // If the cart doesn't exist, create a new one
      const newCart = new Cart({
        userId: id,
        items: [
          {
            agreementIds: agreementIds,
            unit_price: unit_price,
          },
        ],
      });

      await newCart.save();
      response.message = "Item added to cart";
      response.httpStatus = 200;
    } else {
      // If the cart exists, check if the item is already in the cart
      const itemIndex = cart.items.findIndex((item) => {
        return item.productId === req.body.productId;
      });

      if (itemIndex === -1) {
        // If the item is not in the cart, add it
        cart.items.push({
          productId: req.body.productId,
        });
        await cart.save();
        response.message = "Item added to cart";
        response.httpStatus = 200;
      } else {
        response.message = "Item is Already in cart";
        response.httpStatus = 200;
      }
      // else {  // if quantity is included for contracts/product.
      //   // If the item is already in the cart, update the quantity
      //   cart.items[itemIndex].quantity += req.body.quantity;
      //   await cart.save();
      //   res.json({ message: "Item quantity updated" });
      // }
    }
  } catch (err) {
    response.message = err.message;
    response.httpStatus = 500;
  }
  return response;
};

exports.removeFromCart = async (req) => {
  console.log("Inside removeFromCart service");
  const id = req.user._id.toString();
  console.log("user.id modifies :- ", id);
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.body.userId });
    if (!cart) {
      (response.message = "Cart not found"), (response.httpStatus = 200);
    } else {
      // Find the item in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === req.body.productId
      );
      if (itemIndex === -1) {
        (response.message = "Item not found in cart"),
          (response.httpStatus = 200);
      } else {
        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();
        (response.message = "Item removed from cart"),
          (response.httpStatus = 200);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  (response.message = "RemoveFromCart Working ... "),
    (response.httpStatus = 200);
  return response;
};

exports.getCart = async (req) => {
  console.log("Inside getCart service");
  const id = req.user._id.toString();
  console.log("user.id modifies :- ", id);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      response.message = "Cart not found";
      response.httpStatus = 404;
    } else {
      response.httpStatus = 200;
      response.data = cart;
    }
  } catch (err) {
    response.httpStatus = 500;
    response.message = err.message;
  }

  (response.message = "getCart Working ... "), (response.httpStatus = 200);
  return response;
};

const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require("../models/users");
const Cart = require("../models/cart");
const epocTimeConv = require("../utils/epocTimeConv");
const Agreement = require("../models/agreements");
const Web3 = require("web3");
const marketplaceContractABI = require("../web3/marketPlaceABI");
const farmNFTContractABI = require("../web3/farmContractABI");

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

// Creating Agreement Bulk Import
exports.createAgreement = async (req) => {
  console.log("Inside create Agreement service");
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

  const fileContent = req.files.file.data.toString();

  // Parse the JSON data
  const data = JSON.parse(fileContent);

  // console.log("data :", data);
  // Read the contents of the file
  const updatedData = await Promise.all(
    data.map(async (contract) => {
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

  // console.log("updated data :", updatedData);
  // console.log("length", updatedData.length);

  const mintPromises = [];
  const Tran = "https://mumbai.polygonscan.com/tx";
  for (let index = 0; index < 11; index++) {
    const contract = updatedData[index];
    contract.agreement_nft_id = "";
    console.log("Single contract: ", contract);
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

    console.log(gasLimit);

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
    console.log(gasPrice);

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
    // console.log("Transaction : ", transaction);

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
          console.log("result : - ", result);
          agreement_nft_id = result[2];
          // console.log("agreement_nft_id :- ", agreement_nft_id);
          contract.agreement_nft_id = result[2];
          console.log("contract :", contract);
          // console.log(events[0]);
        }
      );
    });
    mintPromises.push(mintPromise);
  }
  await Promise.all(mintPromises);
  // Blockchain Integration

  // BlockChain end

  try {
    console.log("start inserting...");
    const agreements = await Agreement.create(updatedData);
    console.log("agreements :- ", agreements);
    (response.message = "Data Insertion successful"),
      (response.httpStatus = 200),
      (response.data = agreements);
  } catch (error) {
    response.message = `operation failed try 1 ${error}`;
    response.httpStatus = 500;
  }

  return response;
};

// Marketplace
exports.getAgreements = async (req) => {
  console.log("Inside get agreement server");
  const searchString = req.query.search;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let agreements;
  try {
    agreements = await Agreement.find().select("-__v");
    console.log("agreements : ", agreements);

    if (!searchString) {
      const groupedFarms = agreements.reduce((result, agreement) => {
        const key =
          agreement.farmer_name +
          agreement.farm_id +
          agreement.farm_nft_id +
          agreement.area +
          agreement.crop +
          agreement.address;
        if (!result[key]) {
          result[key] = {
            farmer_name: agreement.farmer_name,
            farm_id: agreement.farm_id,
            area: agreement.area,
            crop: agreement.crop,
            address: agreement.address,
            price: agreement.price,
            agreements: new Set([agreement._id]),
            ipfs_url: new Set([agreement.ipfs_url]),
            tx_hash: new Set([agreement.tx_hash]),
            agreement_nft_id: new Set([agreement.agreement_nft_id]),
            unit_available: 1,
          };
        } else {
          result[key].agreements.add(agreement._id);
          result[key].ipfs_url.add(agreement.ipfs_url);
          result[key].tx_hash.add(agreement.tx_hash);
          result[key].agreement_nft_id.add(agreement.agreement_nft_id);
          result[key].unit_available += 1;
        }
        return result;
      }, {});
      response.data = Object.values(groupedFarms);
      response.httpStatus = 200;
    } else {
      // Filtering on basing of SearchString.
      const filteredAgreement = agreements.filter((agreement) =>
        agreement.farmer_name.toLowerCase().includes(searchString.toLowerCase())
      );
      response.data = filteredAgreement;
      response.httpStatus = 200;
    }
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 500);
  }
  return response;
};

exports.addToCart = async (req) => {
  console.log("Inside addToCart service");
  const id = req.user._id.toString();
  console.log("user.id modifies :- ", id);
  console.log("ProductId :- ", req.body.productId);
  const productId = req.body.productId;

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Logic for Creating Cart Start ...
  try {
    console.log("Inside TRY");
    // Find the user's cart
    const cart = await Cart.findOne({ userId: id });
    if (!cart) {
      console.log("Inside IF card check");
      // If the cart doesn't exist, create a new one
      const newCart = new Cart({
        userId: id,
        items: [
          {
            productId: productId,
          },
        ],
      });
      console.log("newCart : ", newCart);
      await newCart.save();
      response.message = "Item added to cart";
      response.httpStatus = 200;
    } else {
      console.log("Inside ELSE card check", cart);
      // If the cart exists, check if the item is already in the cart
      const itemIndex = cart.items.findIndex((item) => {
        console.log("item : ", item);
        return item.productId === req.body.productId;
      });
      console.log("itemIndex", itemIndex);
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
    console.log("Inside catch");
    response.message = err.message;
    response.httpStatus = 500;
  }

  // Logic for Creating Cart End ...

  // (response.message = "addToCart working ..."), (response.httpStatus = 200);
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

const Web3 = require("web3");
const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Agreement = require("../models/agreements");
const crypto = require("crypto");
const Farm = require("../models/farms");

// Importig PinataSDK For IPFS
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });

//Import Blockchain
const marketplaceContractABI = require("../web3/marketPlaceABI");
const marketplaceAddr = process.env.MARKETPLACE_ADDR;
const private_key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;

const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL);
const web3 = new Web3(provider);

const marketplaceContract = new web3.eth.Contract(
  marketplaceContractABI,
  marketplaceAddr
);

// Creating RazorPay Instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.getKeyId = async (req) => {
  console.log("getKeyId services ");
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };
  response.httpStatus = 200;
  response.data = process.env.RAZORPAY_KEY_ID;

  return response;
};

// create service
exports.createOrder = async (req) => {
  console.log("CreateOrder services ");
  const agreements = req.body.agreements;
  const price = req.body.price;
  const length = agreements.length;

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  try {
    const options = {
      amount: Number(price * 100), // Total amount passed.
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    console.log("Order :- ", order);

    // Inserting orderDetail in Order table
    const orderCreated = await Order.create({
      customer_id: req.user._id,
      razorpay_order_id: order.id,
      amount: price,
      currency: "INR",
    });
    // const orderCreatedId = orderCreated.id;
    console.log("orderCreatedId :- ", orderCreated);

    // Inserting Data into OrderItem Table
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < agreements[i].agreement_ids.length; j++) {
        const unit_price = agreements[i].unit_price;

        // Insert the Data in orderItem Table.
        await OrderItem.create({
          order_id: orderCreated._id,
          agreement_id: agreements[i].agreement_ids[j],
          unit: req.body.unit,
          price: unit_price,
        });
      }
    }

    response.message = `Order created successful`;
    response.httpStatus = 200;
    response.data = order;
  } catch (error) {
    response.message = `Failed operation ${error}`;
    response.httpStatus = 500;
  }

  return response;
};

// Verify Service for RazorPay
exports.paymentVerification = async (req) => {
  const userId = req.user._id;
  const keyDetails = process.env.KEY_DETAILS;

  let filterUser = JSON.parse(keyDetails).filter(function (user) {
    return user.user_id === userId.toString();
  });
  // console.log("filterUser", filterUser);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    Order.findOne({ razorpay_order_id })
      .then(async (order_id) => {
        if (order_id) {
          const id = order_id._id;

          // find the agreement and update its sold_status to true.
          // Query in Order_Item table
          const order_items = await OrderItem.find({ order_id: id });

          for (let i = 0; i < order_items.length; i++) {
            await Agreement.updateOne(
              { _id: order_items[i].agreement_id },
              { sold_status: true, customer_id: userId } // change Made
            );
            let single_agreement = await Agreement.findOne({
              _id: order_items[i].agreement_id,
            });

            // // handling if it is already bought
            // if (single_agreement.sold_status) {
            //   response.error = "Sorry , agreement already bought";
            //   response.httpStatus = 500;
            //   return response;
            // }
            const Agreement_nft_id = single_agreement.agreement_nft_id;
            //Finding associated Farm
            const farm = await Farm.findOne({ _id: single_agreement.farm_id });

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
            } = single_agreement._doc;

            rest.farm_id = farm._id;
            rest.farmer_id = farm.farmer_id;
            rest.location = farm.location;

            //Buyers detail Update in IPFS_URL
            // Create New Ipfs_url
            const options = {
              pinataMetadata: {
                name: single_agreement.farm_id.toString(),
              },
              pinataOptions: {
                cidVersion: 0,
              },
            };

            // console.log("REST : ", rest);

            // const ipfsHash = await pinata.pinJSONToIPFS(
            //   { ...rest, user_id: userId },
            //   options
            // );
            //Remove user_id:UserId
            const ipfsHash = await pinata.pinJSONToIPFS({ ...rest }, options);
            const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;

            single_agreement.ipfs_url = ipfs_hash;
            await single_agreement.save();

            ///

            // Blockchain Transaction start ...
            const buyerAddr = process.env.BUYER_ADDR;
            // const privateKeyBuyer = filterUser[0].private_key;
            const gasLimit = await marketplaceContract.methods
              .buyContract(buyerAddr, [Agreement_nft_id], razorpay_payment_id, [
                ipfs_hash,
              ])
              .estimateGas({ from: adminAddr });

            const bufferedGasLimit = Math.round(
              Number(gasLimit) + Number(gasLimit) * Number(0.2)
            );

            const sell = await marketplaceContract.methods
              .buyContract(buyerAddr, [Agreement_nft_id], razorpay_payment_id, [
                ipfs_hash,
              ])
              .encodeABI();

            // const gasPrice = await web3.eth.getGasPrice();

            const tx = {
              gas: web3.utils.toHex(bufferedGasLimit),
              to: marketplaceAddr,
              value: "0x00",
              data: sell,
              from: adminAddr,
            };

            const signedTx = await web3.eth.accounts.signTransaction(
              tx,
              private_key
            );

            const transaction = await web3.eth.sendSignedTransaction(
              signedTx.rawTransaction
            );

            console.log(await web3.eth.getBlockNumber());
            web3.eth.getBlockNumber().then((latestBlock) => {
              marketplaceContract.getPastEvents(
                "Buy",
                {
                  fromBlock: latestBlock,
                  toBlock: latestBlock,
                },
                function (error, events) {
                  // console.log(events[0]);
                  if (error) {
                    console.log("BlockchainError", error);
                  }
                }
              );
            });

            // BlockChain Transaction End ...
          }
          await Payment.create({
            order_id: id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_payment_signature: razorpay_signature,
            payment_status: true,
          });
        } else {
          response.error = "No order found";
          response.httpStatus = 404;
          return response;
        }
      })
      .catch((err) => {
        response.message = `failed operation ${err}`;
        response.httpStatus = 500;
        return response;
      });
    response.message = `Payment Successful`;
    response.httpStatus = 200;
    response.data = razorpay_payment_id;
  } else {
    response.error = "Payment failed";
    response.httpStatus = 500;
    return response;
  }

  return response;
};

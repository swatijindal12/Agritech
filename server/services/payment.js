const Web3 = require("web3");
const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Agreement = require("../models/agreements");
const crypto = require("crypto");
const Farm = require("../models/farms");
const { getKeyFromAWS } = require("../config/awsParamsFetcher");
const emailTransporter = require("../utils/emailTransporter");
const { logger } = require("../utils/logger");
const { errorLog } = require("../utils/commonError");

// Importig PinataSDK For IPFS
const pinataSDK = require("@pinata/sdk");
// const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });

let pinata = "";
let instance = "";

// Initialize the pinata and instance object RazorPay using an asynchronous IIFE
// Creating RazorPay Instance
(async () => {
  pinata = new pinataSDK({
    pinataJWTKey: await getKeyFromAWS("IPFS_BEARER_TOKEN"),
  });
  instance = new Razorpay({
    key_id: `${await getKeyFromAWS("RAZORPAY_KEY_ID")}`,
    key_secret: await getKeyFromAWS("RAZORPAY_SECRET_KEY"),
  });
})();

// web3 object here
let web3;
let marketplaceContract;
const newProvider = async () => {
  const ALCHEMY_KEY = await getKeyFromAWS("ALCHEMY_KEY");
  const provider = new Web3.providers.WebsocketProvider(
    `wss://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
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
  marketplaceContract = new web3.eth.Contract(
    marketplaceContractABI,
    marketplaceAddr
  );
};

newProvider();

//Import Blockchain
const marketplaceContractABI = require("../web3/marketPlaceABI");
const marketplaceAddr = process.env.MARKETPLACE_ADDR;
// const Private_Key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;

// const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL);
// const web3 = new Web3(provider);

exports.getKeyId = async (req) => {
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

    // Inserting orderDetail in Order table
    const orderCreated = await Order.create({
      customer_id: req.user._id,
      razorpay_order_id: order.id,
      amount: price,
      currency: "INR",
    });
    // const orderCreatedId = orderCreated.id;
    // console.log("orderCreatedId :- ", orderCreated);

    // Inserting Data into OrderItem Table
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < agreements[i].agreement_ids.length; j++) {
        const unit_price = agreements[i].unit_price;

        // find the agreement and check for sold_status
        const agreement = await Agreement.findOne({
          _id: agreements[i].agreement_ids[j],
        });

        if (agreement && agreement.sold_status) {
          response.error = `Some contract are already bought, add contract again to cart by removing #${agreement.agreement_nft_id}`;
          response.httpStatus = 500;
          return response;
        }
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
    logger.log("info", "Order created successful");
  } catch (error) {
    console.log("error", error);
    response.message = `Failed operation 2${error}`;
    response.httpStatus = 500;
    errorLog(req, error);
  }

  return response;
};

// Verify Service for RazorPay
exports.paymentVerification = async (req) => {
  const userId = req.user._id;

  // console.log("filterUser", filterUser);
  // Getting private From aws params store
  const Private_Key = await getKeyFromAWS("POLYGON_PRIVATE_KEY"); //
  const RAZORPAY_SECRET_KEY = await getKeyFromAWS("RAZORPAY_SECRET_KEY");

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
    .createHmac("sha256", RAZORPAY_SECRET_KEY)
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

            //Remove user_id:UserId
            const ipfsHash = await pinata.pinJSONToIPFS({ ...rest }, options);
            const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;

            single_agreement.ipfs_url = ipfs_hash;
            await single_agreement.save();

            // Blockchain Transaction start ...
            const buyerAddr = process.env.BUYER_ADDR;
            const Tran = "https://mumbai.polygonscan.com/tx";

            // const privateKeyBuyer = filterUser[0].private_key;
            const gasLimit = await marketplaceContract.methods
              .buyContract(buyerAddr, [Agreement_nft_id], razorpay_payment_id, [
                ipfs_hash,
              ])
              .estimateGas({ from: adminAddr });

            const bufferedGasLimit = Math.round(
              Number(gasLimit) + Number(gasLimit) * Number(0.2)
            );

            console.log("bufferedGasLimit  123 ", bufferedGasLimit);
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
              Private_Key
            );
            console.log("signedTx : ", signedTx);

            const transaction = await web3.eth.sendSignedTransaction(
              signedTx.rawTransaction
            );
            single_agreement.tx_hash = `${Tran}/${transaction.transactionHash}`;
            await single_agreement.save();

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
                    errorLog(req, error);
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

          //Email notification on new order
          //creating a message
          const message = {
            from: process.env.EMAIL_ID,
            to: process.env.ADMIN_EMAIL,
            subject: "A new Order Placed",
            text: `A payment is made for contract by  "${req.user.name}"  with email  ${req.user.email} and order_id is ${id}`,
          };

          //sending email.
          emailTransporter.sendMail(message, (error, info) => {
            if (error) {
              console.log("Nodemailer error : ", error);
              errorLog(req, error);
            } else {
              console.log("Email sent: " + info.response);
              logger.log("info", `${info.response}`);
            }
          });
        } else {
          response.error = "No order found";
          response.httpStatus = 404;
          return response;
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
        response.message = `failed operation ${err}`;
        response.httpStatus = 500;
        errorLog(req, err);
        return response;
      });

    response.message = `Payment Successful`;
    response.httpStatus = 200;
    response.data = razorpay_payment_id;
    logger.log("info", "Payment Successful");
  } else {
    response.error = "Payment failed";
    response.httpStatus = 500;
    logger.log("info", "Payment failed");
    return response;
  }

  return response;
};

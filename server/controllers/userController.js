// import { Request, Response, NextFunction } from "express";
const { ethers } = require("ethers");

// Importing User model
const User = require("../models/users");

// Importig PinataSDK
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });

// Importing polygon credentials and web3
const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const rpcURL = process.env.RPC_URL;
const Private_Key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;
const AdminContractAddr = process.env.ADMIN_CONTRACT_ADDR;

// Contract ABI
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_userRole",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ipfsURL",
        type: "string",
      },
    ],
    name: "addUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getValidatorList",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "role",
    outputs: [
      {
        internalType: "enum Admin.Role",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userDetails",
    outputs: [
      {
        internalType: "address",
        name: "userAddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "enum Admin.Role",
        name: "_role",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "ipfsURL",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Route to      => api/v1/register/user NOT USED
exports.createUser = async (req, res, next) => {
  // Role && mobile number saved to DB
  const {
    full_name,
    address,
    state,
    education,
    expertise,
    role,
    mobile_number,
  } = req.body;

  // Public_key, Private_key is create using ether package [Random wallet]
  // Stored In DB.
  const wallet = ethers.Wallet.createRandom();

  const public_key = wallet.publicKey;
  const private_key = wallet.privateKey;
  let ipfs_hash = "";

  //Create option to give name to ipfs storage.
  const options = {
    pinataMetadata: {
      name: mobile_number,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  // Saving data to ipfs //
  try {
    const result = await pinata.pinJSONToIPFS(
      { full_name, address, state, education, expertise },
      options
    );
    ipfs_hash = result["IpfsHash"];
  } catch (error) {
    return res.status(500).json({
      error: "internal server error,try again",
      message: null,
      httpStatus: 400,
      data: null,
    });
  }

  // web3 provider for contracts..
  const provider = new Provider(Private_Key, rpcURL);
  const web3 = new Web3(provider);
  const adminContract = new web3.eth.Contract(contractABI, AdminContractAddr);

  // Blochchain transaction on adding User.
  // await adminContract.methods.addUser(wallet.address, 1, ipfs_hash).send({
  //   from: adminAddr,
  // });
  // console.log("Transaction successful", role);

  if (role === "Farmer" || role === "farmer") {
    // Blochchain transaction
    await adminContract.methods.addUser(wallet.address, 0, ipfs_hash).send({
      from: adminAddr,
    });
  } else if (role === "Buyer" || role === "buyer") {
    // Blochchain transaction
    await adminContract.methods.addUser(wallet.address, 1, ipfs_hash).send({
      from: adminAddr,
    });
  } else if (role === "Validator" || role === "validator") {
    // Blochchain transaction
    await adminContract.methods.addUser(wallet.address, 2, ipfs_hash).send({
      from: adminAddr,
    });
  }

  // Create a new user [only Company can create]
  try {
    //Create a user in DB
    const user = await User.create({
      ipfs_hash,
      public_key,
      private_key,
      mobile_number,
      role,
    });

    // Returning successful response.
    return res.status(201).json({
      error: null,
      message: "User created.",
      httpStatus: 201,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      error: `user exist, try again`,
      message: null,
      httpStatus: 400,
      data: null,
    });
  }
};

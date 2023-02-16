const marketplaceContractABI = [
  {
    inputs: [
      { internalType: "address", name: "farmNFT_", type: "address" },
      { internalType: "address", name: "agreementNFT_", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "farmNFTId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "agreementNFTId",
        type: "uint256",
      },
    ],
    name: "Buy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "farmNFTId",
        type: "uint256",
      },
    ],
    name: "ClosedContractNFT",
    type: "event",
  },
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "farmNFTId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "agreementNFTId",
        type: "uint256",
      },
    ],
    name: "Sell",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "agreementDetails",
    outputs: [
      { internalType: "uint256", name: "farmNFTId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "uint256", name: "agreementNftId", type: "uint256" },
      { internalType: "uint256", name: "startDate", type: "uint256" },
      { internalType: "uint256", name: "endDate", type: "uint256" },
      { internalType: "address", name: "buyer", type: "address" },
      { internalType: "address", name: "farmerAddr", type: "address" },
      { internalType: "string", name: "razorTransId", type: "string" },
      { internalType: "bool", name: "isClosedContract", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "agreementNftId_", type: "uint256[]" },
      { internalType: "string[]", name: "transactionId", type: "string[]" },
    ],
    name: "buyContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_buyerAddr", type: "address" }],
    name: "getAcceptedContractList",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "agreementNFTId", type: "uint256[]" },
    ],
    name: "getSellDetailByTokenId",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "farmNFTId", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "uint256", name: "agreementNftId", type: "uint256" },
          { internalType: "uint256", name: "startDate", type: "uint256" },
          { internalType: "uint256", name: "endDate", type: "uint256" },
          { internalType: "address", name: "buyer", type: "address" },
          { internalType: "address", name: "farmerAddr", type: "address" },
          { internalType: "string", name: "razorTransId", type: "string" },
          { internalType: "bool", name: "isClosedContract", type: "bool" },
        ],
        internalType: "struct Marketplace.AgreementInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "farmerAddr_", type: "address" },
      { internalType: "uint256", name: "farmNFTId_", type: "uint256" },
      { internalType: "uint256", name: "price_", type: "uint256" },
      { internalType: "uint256", name: "startDate_", type: "uint256" },
      { internalType: "uint256", name: "endDate_", type: "uint256" },
      { internalType: "string", name: "agreementNftUri_", type: "string" },
    ],
    name: "putContractOnSell",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      { internalType: "uint256", name: "agreementNftId_", type: "uint256" },
    ],
    name: "soldContractNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

module.exports = marketplaceContractABI;
// Import for Blockchain
const Web3 = require("web3");
const farmNFTContractABI = require("./farmContractABI");

const Private_Key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;
const farmNFTAddr = process.env.FARM_NFT_ADDR;

// const provider = new Web3.providers.WebsocketProvider(`${process.env.RPC_URL}`);

// const web3 = new Web3(provider);
//--------
const newProvider = () =>
  new Web3.providers.WebsocketProvider(process.env.RPC_URL, {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false,
    },
  });

const web3 = new Web3(newProvider());
//--------
const farmNFTContract = new web3.eth.Contract(farmNFTContractABI, farmNFTAddr);

const mintFarmNFT = async (ipfs_url) => {
  const farmerAddr = process.env.FARMER_ADDR;

  const gasLimit = await farmNFTContract.methods
    .mint(farmerAddr, `https://ipfs.io/ipfs/${ipfs_url}`)
    .estimateGas({ from: adminAddr });

  const bufferedGasLimit = Math.round(
    Number(gasLimit) + Number(gasLimit) * Number(0.2)
  );

  const encodedData = farmNFTContract.methods
    .mint(farmerAddr, `https://ipfs.io/ipfs/${ipfs_url}`)
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
  const transaction = await web3.eth.sendSignedTransaction(
    signedTx.rawTransaction
  );
  console.log("Transaction : ", transaction);

  web3.eth.getBlockNumber().then((latestBlock) => {
    farmNFTContract.getPastEvents(
      "Mint",
      {
        fromBlock: latestBlock,
        toBlock: latestBlock,
      },
      function (error, events) {
        const result = events[0].returnValues;
        farmnft_id = result[1];
        console.log("Fram Id", result[1]);
        console.log(events[0]);
      }
    );
  });
};
module.exports = mintFarmNFT;

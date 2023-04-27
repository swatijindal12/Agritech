import Web3 from "web3";
const RPC_URL = "https://rpc-mainnet.maticvigil.com/";
const web3 = new Web3(RPC_URL);

async function TransactionFee(gasFeeUsed) {
  try {
    const result = await web3.eth.getGasPrice();
    const gasPrice = web3.utils.fromWei(result, "ether");
    const transactionPrice = gasPrice * gasFeeUsed;
    return transactionPrice;
  } catch (error) {
    throw error;
  }
}
export default TransactionFee;

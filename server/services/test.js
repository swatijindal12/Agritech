const getEnvVariable = require("../config/privateketAWS");

// Calling function to get the privateKey from aws params storage
async function getKeyFromAWS(keyName) {
  const awsKeyValue = await getEnvVariable(keyName);
  // return
  return awsKeyValue[`${keyName}`];
}

console.log("Type of values ", typeof getKeyFromAWS("IPFS_BEARER_TOKEN"));

let IPFS_BEARER_TOKEN = "";
let ALCHEMY_KEY = "";

async function setKeyValue() {
  IPFS_BEARER_TOKEN = await getKeyFromAWS("IPFS_BEARER_TOKEN");
  ALCHEMY_KEY = await getKeyFromAWS("ALCHEMY_KEY");
  console.log("IPFS_BEARER_TOKEN INSIDE :", IPFS_BEARER_TOKEN);
  console.log("Alchemy Key Inside:", ALCHEMY_KEY);
}

// Use Promise.all to wait for the promises to resolve
Promise.all([setKeyValue()]).then(() => {
  console.log("IPFS_BEARER_TOKEN Inside :", IPFS_BEARER_TOKEN);
  console.log("Alchemy Key Inside:", ALCHEMY_KEY);
});

console.log("IPFS_BEARER_TOKEN outside :", IPFS_BEARER_TOKEN);
console.log("Alchemy Key outside:", ALCHEMY_KEY);

// getKeyFromAWS("IPFS_BEARER_TOKEN")
//   .then((val) => {
//     console.log("inside then", val);
//     IPFS_BEARER_TOKEN = val;
//   })
//   .catch((err) => console.log("Error", err));

console.log("IPFS_BEARER_TOKEN outside :", IPFS_BEARER_TOKEN);

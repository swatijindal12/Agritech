const getEnvVariable = require("./privatekeyAWS");
const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

// Calling function to get the privateKey from aws params storage
async function getKeyFromAWS(keyName) {
  if (nodeCache.has(keyName)) {
    return nodeCache.get(keyName);
  } else {
    const awsKeyValue = await getEnvVariable(keyName);
    // set in nodecache
    nodeCache.set(keyName, awsKeyValue[`${keyName}`]);
    // return
    return awsKeyValue[`${keyName}`];
  }
}

module.exports = { getKeyFromAWS };

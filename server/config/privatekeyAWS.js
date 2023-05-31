const AWS = require("aws-sdk");
const { errorLog } = require("../utils/commonError");
// // Importing environment setup file.
require("dotenv").config({ path: "./config/config.env" });

const getSSMParameter = async (ssm, parameter) => {
  try {
    const response = await ssm
      .getParameters({ Names: [...parameter], WithDecryption: true })
      .promise();
    return response.Parameters;
  } catch (err) {
    console.log(err);
    //errorLog(req, err);
    throw err;
  }
};

const getParamaterValueFromAwsParameters = async (parameters) => {
  AWS.config.update({
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    region: `${process.env.AWS_REGION}`,
  });

  const ssm = new AWS.SSM();

  const paramNames = [...parameters];

  const params = {
    Names: paramNames,
    WithDecryption: true,
  };
  const parameterValue = await getSSMParameter(ssm, paramNames);
  let privateKeyValue = {};
  parameterValue.forEach((parameter) => {
    privateKeyValue[parameter.Name] = parameter.Value;
  });
  return privateKeyValue;
};

// Get env variable from AWS params storage by keyname
const getEnvVariable = async (keyName) => {
  const privateKeyValue = await getParamaterValueFromAwsParameters([
    `${keyName}`,
  ]);
  return privateKeyValue;
};

module.exports = getEnvVariable;

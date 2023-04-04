const AWS = require('aws-sdk')
require('dotenv').config()

const getSSMParameter = async (ssm, parameter) => {
	try {
		const response = await ssm
			.getParameters({ Names: [...parameter], WithDecryption: true })
			.promise()
		return response.Parameters
	} catch (err) {
		console.log(err)
		throw err
	}
}

const getParamaterValueFromAwsParameters = async (parameters) => {
	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: process.env.AWS_REGION,
	})

	const ssm = new AWS.SSM()

	const paramNames = [...parameters]

	const params = {
		Names: paramNames,
		WithDecryption: true,
	}
	const parameterValue = await getSSMParameter(ssm, paramNames)
	let privateKeyValue = {}
	parameterValue.forEach((parameter) => {
		privateKeyValue[parameter.Name] = parameter.Value
	})
	return privateKeyValue
}

let privateKeyValue
const getEnvVariable = async () => {
	privateKeyValue = await getParamaterValueFromAwsParameters([
		'agritect-private-key',
		'adminAddress',
	])
	return privateKeyValue
}

module.exports = { getEnvVariable }

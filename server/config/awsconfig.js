// Importing aws-sdk for S3 bucket
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // your AWS access id
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // your AWS access key
});

// Exporting 
module.exports = s3;
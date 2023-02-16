// Importing aws-config
const s3 = require('../config/awsConfig')

// Actual function for uploading file to S3
async function uploadImage(file) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // bucket you want to upload to
      Key: `farms/upload-${Date.now()}-${file.name}`, // put all image to farms folder with name `${file.name}-${Date.now()}`
      Body: file.data,
      ACL: "public-read",
    };
    
    const data = await s3.upload(params).promise();
    return data.Location; // returns the url location
}

module.exports = uploadImage
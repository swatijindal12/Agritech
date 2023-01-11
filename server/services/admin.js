const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require('../models/users');

exports.validate = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    if (!req.files || !req.files.file) {
        response.error = "no file selected";
        response.httpStatus = 400
    }
    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    if (data) {
        response.httpStatus = 200;
        response.data = data
    }
    return response;
}

exports.createFarmer = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    // Read Json file and then add it DB
    if (!req.files || !req.files.file) {
        response.error = "no file selected",
            response.httpStatus = 400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    Farmer.insertMany(data).then(function () {
        response.message = "Data Insertion successful",
            response.httpStatus = 200
        response.data = data
    }).catch(function (error) {
        response.message = `Insertion failed ${error}`,
            response.httpStatus = 400
    });

    return response
}

exports.getFarmers = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    let farmers;
    try {
        farmers = await Farmer.find().select('-__v');
        response.data = farmers,
            response.httpStatus = 200
    } catch (error) {
        response.error = "failed operation",
            response.httpStatus = 400
    }
    return response
}

exports.createCustomer = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    if (!req.files || !req.files.file) {
        response.error = "no file selected",
            response.httpStatus = 400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    User.insertMany(data).then(function () {
        response.message = "Data Insertion successful",
            response.httpStatus = 200
        response.data = data
    }).catch(function (error) {
        response.message = `Insertion failed ${error}`,
            response.httpStatus = 400
    });
    return response
}

exports.createFarm = async (req) => {
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    // Read Json file and then add it DB
    if (!req.files || !req.files.file) {
        response.error = 'no file selected',
        response.error = 400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // remove some field FarmerID
    const updatedData = data.map( (item, index) => {

        const { ...rest } = item;
        // Create an IPFS hash store the hash value 
        let ipfs_hash = `jsdiu2u3u3jAJHJJSYUDG${index}`;
        let farmnft_id = `sdjsdksSDFTSD532GSGDG${index}`;

        // Create a farm NFT & store the farm NFT id using BlockChain.
        return { ...rest, ipfs_hash: ipfs_hash, farmnft_id: farmnft_id, user_id: item.farmer_id };
    });

    console.log("Updated data : ", updatedData);

    // Save Farm data in mongoDB , skip id,s.no key in json

    Farm.insertMany(updatedData).then(function () {
        response.message = "Data Insertion successful",
        response.httpStatus=200,
        response.data = updatedData
        // res.status(200).json({ error: null, message: "Data Insertion successful", httpStatus: 200, data: updatedData });  // Success
    }).catch(function (error) {
        response.error = `Insertion failed ${error}`,
        response.httpStatus=400
        // response.data = updatedData
        // res.status(400).json({ error: `Insertion failed ${error}`, message: null, httpStatus: 400, data: null });      // Failure
    });

    if (updatedData) {
        response.message = "Farm created successful"
        response.httpStatus=200
        response.data = updatedData;
    }

    return response
}

exports.getFarms = async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    let farms;
    try {
        farms = await Farm.find().select('-__v');
        response.data = farms,
        response.httpStatus = 200
    } catch (error) {
        response.error = "failed operation",
        response.httpStatus = 400
    }
    return response
}
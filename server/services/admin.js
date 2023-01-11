const Farmer = require("../models/farmers");
const FarmDetail = require("../models/farmDetail");
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
        response.error="no file selected";
        response.httpStatus = 400
    }
    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    if(data){
        response.httpStatus=200;
        response.data = data
    }
    return response;
}

exports.createFarmer = async (req) =>{
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    // Read Json file and then add it DB
    if (!req.files || !req.files.file) {
        response.error="no file selected",
        response.httpStatus=400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    Farmer.insertMany(data).then(function () {
        response.message="Data Insertion successful",
        response.httpStatus=200
        response.data=data
    }).catch(function (error) {
        response.message=`Insertion failed ${error}`,
        response.httpStatus=400
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
        response.data=farmers,
        response.httpStatus=400
    } catch (error) {
        response.error="failed operation",
        response.httpStatus=400
    }
    return response
}

exports.createCustomer= async (req) => {
    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    if (!req.files || !req.files.file) {
        response.error="no file selected",
        response.httpStatus=400
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    User.insertMany(data).then(function () {
        response.message="Data Insertion successful",
        response.httpStatus=200
        response.data=data
    }).catch(function (error) {
        response.message=`Insertion failed ${error}`,
        response.httpStatus=400
    });
    return response
}
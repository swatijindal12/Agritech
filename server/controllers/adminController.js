const Farmer = require("../models/farmers");
const FarmDetail = require("../models/farmDetail");
const User = require('../models/users');
const adminService = require('../services/admin')

// Route to      => api/v1/admin/validate-data
// Validate the Json data in table
exports.validateData = async (req, res, next) => {
    adminService.validate(req)
    .then(response=>{
        res.json(response)
    })
    .catch(error=>{
        res.status(400).json({
            error:"failed operation",
            message: null,
            httpStatus:400,
            data:null
        })
    })
};

// Route to     => POST: api/v1/admin/farmer
// Create farmer 
exports.createFarmer = async (
    req,
    res,
    next
) => {

    adminService.createFarmer(req)
    .then(response=>{
        res.json(response)
    })
    .catch(error=>{
        res.status(400).json({
            error:"failed operation",
            message: null,
            httpStatus:400,
            data:null
        })
    })
};

// Route to      => POST: api/v1/admin/farm
// Create farm
exports.createFarm = async (
    req,
    res,
    next
) => {
    // Read Json file and then add it DB
    if (!req.files || !req.files.file) {
        return res.status(400).json({
            error: "no file selected",
            message: null,
            httpStatus: 400,
            data: null
        })
    }

    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // remove some field FarmerID
    const updatedData = data.map(async (item, index) => {
        console.log("item : ", item);
        const { farmer_id, ...rest } = item;

        // Create an IPFS hash store the hash value 
        let ipfs_hash = `jsdiu2u3u3jAJHJJSYUDG${index}`;
        let farmnft_id = `sdjsdksSDFTSD532GSGDG${index}`;
        const user = await Farmer.findOne({ pin: item.pin })
        console.log("user_id : ", user._id);

        // Create a farm NFT & store the farm NFT id using BlockChain.
        return { ...rest, ipfs_hash: ipfs_hash, farmnft_id: farmnft_id, farmer_id: user._id };
    });

    console.log("Updated data : ", updatedData);

    // Save Farm data in mongoDB , skip id,s.no key in json
    // FarmDetail.insertMany(updatedData).then(function () {
    //     res.status(200).json({ error: null, message: "Data Insertion successful", httpStatus: 200, data: updatedData });  // Success
    // }).catch(function (error) {
    //     res.status(400).json({ error: `Insertion failed ${error}`, message: null, httpStatus: 400, data: null });      // Failure
    // });

    res.status(200).json({
        success: true,
        data: updatedData
    })
};

// Route to     => GET: api/v1/admin/farmers
// Get the List of farmers
exports.getFarmers = async (req, res, next) => {

    adminService.getFarmers(req)
        .then(response=>{
            res.json(response)
        })
        .catch(error=>{
            res.status(400).json({
                error:"failed operation",
                message: null,
                httpStatus:400,
                data:null
            })
        })
}

// Route to     => api/v1/admin/company
// Create company
exports.createCustomer = async (
    req,
    res,
    next
) => {
    adminService.createCustomer(req)
    .then(response=>{
        res.json(response)
    })
    .catch(error=>{
        res.status(400).json({
            error:"failed operation",
            message: null,
            httpStatus:400,
            data:null
        })
    })
    
};


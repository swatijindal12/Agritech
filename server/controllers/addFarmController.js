// import { Request, Response, NextFunction } from "express";

// Importing Farm
const Farm = require("../models/farms");

// Importig PinataSDK
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });

// Add a new Farm [only farmer ]
exports.addFarm = async (req, res, next) => {
 
  // 1. Handle File Upload .
  // 2. Set User  from middleware and to DB.
  // eg:- 
  /* Adding user to body
   req.body.user = req.user.id;
   const job = await Job.create(req.body); */
   //3. STORE DATA TO ipfs.

  let ipfs_hash = "";
  //Create option to give name to ipfs storage.
  const options = {
    pinataMetadata: {
      name: req.user.id,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  // Saving data to ipfs
  try {
    const result = await pinata.pinJSONToIPFS(req.body,options);
    ipfs_hash = result["IpfsHash"];
  } catch (error) {
    return res.status(500).json({
      error: "internal server error,try again",
      message: null,
      httpStatus: 400,
      data: null,
    });
  }

    // Data that stored in DB 
   // Create a new farm [only farmer can create]
   try {
    //Create a farm in DB
    const farm = await Farm.create({
      ipfs_hash,
      farmnft_id: "shdsjhsauwiueiwendsjdhjsdhjsbn",
      user_id: req.user.id,
      validated_status: false
    });

    // Returning successful response.
    return res.status(201).json({
      error: null,
      message: "farm created.",
      httpStatus: 201,
      data: farm,
    });

  } catch (error) {
    return res.status(400).json({
      error: `operation failed, try again !`,
      message: null,
      httpStatus: 400,
      data: null,
    });
  }
  
};

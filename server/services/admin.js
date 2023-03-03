const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require("../models/users");
const Agreement = require("../models/agreements");
const Audit = require("../models/audit");
const StageAgreement = require("../models/stageAgreement");
const StageFarmer = require("../models/stageFarmer");
const StageFarm = require("../models/stageFarm");
const csvToJson = require("../utils/csvToJson");
const farmerSchemaCheck = require("../utils/farmerSchemaCheck");
const farmSchemaCheck = require("../utils/farmSchemaCheck");
const agreementSchemaCheck = require("../utils/agreementSchemaCheck");
const mongoose = require("mongoose");
// Importig PinataSDK For IPFS
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN });
const epocTimeConv = require("../utils/epocTimeConv");

// Import for Blockchain
const Web3 = require("web3");
const farmNFTContractABI = require("../web3/farmContractABI");
const marketplaceContractABI = require("../web3/marketPlaceABI");

// const mintFarm = require("../web3/mintFarm");

const Private_Key = process.env.PRIVATE_KEY;
const adminAddr = process.env.ADMIN_ADDR;
const farmNFTAddr = process.env.FARM_NFT_ADDR;
const marketplaceAddr = process.env.MARKETPLACE_ADDR;
const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL);

const web3 = new Web3(provider);
const farmNFTContract = new web3.eth.Contract(farmNFTContractABI, farmNFTAddr);

const marketplaceContract = new web3.eth.Contract(
  marketplaceContractABI,
  marketplaceAddr
);

// Validate the agreement
exports.validate = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  } else {
    // Read the contents of the file
    // const fileContent = req.files.file.data.toString(); //JSON DATA
    const file = req.files.file;
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
    const data = await csvToJson(file);
    //console.log("data :- ", data);
    // Check file type
    if (file.mimetype != "text/csv") {
      response.error = "select csv file";
      response.httpStatus = 400;
    } else if (!agreementSchemaCheck(data)) {
      // Check schema of the file
      response.error = "data format do not match, download sample";
      response.httpStatus = 400;
    } else {
      const errorLines = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        let errors = {
          line: i,
          farmer_name: "",
          crop: "",
          start_date: "",
          end_date: "",
          area: "",
          price: "",
          farm_id: "",
          farm_nft_id: "",
          address: "",
        };

        if (!item.farmer_name && item.farmer_name.length >= 3) {
          errors.name = "Name should be 3 characters long";
        }

        if (item.start_date) {
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          if (!dateRegex.test(item.start_date)) {
            errors.start_date =
              "Start date should be in the format of date/month/year";
          }
        }

        if (item.end_date) {
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          if (!dateRegex.test(item.end_date)) {
            errors.end_date =
              "End date should be in the format of date/month/year";
          }
        }

        // Check for missing fields and add them to the errors object for this item
        const requiredFields = [
          "farmer_name",
          "crop",
          "start_date",
          "end_date",
          "area",
          "price",
          "farm_id",
          "farm_nft_id",
          "address",
        ];

        for (const field of requiredFields) {
          if (!item[field]) {
            errors[field] = `Missing '${field}' field`;
          }
        }
        let farm;
        try {
          // Check for farm_id is not there.

          const farmNFTId = item.farm_nft_id;
          farm = await Farm.findOne({ _id: item.farm_id });
          if (farm) {
            console.log(
              "farm.farm_nft_id ",
              farm.farm_nft_id,
              " => ",
              farmNFTId
            );
            if (farm.farm_nft_id != farmNFTId) {
              console.log("inside");
              errors.farm_nft_id = "farm_nft_id not matching with farm";
            }
          } else {
            errors.farm_id = "farm not found";
          }
        } catch (err) {
          if (err instanceof mongoose.CastError) {
            errors.farm_id = "Invalid farm ID";
          }
        }
        if (
          errors.farmer_name ||
          errors.crop ||
          errors.start_date ||
          errors.end_date ||
          errors.area ||
          errors.price ||
          errors.farm_id ||
          errors.farm_nft_id ||
          errors.address
        ) {
          errorLines.push(errors);
        }
      }

      if (errorLines.length >= 1) {
        // There are error some lines missing data
        (response.httpStatus = 400), (response.error = errorLines);
      } else {
        // No error
        (response.httpStatus = 200),
          (response.message = "validation successful");
      }
      response.data = data;
    }
  }
  return response;
};

// Stage the agreement
exports.stagedAgreements = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  } else {
    try {
      const file = req.files.file;
      //console.log("file Name :- ", file);

      // Check file type
      if (file.mimetype != "text/csv") {
        response.error = "select csv file";
        response.httpStatus = 400;
      } else {
        const data = await csvToJson(file);
        // Add the file name to each data object

        // if Same file name do not exist
        const fileExist = await StageAgreement.find({ file_name: file.name });

        let updatedData;
        if (fileExist.length <= 0) {
          updatedData = data.map((eachdata) => {
            return { ...eachdata, file_name: file.name };
          });
          // Insert record into DB (stageAgreement)
          const stageAgreement = await StageAgreement.create(updatedData);

          response.httpStatus = 200;
          response.message = "Insertion succeesful";
          response.data = stageAgreement;
        } else {
          response.httpStatus = 400;
          response.message = "file name, already exist.";
        }
      }
    } catch (error) {
      response.error = `failed operation ${error}`;
      response.httpStatus = 500;
    }
  }
  return response;
};

// Get staged agreement
exports.getStagedAgreements = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };
  try {
    // read the data {stage_status:true}, all the data in stage state
    const stageAgreementpending = await StageAgreement.find({
      stage_status: true,
      approval_status: false,
    }).select("-createdAt -updatedAt -__v -stage_status -approval_status");
    // Note :- while inserting update the status to approval_status true
    // if approval status true ,stage_staus:true means this data should be
    // inserted into the Agreement table.

    const groupedData = {};
    stageAgreementpending.forEach((agreement) => {
      if (!groupedData[agreement.file_name]) {
        groupedData[agreement.file_name] = [];
      }
      groupedData[agreement.file_name].push(agreement);
    });

    const dataArray = Object.entries(groupedData).map(
      ([fileName, agreements]) => ({
        name: fileName,
        data: agreements,
      })
    );

    response.httpStatus = 200;
    response.data = dataArray.length > 0 ? dataArray : [];
  } catch (error) {
    response.error = `operation failed ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

// Get Agreement List for admin with Pagination
exports.listAgreements = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  const searchQuery = {};

  if (req.query.search) {
    const searchValue = req.query.search;
    searchQuery["$or"] = [
      { farmer_name: new RegExp(req.query.search, "i") },
      {
        crop: new RegExp(req.query.search, "i"),
      },
    ];
  }

  try {
    let agreementQuery = Agreement.find(searchQuery);
    let totalDocuments = await Agreement.countDocuments(searchQuery);

    if (isNaN(page) && isNaN(limit)) {
      // Return all documents
      const agreements = await agreementQuery.select("-__v");

      response.data = agreements;
      response.httpStatus = 200;
    } else {
      // Apply pagination
      const agreements = await agreementQuery
        .skip(skip)
        .limit(limit)
        .select("-__v ");
      response.httpStatus = 200;
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: agreements.map((agreement) => ({
          ...agreement._doc,
          createdAt: agreement.createdAt.toLocaleString(),
          updatedAt: agreement.updatedAt.toLocaleString(),
        })),
      };
    }
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 400);
  }
  return response;
};

// Update Agreement Service ::
exports.updateAgreement = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;

  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  let startDate = req.body.start_date;
  let endDate = req.body.end_date;
  let amount = req.body.price;
  let crop = req.body.crop;
  let area = req.body.area;

  const updatedData = {
    start_date: startDate,
    end_date: endDate,
    price: amount,
    crop: crop,
    area: area,
  };

  // console.log('updatedData :', updatedData)

  try {
    // First check agreement is their with id and not active
    let agreement = await Agreement.findOne({ _id: id, sold_status: false });
    console.log("AGREEMENT", agreement);
    amount = amount === undefined ? agreement.price : amount;
    startDate = startDate === undefined ? agreement.start_date : startDate;
    endDate = endDate === undefined ? agreement.end_date : endDate;
    crop = crop === undefined ? agreement.crop : crop;
    area = area === undefined ? agreement.area : area;

    // console.log('rest', rest)

    if (agreement) {
      // Update the Agreement data..
      await Agreement.updateOne({ _id: id }, updatedData);
      agreement = await Agreement.findOne({ _id: id, sold_status: false });

      const {
        _id,
        farm_id,
        file_name,
        farmer_name,
        address,
        agreement_nft_id,
        tx_hash,
        farm_nft_id,
        price,
        ipfs_url,
        ...rest
      } = agreement._doc;

      const options = {
        pinataMetadata: {
          name: agreement?.farm_nft_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options);
      const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;
      agreement.ipfs_url = ipfs_hash;
      await agreement.save();

      // -------------- IPFS --------------------

      // BLOCKCHAIN TRANSACTION--------------------
      const Tran = "https://mumbai.polygonscan.com/tx";
      const agreement_nftId = agreement.agreement_nft_id;

      const gasLimit = await marketplaceContract.methods
        .updateAgreementData(
          agreement_nftId,
          amount,
          epocTimeConv(startDate),
          epocTimeConv(endDate),
          ipfs_hash
        )
        .estimateGas({ from: adminAddr });

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2)
      );

      const updateContract = marketplaceContract.methods
        .updateAgreementData(
          agreement_nftId,
          amount,
          epocTimeConv(startDate),
          epocTimeConv(endDate),
          ipfs_hash
        )
        .encodeABI();

      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: marketplaceAddr,
        value: "0x00",
        data: updateContract,
        from: adminAddr,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key);

      const transaction = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      agreement.tx_hash = `${Tran}/${transaction.transactionHash}`;

      response.message = `Successfully updated `;
      response.httpStatus = 200;
    } else {
      response.error = `agreement not found`;
      response.httpStatus = 404;
    }
  } catch (error) {
    response.error = `failed operation1 ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

// Delete Agreement Service /:id
exports.deleteAgreement = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;

  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  try {
    // First check agreement is their with id
    const agreement = await Agreement.findOne({
      _id: id,
    });

    if (agreement) {
      // delete the agreement not active one
      const checkAgreement = await Agreement.deleteOne({
        _id: id,
        sold_status: false,
      });

      if (checkAgreement.deletedCount) {
        response.message = `Successfully deleted`;
        response.httpStatus = 200;
      } else {
        response.error = `agreement is active`;
        response.httpStatus = 400;
      }
    } else {
      response.error = `agreement not found`;
      response.httpStatus = 404;
    }
  } catch (error) {
    response.error = `failed operation ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

exports.validateFarmers = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  } else {
    // Read the contents of the file
    const file = req.files.file;
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
    const data = await csvToJson(file);

    // Check file type
    if (file.mimetype != "text/csv") {
      response.error = "select csv file";
      response.httpStatus = 400;
    } else if (!farmerSchemaCheck(data)) {
      // Check schema of the file
      response.error = "data format do not match, download sample";
      response.httpStatus = 400;
    } else {
      const errorLines = [];
      // Creating List of errors.
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let errors = {
          line: i,
          name: "",
          email: "",
          phone: "",
          pin: "",
          image_url: "",
          farmer_pdf: "",
        };

        if (!item.name && item.name.length >= 3) {
          errors.name = "Name should be 3 characters long";
        }

        if (
          !item.email ||
          !item.email.includes("@") ||
          !item.email.endsWith(".com")
        ) {
          errors.email = "Email should contain '@' and end with '.com'";
        }

        if (!item.phone || item.phone.length !== 10) {
          errors.phone = "Phone should be 10 characters long";
        }

        if (!item.pin || item.pin.length !== 6) {
          errors.pin = "PIN should be 6 characters long";
        }

        if (!item.image_url || !item.image_url.startsWith("https://")) {
          errors.image_url =
            "Invalid image URL format. Must start with 'https://'";
        }

        if (!item.farmer_pdf || !item.farmer_pdf.startsWith("https://")) {
          errors.farmer_pdf = "Farmer PDF should start with 'https://'";
        }

        // Check for missing fields and add them to the errors object for this item
        const requiredFields = [
          "name",
          "email",
          "address",
          "phone",
          "pin",
          "image_url",
          "farmer_pdf",
        ];
        for (const field of requiredFields) {
          if (!item[field]) {
            errors[field] = `Missing '${field}' field`;
          }
        }

        // Check for duplicate phone and email in DB
        const farmerInDbPhone = await Farmer.find({ phone: item.phone });
        const farmerInDbEmail = await Farmer.find({ email: item.email });

        if (farmerInDbPhone.length !== 0 && farmerInDbEmail.length !== 0) {
          errors.phone = "Phone already exists";
          errors.email = "Email already exists";
        } else if (farmerInDbEmail.length !== 0) {
          errors.email = "Email already exists";
        } else if (farmerInDbPhone.length !== 0) {
          errors.phone = "Phone already exists";
        }

        if (
          errors.name ||
          errors.email ||
          errors.phone ||
          errors.pin ||
          errors.image_url ||
          errors.farmer_pdf
        ) {
          errorLines.push(errors);
        }
      }

      if (errorLines.length >= 1) {
        // There are error some lines missing data
        (response.httpStatus = 400), (response.error = errorLines);
      } else {
        // No error
        (response.httpStatus = 200),
          (response.message = "validation successful");
      }
      response.data = data;
    }
  }
  return response;
};

exports.stagedFarmers = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  } else {
    try {
      const file = req.files.file;
      //console.log("file Name :- ", file);

      // Check file type
      if (file.mimetype != "text/csv") {
        response.error = "select csv file";
        response.httpStatus = 400;
      } else {
        const data = await csvToJson(file);
        // Add the file name to each data object

        // if Same file name do not exist

        const fileExist = await StageFarmer.find({ file_name: file.name });

        let updatedData;
        if (fileExist.length <= 0) {
          updatedData = data.map((eachdata) => {
            return { ...eachdata, file_name: file.name };
          });
          // Insert record into DB (stageFarmer)
          console.log("updatedData :- ", updatedData);
          const stageFarmer = await StageFarmer.create(updatedData);

          response.httpStatus = 200;
          response.message = "Insertion succeesful";
          response.data = stageFarmer;
        } else {
          response.httpStatus = 400;
          response.message = "file name, already exist.";
        }
      }
    } catch (error) {
      response.error = `failed operation ${error}`;
      response.httpStatus = 500;
    }
  }
  return response;
};

exports.getStagedFarmers = async (req) => {
  // General response format

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };
  try {
    // read the data {stage_status:true}, all the data in stage state
    const stageFarmerpending = await StageFarmer.find({
      stage_status: true,
      approval_status: false,
    }).select("-createdAt -updatedAt -__v -stage_status -approval_status");
    // Note :- while inserting update the status to approval_status true
    // if approval status true ,stage_staus:true means this data should be
    // inserted into the Agreement table.

    const groupedData = {};
    stageFarmerpending.forEach((farmer) => {
      if (!groupedData[farmer.file_name]) {
        groupedData[farmer.file_name] = [];
      }
      groupedData[farmer.file_name].push(farmer);
    });

    const dataArray = Object.entries(groupedData).map(
      ([fileName, farmers]) => ({
        name: fileName,
        data: farmers,
      })
    );

    response.httpStatus = 200;
    response.data = dataArray.length > 0 ? dataArray : [];
  } catch (error) {
    response.error = `operation failed ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

exports.createFarmer = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  // Save Farm data in mongoDB , skip id,s.no key in json
  try {
    const data = req.body;

    // status RESET stage table
    data.map(async (farmer) => {
      await StageFarmer.updateOne(
        { _id: farmer._id },
        { stage_status: false, approval_status: true }
      );
    });

    const farmers = await Farmer.create(data, {
      select: `-_id -stage_status -approval_status -file_name`,
    });

    // Removing from staging stable
    data.map(async (farmer) => {
      await StageFarmer.deleteOne({ _id: farmer._id, stage_status: false });
    });

    if (farmers.length != 0) {
      response.message = "Data Insertion successful";
      response.httpStatus = 201;
      response.data = farmers;
    } else {
      (response.error = "Data Insertion failed, duplicate data"),
        (response.httpStatus = 500);
    }
  } catch (error) {
    (response.error = `Insertion failed ${error}`), (response.httpStatus = 500);
  }
  return response;
};

// Update Farmer Service
exports.updateFarmer = async (req) => {
  // Getting user from middleware
  const userLogged = req.user;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;
  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  const updatedData = req.body;
  try {
    // First check farmer is their with id
    let farmer = await Farmer.findOne({ _id: id });

    if (farmer) {
      // old value
      const old_values = { ...farmer.toJSON() };

      await Farmer.updateOne({ _id: id }, updatedData);

      let new_values = { ...updatedData };

      // Creatingg Log
      await Audit.create({
        table_name: "farmers",
        record_id: farmer.id,
        change_type: "update",
        old_value: JSON.stringify(old_values),
        new_value: JSON.stringify(new_values),
        user_id: userLogged.id,
        user_name: userLogged.name,
      });
      // creating response
      response.message = `Successfully updated`;
      response.httpStatus = 200;
    } else {
      response.error = `farmer not found`;
      response.httpStatus = 404;
    }
  } catch (error) {
    response.error = `failed operation ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

// Delete Farmer Service /:id
exports.deleteFarmer = async (req) => {
  // Getting user from middleware
  const userLogged = req.user;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;

  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  try {
    // First check farmer is their with id
    const farmer = await Farmer.findOne({ _id: id }).select(
      "-__v -createdAt -updatedAt"
    );

    if (farmer) {
      // delete the farmer data..Also delete all farms, and close agreements for that farms.
      // Check if this farmer Has some farm then Delete it
      const farms = await Farm.find({ farmer_id: farmer._id });
      if (farms.length > 0) {
        // const farmId = farms[0]._id;
        // await Farm.deleteMany({ farmer_id: farmer._id });
        // // Check if this farmer Has some Agreement which not active then Delete it
        // const agreements = await Agreement.find({ farm_id: farmId });
        // if (agreements) {
        //   await Agreement.deleteMany({
        //     farm_id: farmId,
        //     sold_status: true,
        //   });
        // }
        response.error = `reference exist you can not delete`;
        response.httpStatus = 400;
      } else {
        // Old farmer
        const old_values = { ...farmer.toJSON() };
        // console.log("old_values ", old_values);
        await Farmer.deleteOne({ _id: id });
        const new_values = { ...farmer.toJSON() };
        // console.log("new_values ", new_values);
        await Audit.create({
          table_name: "farmers",
          record_id: farmer.id,
          change_type: "delete",
          old_value: JSON.stringify(old_values),
          new_value: JSON.stringify(new_values),
          user_id: userLogged.id,
          user_name: userLogged.name,
        });

        response.message = `Successfully deleted`;
        response.httpStatus = 200;
      }
    } else {
      response.error = `farmer not found`;
      response.httpStatus = 404;
    }
  } catch (error) {
    response.error = `failed operation 1 ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

// Get all farmer with page no. with search Query
exports.getFarmers = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const sortOrder = req.query.sortOrder;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const searchQuery = {};

  // if (req.query.search) {
  //   searchQuery.name = new RegExp(req.query.name, "i");
  // }
  // if (req.query.phone) {
  //   searchQuery.phone = parseInt(req.query.phone);
  // }
  // if (req.query.pin) {
  //   searchQuery.pin = parseInt(req.query.pin);
  // }
  if (req.query.search) {
    const searchValue = req.query.search;
    searchQuery["$or"] = [
      { name: new RegExp(req.query.search, "i") },
      {
        pin: !isNaN(parseInt(searchValue)) ? parseInt(searchValue) : undefined,
      },
      {
        phone: !isNaN(parseInt(searchValue))
          ? parseInt(searchValue)
          : undefined,
      },
    ];
  }

  try {
    let farmerQuery = Farmer.find(searchQuery);
    let totalDocuments = await Farmer.countDocuments(searchQuery);

    if (sortOrder === "low") {
      farmerQuery = farmerQuery.sort({ rating: 1 });
    } else if (sortOrder === "high") {
      farmerQuery = farmerQuery.sort({ rating: -1 });
    }

    if (isNaN(page) && isNaN(limit) && !sortOrder) {
      // Return all documents
      const farmers = await farmerQuery.select("-__v");
      response.data = farmers.map((farmer) => ({
        ...farmer._doc,
        createdAt: farmer.createdAt.toLocaleString(),
        updatedAt: farmer.updatedAt.toLocaleString(),
      }));
      response.httpStatus = 200;
    } else if (isNaN(page) && isNaN(limit)) {
      // Return all documents
      const farmers = await farmerQuery.select("-__v");

      response.data = farmers;
      response.httpStatus = 200;
    } else {
      // Apply pagination
      const farmers = await farmerQuery.skip(skip).limit(limit).select("-__v");
      response.httpStatus = 200;
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: farmers.map((farmer) => ({
          ...farmer._doc,
          createdAt: farmer.createdAt.toLocaleString(),
          updatedAt: farmer.updatedAt.toLocaleString(),
        })),
      };
    }
  } catch (error) {
    (response.error = `failed operation ${error}`), (response.httpStatus = 400);
  }
  return response;
};

// Validate Farm
exports.validateFarms = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  } else {
    // Read the contents of the file

    const file = req.files.file;
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
    const data = await csvToJson(file);
    // Check file type
    if (file.mimetype != "text/csv") {
      response.error = "select csv file";
      response.httpStatus = 400;
    } else if (!farmSchemaCheck(data)) {
      // Check schema of the file
      response.error = "data format do not match, download sample";
      response.httpStatus = 400;
    } else {
      const errorLines = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        let errors = {
          line: i,
          farmer_id: "",
          name: "",
          address: "",
          pin: "",
          location: "",
          farm_size: "",
          farm_pdf: "",
          farm_practice_rating: "",
          farm_practice_pdf: "",
          rating: "",
          image_url: "",
          video_url: "",
        };

        if (!item.pin || item.pin.length !== 6) {
          errors.pin = "PIN should be 6 characters long";
        }

        if (!item.image_url || !item.image_url.startsWith("https://")) {
          errors.image_url =
            "Invalid image URL format. Must start with 'https://'";
        }

        if (!item.farm_pdf || !item.farm_pdf.startsWith("https://")) {
          errors.farm_pdf = "Farm PDF should start with 'https://'";
        }
        if (!item.video_url || !item.video_url.startsWith("https://")) {
          errors.video_url = "Video_url should start with 'https://'";
        }

        if (
          !item.farm_practice_pdf ||
          !item.farm_practice_pdf.startsWith("https://")
        ) {
          errors.video_url = "Farm_practice_pdf should start with 'https://'";
        }

        // Check for missing fields and add them to the errors object for this item
        const requiredFields = [
          "name",
          "farmer_id",
          "name",
          "address",
          "pin",
          "location",
          "farm_size",
          "farm_pdf",
          "farm_practice_rating",
          "farm_practice_pdf",
          "rating",
          "image_url",
          "video_url",
        ];
        for (const field of requiredFields) {
          if (!item[field]) {
            errors[field] = `Missing '${field}' field`;
          }
        }

        // Check if location,farmer_id is not found or already exist in DB
        const farmLocationExist = await Farm.find({
          location: item["location"],
        });
        let farmer;
        try {
          farmer = await Farmer.findById(item.farmer_id);
          if (!farmer) {
            errors.farmer_id = "Farmer not found";
          }
        } catch (err) {
          if (err instanceof mongoose.CastError) {
            errors.farmer_id = "Invalid farmer ID";
          }
        }

        if (farmLocationExist.length != 0 && farmer == undefined) {
          errors.farmer_id = "Farmer id is not found";
          errors.location = "Duplicate farm location";
        } else if (farmLocationExist.length != 0) {
          errors.location = "Duplicate farm location";
        } else if (farmer == undefined) {
          errors.farmer_id = "Farmer id is not found ";
        }

        if (
          errors.farmer_id ||
          errors.name ||
          errors.address ||
          errors.pin ||
          errors.location ||
          errors.farm_size ||
          errors.farm_pdf ||
          errors.farm_practice_rating ||
          errors.farm_practice_pdf ||
          errors.rating ||
          errors.image_url ||
          errors.video_url
        ) {
          errorLines.push(errors);
        }
      }

      if (errorLines.length >= 1) {
        // There are error some lines missing data
        (response.httpStatus = 400), (response.error = errorLines);
      } else {
        // No error
        (response.httpStatus = 200),
          (response.message = "validation successful");
      }
      response.data = data;
    }
  }
  return response;
};

exports.stagedFarms = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  } else {
    try {
      const file = req.files.file;
      //console.log("file Name :- ", file);

      // Check file type
      if (file.mimetype != "text/csv") {
        response.error = "select csv file";
        response.httpStatus = 400;
      } else {
        const data = await csvToJson(file);
        // Add the file name to each data object

        // if Same file name do not exist
        const fileExist = await StageFarm.find({ file_name: file.name });

        let updatedData;
        if (fileExist.length <= 0) {
          updatedData = data.map((eachdata) => {
            return { ...eachdata, file_name: file.name };
          });
          // Insert record into DB (stageFarmer)
          const stageFarm = await StageFarm.create(updatedData);

          response.httpStatus = 200;
          response.message = "Insertion succeesful";
          response.data = stageFarm;
        } else {
          response.httpStatus = 400;
          response.message = "file name, already exist.";
        }
      }
    } catch (error) {
      response.error = `failed operation ${error}`;
      response.httpStatus = 500;
    }
  }
  return response;
};

exports.getStagedFarms = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };
  try {
    // read the data {stage_status:true}, all the data in stage state
    const stageFarmpending = await StageFarm.find({
      stage_status: true,
      approval_status: false,
    }).select("-createdAt -updatedAt -__v -stage_status -approval_status");
    // Note :- while inserting update the status to approval_status true
    // if approval status true ,stage_staus:true means this data should be
    // inserted into the Agreement table.

    const groupedData = {};
    stageFarmpending.forEach((farm) => {
      if (!groupedData[farm.file_name]) {
        groupedData[farm.file_name] = [];
      }
      groupedData[farm.file_name].push(farm);
    });

    const dataArray = Object.entries(groupedData).map(([fileName, farms]) => ({
      name: fileName,
      data: farms,
    }));

    response.httpStatus = 200;
    response.data = dataArray.length > 0 ? dataArray : [];
  } catch (error) {
    response.error = `operation failed ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

exports.createFarm = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;
  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  const data = req.body;
  // status setting stage table
  data.map(async (farm) => {
    await StageFarm.updateOne(
      { _id: farm._id },
      { stage_status: false, approval_status: true }
    );
  });

  const updatedData = await Promise.all(
    data.map(async (farm, index) => {
      const { _id, farmer_id, file_name, ...rest } = farm;
      farm.ipfs_url = "";

      // -------------- IPFS --------------------
      const options = {
        pinataMetadata: {
          name: farm.farmer_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options);
      farm.ipfs_url = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;
      // -------------- IPFS --------------------
      return { ...farm, user_id: farm.farmer_id };
    })
  );

  // BlockChain Start
  const mintPromises = [];
  const Tran = "https://mumbai.polygonscan.com/tx";
  for (let index = 0; index < updatedData.length; index++) {
    const farm = updatedData[index];
    farm.farm_nft_id = "";
    // console.log(`ipfs ${index}:`, farm.ipfs_url);
    // BlockChain Start
    const farmerAddr = process.env.FARMER_ADDR; //wallet adres

    const gasLimit = await farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .estimateGas({ from: adminAddr });

    const bufferedGasLimit = Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2)
    );

    const encodedData = farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .encodeABI();

    const gasPrice = await web3.eth.getGasPrice();
    const transactionFee =
      parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString());

    const tx = {
      gas: web3.utils.toHex(bufferedGasLimit),
      to: farmNFTAddr,
      value: "0x00",
      data: encodedData,
      from: adminAddr,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key);
    console.log("signedTx : ", signedTx);

    const transaction = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    // console.log("Transaction : ", transaction.transactionHash);
    // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
    farm.tx_hash = `${Tran}/${transaction.transactionHash}`;

    let farm_nft_id = null;
    const mintPromise = new Promise((resolve, reject) => {
      // create new promise
      farmNFTContract.getPastEvents(
        "Mint",
        {
          fromBlock: "latest",
        },
        function (error, events) {
          if (error) {
            reject(error);
          } else {
            const result = events[0].returnValues;
            farm_nft_id = result[1];
            // console.log("Farm Id", result[1]);
            farm.farm_nft_id = result[1]; // assign farm_nft_id to farm object
            resolve();
          }
        }
      );
    });
    mintPromises.push(mintPromise);
  }
  await Promise.all(mintPromises);
  // BlockChain End

  // Save Farm data in mongoDB , skip id,s.no key in json
  // console.log("updatedData :-", updatedData);
  try {
    const farms = await Farm.create(updatedData, {
      select: `-_id -stage_status -approval_status -file_name`,
    });

    // Removing from staging stable
    updatedData.map(async (farm) => {
      await StageFarm.deleteOne({ _id: farm._id }, { stage_status: false });
    });

    if (farms.length != 0) {
      // console.log("checking if length");

      (response.message = "Data Insertion successful"),
        (response.httpStatus = 200),
        (response.data = updatedData);
    } else {
      // console.log("checking else length");
      (response.error = "Data Insertion failed duplicate data"),
        (response.httpStatus = 500);
    }
  } catch (error) {
    (response.error = `Insertion failed ${error}`), (response.httpStatus = 400);
  }

  return response;
};

exports.deleteFarm = async (req) => {
  const userLogged = req.user;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;

  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  try {
    // First check farmer is their with id
    let farm = await Farm.findOne({ _id: id });

    if (farm) {
      // delete the farm data..

      // delete the farm data..
      // Check if this farm has some agreement
      const agreements = await Agreement.find({ farm_id: farm._id });

      if (agreements.length > 0) {
        // const farmId = agreements[0].farm_id;
        // await Agreement.deleteMany({ farm_id: farmId });
        response.error = `reference exist you can not delete`;
        response.httpStatus = 400;
      } else {
        // Old farmer
        const old_values = { ...farm.toJSON() };
        // console.log("old_values ", old_values);
        await Farm.deleteOne({ _id: id });
        farm = await Farm.findOne({ _id: id });
        const new_values = { ...farm.toJSON() };
        // console.log("new_values ", new_values);
        await Audit.create({
          table_name: "farm",
          record_id: farm._id,
          change_type: "delete",
          old_value: JSON.stringify(old_values),
          new_value: JSON.stringify(new_values),
          user_id: userLogged.id,
          user_name: userLogged.name,
        });

        response.message = `Successfully deleted`;
        response.httpStatus = 200;
      }
    } else {
      response.error = `farm not found`;
      response.httpStatus = 404;
    }
  } catch (error) {
    response.error = `failed operation ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

exports.updateFarm = async (req) => {
  const userLogged = req.user;
  const userId = userLogged._id;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;

  const updatedData = req.body;

  try {
    // First check farmer is their with id
    let farm = await Farm.findOne({ _id: id });

    if (farm) {
      // Old farmer
      const old_values = { ...farm.toJSON() };
      // console.log("old_values ", old_values);
      // update the Farm data..
      await Farm.updateOne({ _id: id }, updatedData);

      farm = await Farm.findOne({ _id: id });
      const new_values = { ...farm.toJSON() };
      // console.log("new_values ", new_values);
      await Audit.create({
        table_name: "farm",
        record_id: farm._id,
        change_type: "update",
        old_value: JSON.stringify(old_values),
        new_value: JSON.stringify(new_values),
        user_id: userId,
        user_name: userLogged.name,
      });

      const {
        _id,
        farmer_id,
        file_name,
        name,
        address,
        tx_hash,
        farm_nft_id,
        ipfs_url,
        ...rest
      } = farm._doc;

      // IPFS----
      const options = {
        pinataMetadata: {
          name: farm.farmer_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options);
      const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`;
      farm.ipfs_url = ipfs_hash;

      await farm.save();

      const Tran = "https://mumbai.polygonscan.com/tx";

      //BLOCKCHAIN TRANSACTION-------
      const gasLimit = await farmNFTContract.methods
        .updateFarm(farm.farm_nft_id, ipfs_hash)
        .estimateGas({ from: adminAddr });
      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2)
      );

      const encodedData = farmNFTContract.methods
        .updateFarm(farm.farm_nft_id, ipfs_hash)
        .encodeABI();

      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: farmNFTAddr,
        value: "0x00",
        data: encodedData,
        from: adminAddr,
      };
      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key);
      const transaction = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log("Transaction : ", transaction.transactionHash);
      // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
      farm.tx_hash = `${Tran}/${transaction.transactionHash}`;

      await farm.save();
      response.message = `Successfully updated`;
      response.httpStatus = 200;
    } else {
      response.error = `farm not found`;
      response.httpStatus = 404;
    }
  } catch (error) {
    response.error = `failed operation ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

exports.updateFarmOld = async (req) => {
  const userLogged = req.user;
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { id } = req.params;

  const updatedData = req.body;

  // Checking Header for password
  const password = req.headers["password"];
  const envPassword = process.env.MASTER_PASSWORD; // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`;
    response.httpStatus = 401;
    return response;
  }

  // console.log("updatedData - ", updatedData);
  try {
    // First check farmer is their with id
    const farm = await Farm.findOne({ _id: id });

    if (farm) {
      // update the farm data..
      const old_values = { ...farm.toJSON() };
      // console.log("old_values ", old_values);
      await Farm.updateOne({ _id: id }, updatedData);

      let new_values = { ...updatedData };

      // console.log("new_values ", new_values);
      await Audit.create({
        table_name: "farms",
        record_id: farm.id,
        change_type: "update",
        old_value: JSON.stringify(old_values),
        new_value: JSON.stringify(new_values),
        user_id: userLogged.id,
        user_name: userLogged.name,
      });
      response.message = `Successfully updated`;
      response.httpStatus = 200;
    } else {
      response.error = `farm not found`;
      response.httpStatus = 404;
    }
  } catch (error) {
    response.error = `failed operation ${error}`;
    response.httpStatus = 500;
  }
  return response;
};

exports.getFarms = async (req) => {
  const sortOrder = req.query.sortOrder;
  const cropTypes = req.query.cropTypes;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };
  const searchQuery = {};

  if (req.query.search) {
    const searchValue = req.query.search;
    searchQuery["$or"] = [
      { name: new RegExp(req.query.search, "i") },
      {
        pin: !isNaN(parseInt(searchValue)) ? parseInt(searchValue) : undefined,
      },
    ];
  }

  try {
    let farmQuery = Farm.find(searchQuery).select("-__v");
    let totalDocuments = await farmQuery.countDocuments(searchQuery);

    // redefine the query before executing it again
    farmQuery = Farm.find(searchQuery);
    if (sortOrder === "low") {
      farmQuery = farmQuery.sort({ rating: 1 });
    } else if (sortOrder === "high") {
      farmQuery = farmQuery.sort({ rating: -1 });
    }

    // Apply filtering based on crop types
    if (cropTypes) {
      let cropTypesArray = cropTypes.split(",");
      farmQuery = farmQuery.where("cropTypes").in(cropTypesArray);
    }

    // Apply pagination
    if (page && limit) {
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalDocuments / limit);
      const farms = await farmQuery.skip(skip).limit(limit);
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: farms.map((farm) => ({
          ...farm._doc,
          createdAt: farm.createdAt.toLocaleString(),
          updatedAt: farm.updatedAt.toLocaleString(),
        })),
      };
    } else {
      const farms = await farmQuery;

      response.data = farms.map((farm) => ({
        ...farm._doc,
        createdAt: farm.createdAt.toLocaleString(),
        updatedAt: farm.updatedAt.toLocaleString(),
      }));
    }

    response.httpStatus = 200;
  } catch (error) {
    console.log(error);
    response.error = "failed operation";
    response.httpStatus = 400;
  }

  return response;
};

exports.createCustomer = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    (response.error = "no file selected"), (response.httpStatus = 400);
  }

  try {
    // Read the contents of the file
    const fileContent = req.files.file.data.toString();

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Save Farm data in mongoDB , skip id,s.no key in json
    const customers = await User.create(data);
    const prvCustomers = await User.find();

    if (customers.length != 0) {
      console.log("1");
      response.message = "Data Insertion successful";
      response.httpStatus = 200;
      response.data = data;
    } else {
      console.log("2");
      (response.error = "Data Insertion failed duplicate data"),
        (response.httpStatus = 500);
    }
  } catch (error) {
    (response.error = `Insertion failed ${error}`), (response.httpStatus = 400);
  }

  return response;
};

exports.getCustomers = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let customers;
  try {
    customers = await User.find({ is_verified: true }).select("-__v");
    (response.data = customers), (response.httpStatus = 200);
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 400);
  }
  return response;
};

exports.getAgreementsForAdmin = async (req) => {
  // console.log("Inside getAgreementsOfCustomer Service", req.user);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // // Grouping farm... for Admin to show in their active/close Tab
  try {
    const activeContractswithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          agreementclose_status: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer_data",
        },
      },
      {
        $group: {
          _id: {
            crop: "$crop",
            start_date: "$start_date",
            end_date: "$end_date",
            price: "$price",
            area: "$area",
            farm_id: "$farm_id",
            customer_id: "$customer_id",
          },
          address: { $first: "$address" },
          farmer_name: { $first: "$farmer_name" },
          agreements: { $push: "$_id" },
          ipfs_url: { $push: "$ipfs_url" },
          tx_hash: { $push: "$tx_hash" },
          agreement_nft_id: { $push: "$agreement_nft_id" },
          unit_bought: { $sum: 1 },
          customer_name: {
            $first: { $arrayElemAt: ["$customer_data.name", 0] },
          },
          customer_email: {
            $first: { $arrayElemAt: ["$customer_data.email", 0] },
          },
          customer_phone: {
            $first: { $arrayElemAt: ["$customer_data.phone", 0] },
          },
          customer_address: {
            $first: { $arrayElemAt: ["$customer_data.address", 0] },
          },
        },
      },
    ]);

    // const activeContractsWithCustomerData = await Agreement.aggregate([
    //   {
    //     $match: {
    //       sold_status: true,
    //       agreementclose_status: false,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$area",
    //       farmer_name: { $first: "$farmer_name" },
    //       farm_id: { $first: "$farm_id" },
    //       crop: { $first: "$crop" },
    //       address: { $first: "$address" },
    //       price: { $first: "$price" },
    //       start_date: { $first: "$start_date" },
    //       end_date: { $first: "$end_date" },
    //       agreements: { $push: "$_id" },
    //       customer_id: { $push: "$customer_id" },
    //       ipfs_url: { $push: "$ipfs_url" },
    //       tx_hash: { $push: "$tx_hash" },
    //       agreement_nft_id: { $push: "$agreement_nft_id" },
    //       unit_available: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "customer_id",
    //       foreignField: "_id",
    //       as: "customer_data",
    //     },
    //   },
    //   {
    //     $unwind: "$customer_data",
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       farmer_name: { $first: "$farmer_name" },
    //       farm_id: { $first: "$farm_id" },
    //       crop: { $first: "$crop" },
    //       address: { $first: "$address" },
    //       price: { $first: "$price" },
    //       start_date: { $first: "$start_date" },
    //       end_date: { $first: "$end_date" },
    //       agreements: { $first: "$agreements" },
    //       customer_id: { $first: "$customer_id" },
    //       ipfs_url: { $first: "$ipfs_url" },
    //       tx_hash: { $first: "$tx_hash" },
    //       agreement_nft_id: { $first: "$agreement_nft_id" },
    //       unit_available: { $first: "$unit_available" },
    //       customer_name: { $first: "$customer_data.name" },
    //       customer_phone: { $first: "$customer_data.phone" },
    //       customer_email: { $first: "$customer_data.email" },
    //       customer_address: { $first: "$customer_data.address" },
    //     },
    //   },
    // ]);

    const closeContractswithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          agreementclose_status: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer_data",
        },
      },
      {
        $group: {
          _id: {
            crop: "$crop",
            start_date: "$start_date",
            end_date: "$end_date",
            price: "$price",
            area: "$area",
            farm_id: "$farm_id",
            customer_id: "$customer_id",
          },
          address: { $first: "$address" },
          farmer_name: { $first: "$farmer_name" },
          agreements: { $push: "$_id" },
          ipfs_url: { $push: "$ipfs_url" },
          tx_hash: { $push: "$tx_hash" },
          agreement_nft_id: { $push: "$agreement_nft_id" },
          unit_bought: { $sum: 1 },
          customer_name: {
            $first: { $arrayElemAt: ["$customer_data.name", 0] },
          },
          customer_email: {
            $first: { $arrayElemAt: ["$customer_data.email", 0] },
          },
          customer_phone: {
            $first: { $arrayElemAt: ["$customer_data.phone", 0] },
          },
          customer_address: {
            $first: { $arrayElemAt: ["$customer_data.address", 0] },
          },
        },
      },
    ]);

    response.httpStatus = 200;
    response.data = {
      active: activeContractswithCustomerData,
      close: closeContractswithCustomerData,
    };
  } catch (error) {
    response.httpStatus = 400;
    response.error = "failed operation";
  }
  return response;
};

exports.closeAgreement = async (req) => {
  //console.log("Inside closeAgreement");
  const { id } = req.params; // Agreement Id agreement to Update
  //console.log("id :- ", id);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  try {
    // Update ageementClose status to true :-
    const agreementUpdated = await Agreement.updateOne(
      { _id: id },
      { agreementclose_status: true }
    );
    console.log("agreementUpdated :- ", agreementUpdated);
    response.message = "Agreement closed Successful";
    response.httpStatus = 200;
  } catch (error) {
    response.error = `failed operation ${error}`;
    response.httpStatus = 200;
  }

  return response;
};

exports.getdashBoard = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: {
      farms: null,
      contracts: null,
      farmers: null,
      customers: null,
    },
  };

  try {
    const farms = await Farm.countDocuments();
    const farmers = await Farmer.countDocuments();
    const customers = await User.countDocuments();
    const agreements = await Agreement.countDocuments({ sold_status: false });
    (response.httpStatus = 200), (response.data.farmers = farmers);
    response.data.customers = customers;
    response.data.farms = farms;
    response.data.contracts = agreements;
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 500);
  }

  return response;
};

exports.getAudit = async (req) => {
  const page = parseInt(req.query.page) || 1; // get the page number or set to 1 by default
  const limit = parseInt(req.query.limit) || 2;

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Check if params if farmer,farm,agreement
  try {
    if (req.params.table == "farmer" && page && limit) {
      let auditQuery = Audit.find({ table_name: "farmers" }).select("-__v");
      let totalDocuments = await Audit.countDocuments(auditQuery);

      const skip = (page - 1) * limit;

      const auditLog = await Audit.find(auditQuery)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit)
        .select("-__v -_id -table_name");

      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: auditLog.map((audit) => ({
          ...audit._doc,
          createdAt: audit.createdAt.toLocaleString(),
          updatedAt: audit.updatedAt.toLocaleString(),
        })),
      };
      response.httpStatus = 200;
    } else if (req.params.table == "farm") {
      let auditQuery = Audit.find({ table_name: "farm" }).select("-__v");
      let totalDocuments = await Audit.countDocuments(auditQuery);

      const skip = (page - 1) * limit;

      const auditLog = await Audit.find(auditQuery)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit)
        .select("-__v -_id -table_name");
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: auditLog.map((audit) => ({
          ...audit._doc,
          createdAt: audit.createdAt.toLocaleString(),
          updatedAt: audit.updatedAt.toLocaleString(),
        })),
      };
      response.httpStatus = 200;
    } else if (req.params.table == "agreement") {
      let auditQuery = Audit.find({ table_name: "agreements" }).select("-__v");
      let totalDocuments = await Audit.countDocuments(auditQuery);

      const skip = (page - 1) * limit;

      const auditLog = await Audit.find(auditQuery)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit)
        .select("-__v -_id -table_name");

      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: auditLog.map((audit) => ({
          ...audit._doc,
          createdAt: audit.createdAt.toLocaleString(),
          updatedAt: audit.updatedAt.toLocaleString(),
        })),
      };
      response.httpStatus = 200;
    } else {
      response.message = "Enter params :- farmer or farm or agreement";
      response.httpStatus = 200;
    }
  } catch (error) {
    console.log("ERR", error);
    response.error = "failed operation";
    response.httpStatus = 500;
  }

  return response;
};

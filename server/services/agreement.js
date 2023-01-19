const Farmer = require("../models/farmers");
const Farm = require("../models/farms");
const User = require("../models/users");
const Agreement = require("../models/agreements");

exports.createAgreement = async (req) => {
  console.log("Inside create Agreement service");
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
  }

  const fileContent = req.files.file.data.toString();

  // Parse the JSON data
  const data = JSON.parse(fileContent);

  try {
    // Read the contents of the file

    const agreements = await Agreement.create(data);
    console.log("agreements", agreements);

    if (agreements.length != 0) {
      (response.message = "Data Insertion successful"),
        (response.httpStatus = 200),
        (response.data = data);
    } else {
      (response.error = "Data Insertion failed duplicate data"),
        (response.httpStatus = 500);
    }
  } catch (error) {
    response.message = `operation failed ${error}`;
    response.httpStatus = 500;
  }

  return response;
};

exports.getAgreements = async (req) => {
  console.log("Inside get agreement server");
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let agreements;
  try {
    agreements = await Agreement.find().select("-__v");

    response.data = agreements;
    response.httpStatus = 200;
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 400);
  }
  return response;
};

exports.getAgreementByCustomerId = async (req) => {
  console.log("Inside getAgreementByCustomerId server");
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let agreements;
  try {
    agreements = await Agreement.find().select("-__v");

    response.data = agreements;
    response.httpStatus = 200;
  } catch (error) {
    (response.error = "failed operation"), (response.httpStatus = 400);
  }
  return response;
};

exports.buyAgreement = async (req) => {
  console.log("Inside buy agreement service");
  const agreementId = req.params.id;
  console.log("agreementId : ", agreementId);

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  let agreement;
  try {
    agreement = await Agreement.findOne({
      _id: agreementId,
    }).select("-__v");
    console.log("agreement : ", agreement);
  } catch (error) {
    console.log("error", error);
  }
  (response.message = "working"),
    (response.httpStatus = 200),
    (response.data = agreement);

  return response;
};

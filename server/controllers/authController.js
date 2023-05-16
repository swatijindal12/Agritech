// import { Request, Response, NextFunction } from "express";
const User = require("../models/users");
const sendToken = require("../utils/jwtToken");
const emailTransporter = require("../utils/emailTransporter");
const getEnvVariable = require("../config/privateketAWS");

// Calling function to get the privateKey from aws params storage
async function getKeyFromAWS(keyName) {
  const awsKeyValue = await getEnvVariable(keyName);
  // return
  return awsKeyValue[`${keyName}`];
}

let authToken = "";
// Initialize the pinata object using an asynchronous IIFE
(async () => {
  authToken = await getKeyFromAWS("TWILIO_AUTH_TOKEN");
})();

// Twilio setup start
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
// Twilio setup end

const { logger } = require("../utils/logger");
const { errorLog } = require("../utils/commonError");

// Importing all the services
const authService = require("../services/auth");

// Route to     => api/v1/auth/register
exports.createUser = async (req, res, next) => {
  authService
    .createUser(req)
    .then((response) => {
      res.status(response.httpStatus).json(response);
    })
    .catch((err) => {
      errorLog(req, err);
      res.json(err);
    });
  next();
};

// Route to     => api/v1/auth/verify-register

exports.verifyCreateUser = async (req, res, next) => {
  const { phone, otp } = req.body;

  // Checks if phone or otp is entered by user
  if (!phone || !otp) {
    return res.status(400).json({
      error: "Enter phone number & otp",
      message: null,
      httpStatus: 400,
      data: null,
    });
  }

  // Finding user in database which is not verified with this Phone.
  const user = await User.findOne({ phone, is_verified: false });

  // checking
  if (!user) {
    return res.status(404).json({
      error: "User not found",
      message: null,
      httpStatus: 404,
      data: null,
    });
  }

  try {
    // verifying otp with twilio service .
    const verification_check = await client.verify
      .services(serviceId)
      .verificationChecks.create({ to: "+91" + phone, code: otp });

    if (verification_check.status === "approved") {
      // update is_verified
      const result = await User.updateOne(
        { phone: phone },
        { is_verified: true }
      );

      // creating a message
      const message = {
        from: process.env.EMAIL_ID,
        to: process.env.ADMIN_EMAIL,
        subject: "Agritrust User Registration",
        text: `A new user  "${user.name}"  is registered with email  ${user.email}`,
      };

      // sending email.
      emailTransporter.sendMail(message, (error, info) => {
        if (error) {
          errorLog(req, error);
          console.log("Nodemailer error : ", error);
        } else {
          console.log("Email sent: ");
          logger.log("info", "Email sent");
        }
      });

      logger.log("info", "User created successfully");
      return res.status(200).json({
        error: null,
        message: "User created successfully",
        httpStatus: 200,
        data: user,
      });
    } else {
      return res.status(400).json({
        error: "Verification failed",
        message: null,
        httpStatus: 400,
        data: null,
      });
    }
  } catch (error) {
    errorLog(req, error);
    return res.status(500).json({
      error: `failed operation ${error}`,
      message: null,
      httpStatus: 500,
      data: null,
    });
  }
  next();
};

// Route to      => api/v1/auth/login
exports.loginUser = async (req, res, next) => {
  authService
    .login(req)
    .then((response) => {
      res.status(response.httpStatus).json(response);
    })
    .catch((err) => {
      errorLog(req, err);
      res.json(err);
    });
  next();
};

// Route to      => api/v1/auth/verify
exports.verifyUser = async (req, res, next) => {
  const { phone, otp } = req.body;

  // Checks if phone or otp is entered by user
  if (!phone || !otp) {
    return res.status(400).json({
      error: "Enter phone number & otp",
      message: null,
      httpStatus: 400,
      data: null,
    });
  }

  // Finding user in database
  const user = await User.findOne({ phone, is_verified: true });

  // checking
  if (!user) {
    logger.log("info", "User not found");
    return res.status(404).json({
      error: "User not found",
      message: null,
      httpStatus: 404,
      data: null,
    });
  }

  // verifying otp with twilio service .
  // client.verify
  //   .services(serviceId)
  //   .verificationChecks.create({ to: "+91" + phone, code: otp })
  //   .then((verification_check) => {
  //     if (verification_check.status === "approved") {
  //       // Create JSON Web token
  //       logger.log("info", "verified in twilio");
  //       sendToken(user, res);
  //     } else {
  //       logger.log("info", "User not found");
  //       return res.status(400).json({
  //         error: "failed operation",
  //         message: null,
  //         httpStatus: 400,
  //         data: null,
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     errorLog(req, error);
  //     return res.status(500).json({
  //       error: `failed operation ${error}`,
  //       message: null,
  //       httpStatus: 500,
  //       data: null,
  //     });
  //   });

  sendToken(user, res); // uncomment for withoutotp
  next();
};

// Route to     => api/v1/auth/logout
exports.logoutUser = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    error: null,
    message: "Logout successfully",
    httpStatus: 200,
    data: null,
  });
  next();
};

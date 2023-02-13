// import { Request, Response, NextFunction } from "express";
const User = require("../models/users");
const sendToken = require("../utils/jwtToken");

// Twilio setup start
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
// Twilio setup end

// Importing all the services
const authService = require("../services/auth");

// Route to      => api/v1/auth/login
exports.loginUser = async (req, res, next) => {
  authService
    .login(req)
    .then((response) => {
      console.log("response : ", response);
      res.status(response.httpStatus).json(response);
    })
    .catch((err) => res.json(err));
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
  const user = await User.findOne({ phone });

  // checking
  if (!user) {
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
  //       sendToken(user, res);
  //     } else {
  //       return res.status(400).json({
  //         error: "failed operation",
  //         message: null,
  //         httpStatus: 400,
  //         data: null,
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     return res.status(500).json({
  //       error: "failed operation",
  //       message: null,
  //       httpStatus: 500,
  //       data: null,
  //     });
  //   });

  sendToken(user, res); // uncomment for withoutotp
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
};

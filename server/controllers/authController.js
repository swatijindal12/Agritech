// import { Request, Response, NextFunction } from "express";
const User = require("../models/users");
const sendToken = require("../utils/jwtToken");

// Twilio setup start
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
// Twilio setup end

// Route to      => api/v1/auth/login
exports.loginUser = async (req, res, next) => {
  const { mobile_number } = req.body;

  // Checks if mobile_number is entered by user
  if (!mobile_number) {
    return res.status(400).json({
      error: "Enter mobile number",
      message: null,
      httpStatus: 400,
      data: null,
    });
  }

  try {
    // Finding user in database
    const user = await User.findOne({ mobile_number });

    // Checking user
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: null,
        httpStatus: 404,
        data: null,
      });
    }

    // Twilio send OTP service
    client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: "+91" + user.mobile_number,
        channel: "sms",
      })
      .then((verification) =>
        res.status(200).json({
          error: null,
          message: "OTP sent to your number.",
          httpStatus: 200,
          data: user.role,
        })
      )
      .catch((error) => {
        return res.status(400).json({
          error: "failed operation",
          message: null,
          httpStatus: 400,
        });
      });
  } catch (error) {
    return res.status(400).json({
      error: "failed operation",
      message: null,
      httpStatus: 400,
      data: null,
    });
  }
};

// Route to      => api/v1/auth/verify
exports.verifyUser = async (
  req,
  res,
  next
) => {
  const { mobile_number, otp } = req.body;

  // Checks if mobile_number or otp is entered by user
  if (!mobile_number || !otp) {
    return res.status(400).json({
      error: "Enter mobile number & otp",
      message: null,
      httpStatus: 400,
      data: null,
    });
  }

  // Finding user in database
  const user = await User.findOne({ mobile_number });

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
  client.verify
    .services(serviceId)
    .verificationChecks.create({ to: "+91" + mobile_number, code: otp })
    .then((verification_check) => {
      if (verification_check.status === "approved") {
        // Create JSON Web token
        console.log("approved", verification_check);

        sendToken(user, res);
      } else {
        return res.status(400).json({
          error: "failed operation",
          message: null,
          httpStatus: 400,
          data: null,
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        error: "failed operation",
        message: null,
        httpStatus: 500,
        data: null,
      });
    });
};

// Route to     => api/v1/auth/logout
exports.logoutUser = async (
  req,
  res,
  next
) => {
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

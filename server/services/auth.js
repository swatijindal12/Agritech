// import { Request, Response, NextFunction } from "express";
const User = require("../models/users");
const sendToken = require("../utils/jwtToken");

// Twilio setup start
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
// Twilio setup end

// Login service
exports.login = async (req) => {

    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    // Reading 
    const { phone } = req.body;

    // Checks if phone is entered by user
    if (!phone) {
        response.httpStatus = 400;
        response.error = "Enter phone number"
    }

    try {
        // Finding user in database
        const user = await User.findOne({ phone });

        // Checking user
        if (!user) {
            response.httpStatus = 404;
            response.error = "User not found"
        }

        // Twilio send OTP service
        client.verify.v2
            .services(serviceId)
            .verifications.create({
                to: "+91" + user.phone,
                channel: "sms",
            })
            .then((verification) =>
                response.httpStatus = 200,
                response.message = `OTP sent to your number`,
                response.httpStatus = 200
            )
            .catch((error) => {
                response.httpStatus = 400,
                response.error= `failed operation ${error}`
            });
    } catch (error) {
        response.httpStatus = 400,
        response.error= `failed operation 2 ${error}`
    }
    
    return response;
};


exports.verify = async (req) => {

    // General response format
    let response = {
        error: null,
        message: null,
        httpStatus: null,
        data: null
    }

    const { phone, otp } = req.body;

    // Checks if phone or otp is entered by user
    if (!phone || !otp) {
        response.httpStatus = 400
        response.error = "Enter phone number and otp"
    }

    // Finding user in database
    const user = await User.findOne({ phone });
   
    // checking
    if (!user) {
        response.httpStatus = 404
        response.error = "User not found"
    }

    // verifying otp with twilio service .
    client.verify
        .services(serviceId)
        .verificationChecks.create({ to: "+91" + phone, code: otp })
        .then((verification_check) => {
            if (verification_check.status === "approved") {
                // Create JSON Web token
                const token = user.getJwtToken();
                console.log("token : ", token);
                response.httpStatus = 200,
                response.data = token
            } else {
                response.httpStatus = 404
                response.error = `failed operation`
            }
        })
        .catch((error) => {
            response.httpStatus = 500
            response.error = "failed operation"
        });
    return response
}

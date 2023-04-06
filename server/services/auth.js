const validator = require("validator");
// import { Request, Response, NextFunction } from "express";
const User = require("../models/users");
const sendToken = require("../utils/jwtToken");
const emailTransporter = require("../utils/emailTransporter");

// Twilio setup start
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
// Twilio setup end

const nameRegex = /^[A-Za-z'-\s]+$/;

// Create customer
exports.createUser = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Reading
  const { name, address, phone, email } = req.body;

  //Checking user with phone & email
  const userWithPhone = await User.findOne({ phone });
  const userWithEmail = await User.findOne({ email });

  try {
    ////Checking user with phone & email
    if (userWithPhone) {
      response.httpStatus = 400;
      response.error = "phone already exist";
      return response;
    } else if (userWithEmail) {
      response.httpStatus = 400;
      response.error = "email already exist";
      return response;
    } else if (
      !validator.matches(name, nameRegex) ||
      !validator.isLength(name, { min: 3, max: 100 })
    ) {
      response.httpStatus = 400;
      response.error =
        "Name only contain alphabets & length must be greater than 3";
      return response;
    } else if (
      !validator.isMobilePhone(phone) ||
      phone.length < 10 ||
      phone.length > 10
    ) {
      response.httpStatus = 400;
      response.error = "Phone should be of length of 10";
      return response;
    } else if (!validator.isEmail(email)) {
      response.httpStatus = 400;
      response.error = "Invalid email address";

      return response;
    } else if (!validator.isLength(address, { min: 5, max: 100 })) {
      response.httpStatus = 400;
      response.error =
        "Address should be of length greater than 5 less than 100";

      return response;
    } else if (name && address && phone && email) {
      // if all field are entered then create user/customer
      const user = await User.create({ name, address, phone, email });

      // Twilio send OTP service
      // client.verify.v2
      //   .services(serviceId)
      //   .verifications.create({
      //     to: "+91" + phone,
      //     channel: "sms",
      //   })
      //   .then(
      //     (verification) => (response.httpStatus = 200),
      //     (response.message = `OTP sent to your number ${verification}`),
      //     (response.httpStatus = 200)
      //   )
      //   .catch((error) => {
      //     (response.httpStatus = 400),
      //       (response.error = `failed operation ${error}`);
      //   });
      (response.message = `OTP sent to your number`),
        (response.httpStatus = 200);
    } else {
      // if some fields are empty
      response.httpStatus = 400;
      response.error = "some fields are empty";
    }
  } catch (error) {
    response.httpStatus = 500;
    // console.log(error);
    response.error = `${error}`;
  }

  return response;
};

exports.verifyCreateUser = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  const { phone, otp } = req.body;

  // Checks if phone or otp is entered by user
  if (!phone || !otp) {
    response.httpStatus = 400;
    response.error = "Enter phone number and otp";

    return response;
  }

  // Finding user in database which is not verified with this Phone.
  const user = await User.findOne({ phone, is_verified: false });

  // checking
  if (!user) {
    response.httpStatus = 404;
    response.error = "User not found";
    return response;
  }

  // verifying otp with twilio service .
  // client.verify
  //   .services(serviceId)
  //   .verificationChecks.create({ to: "+91" + phone, code: otp })
  //   .then(async (verification_check) => {
  //     if (verification_check.status === "approved") {
  //       console.log("verification_check :", verification_check);
  //       //update is_verified
  //       await User.updateOne({ phone: phone }, { is_verified: true });
  //       (response.httpStatus = 200), (response.data = token);
  //     } else {
  //       response.httpStatus = 500;
  //       response.error = `failed operation`;
  //     }
  //   })
  //   .catch((error) => {
  //     response.httpStatus = 500;
  //     response.error = "failed operation";
  //   });

  //creating a message
  const message = {
    from: process.env.EMAIL_ID,
    to: process.env.ADMIN_EMAIL,
    subject: "Agritrust User Registration",
    text: `A new user  "${user.name}"  is registered with email  ${user.email}`,
  };

  //update is_verified
  await User.updateOne({ phone: phone }, { is_verified: true });

  //sending email.
  emailTransporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("Nodemailer error : ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  response.message = "user created successful";
  response.httpStatus = 201;
  response.data = user;
  return response;
};

// Login service
exports.login = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  // Reading
  const { phone } = req.body;

  try {
    // Checks if phone is entered by user
    if (!phone) {
      response.httpStatus = 400;
      response.error = "Enter phone number";
    } else if (
      !validator.isMobilePhone(phone) ||
      phone.length < 10 ||
      phone.length > 10
    ) {
      response.httpStatus = 400;
      response.error = "Phone number should be of length of 10";
      return response;
    }

    // Finding user in database
    const user = await User.findOne({ phone, is_verified: true });

    // Checking user
    if (!user) {
      response.httpStatus = 404;
      response.error = "User not found";
      return response;
    }

    // Twilio send OTP service
    // client.verify.v2
    //   .services(serviceId)
    //   .verifications.create({
    //     to: "+91" + user.phone,
    //     channel: "sms",
    //   })
    //   .then(
    //     (verification) => (response.httpStatus = 200),
    //     (response.message = `OTP sent to your number`),
    //     (response.httpStatus = 200)
    //   )
    //   .catch((error) => {
    //     (response.httpStatus = 400),
    //       (response.error = `failed operation ${error}`);
    //   });
    response.message = `OTP sent to your number`;
    response.httpStatus = 200;
  } catch (error) {
    response.httpStatus = 404;
    response.error = `User not found`;
  }

  return response;
};

// verify service working...
// exports.verify = async (req) => {
//   // General response format
//   let response = {
//     error: null,
//     message: null,
//     httpStatus: null,
//     data: null,
//   };

//   const { phone, otp } = req.body;

//   // Checks if phone or otp is entered by user
//   if (!phone || !otp) {
//     response.httpStatus = 400;
//     response.error = "Enter phone number and otp";
//   }

//   // Finding user in database
//   const user = await User.findOne({ phone, is_verified: true });

//   // checking
//   if (!user) {
//     response.httpStatus = 404;
//     response.error = "User not found";
//   }

//   // verifying otp with twilio service .
//   client.verify
//     .services(serviceId)
//     .verificationChecks.create({ to: "+91" + phone, code: otp })
//     .then((verification_check) => {
//       if (verification_check.status === "approved") {
//         // Create JSON Web token
//         const token = user.getJwtToken();
//         console.log("token : ", token);
//         (response.httpStatus = 200), (response.data = token);
//       } else {
//         response.httpStatus = 404;
//         response.error = `failed operation`;
//       }
//     })
//     .catch((error) => {
//       response.httpStatus = 500;
//       response.error = "failed operation";
//     });
//   return response;
// };

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Validate Email.
const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// User(Customer, Admin) Model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlegth: 3,
      maxlength: 50,
    },
    privatekey: {
      type: String,
    },
    publickey: {
      type: String,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlegth: 5,
      maxlength: 200,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      minlength: [10, "Please enter 10 digit valid number"],
      maxlength: [10, "Please enter 10 digit valid number"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    food_grain: {
      type: Boolean,
      default: false,
      required: true,
    },
    vegetable: {
      type: Boolean,
      default: false,
      required: true,
    },
    horticulture: {
      type: Boolean,
      default: false,
      required: true,
    },
    floriculture: {
      type: Boolean,
      default: false,
      required: true,
    },
    exotic_crop: {
      type: Boolean,
      default: false,
      required: true,
    },
    role: {
      type: String,
      required: [true, "Please select Role."],
      enum: {
        values: ["admin", "customer"],
        message: "Please select correct options for role.",
      },
      default: "customer",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Return JSON Web Token [UTIL FOLDER]
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Exporting userSchema as User
module.exports = mongoose.model("User", userSchema);

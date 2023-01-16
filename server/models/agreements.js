const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// User Model
const agreementSchema = new mongoose.Schema(
  {
    customer_id: {
      type: String,
      trim: true,
      required: true,
    },
    farmer_name: {
      type: String,
      required: [true, "Enter farmer Name"],
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
      default: Date.now,
    },
    agreement_nft_id: {
      type: Boolean,
      required: [true, "Please select validated status."],
      unique: [true, "Already used."],
    },
    crop: {
      type: String,
      required: [true, "Enter the crops"],
    },
    quantity: {
      type: String,
      required: [true, "Enter the quantity of crops"],
    },
    ipfs_url: {
      type: String,
      required: [true, "Please select ipfs url"],
    },
    sold_status: {
      type: Boolean,
      default: false,
    },
    agreementclose_status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Exporting userSchema as User
module.exports = mongoose.model("Agreement", agreementSchema);

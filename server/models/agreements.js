const mongoose = require("mongoose");
// User Model
const agreementSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    farmer_name: {
      type: String,
      required: [true, "Enter farmer Name"],
    },
    farm_id: {
      type: Number,
    },
    address: {
      type: String,
    },
    start_date: {
      type: String,
      default: Date.now,
    },
    end_date: {
      type: String,
      default: Date.now,
    },
    agreement_nft_id: {
      type: String,
      unique: [true, "Already used."],
    },
    tx_hash: {
      type: String,
    },
    crop: {
      type: String,
      required: [true, "Enter the crops"],
    },
    area: {
      type: String,
      required: [true, "Enter the quantity of crops"],
    },
    price: {
      type: Number,
      required: [true, "Enter amount"],
    },
    ipfs_url: {
      type: String,
      required: [true, "Please select ipfs url"],
    },
    farm_nft_id: {
      type: String,
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

const mongoose = require("mongoose");
// User Model
const stageAgreementSchema = new mongoose.Schema(
  {
    file_name: {
      type: String,
    },
    farmer_name: {
      type: String,
    },
    farm_id: {
      type: String,
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
    crop: {
      type: String,
    },
    area: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Enter amount"],
    },
    farm_nft_id: {
      type: String,
    },
    stage_status: {
      type: Boolean,
      default: true,
    },
    approval_status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Exporting userSchema as User
module.exports = mongoose.model("StageAgreement", stageAgreementSchema);

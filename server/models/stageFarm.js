const mongoose = require("mongoose");
// User Model
const stageFarmSchema = new mongoose.Schema(
  {
    file_name: {
      type: String,
    },
    farmer_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlegth: 3,
      maxlength: 50,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlegth: 5,
      maxlength: 200,
    },
    pin: {
      type: Number,
      required: true,
      trim: true,
      minlength: [6, "Please enter 6 digit Pin."],
      maxlength: [6, "Please enter 6 digit Pin."],
    },
    rating: {
      type: Number,
    },
    image_url: {
      type: String,
    },
    video_url: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    farm_size: {
      type: String,
      trim: true,
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
    farm_pdf: {
      type: String,
    },
    farm_practice_pdf: {
      type: String,
    },
    farm_practice_rating: {
      type: Number,
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
module.exports = mongoose.model("stageFarm", stageFarmSchema);

const mongoose = require("mongoose");

// User(Customer, Admin) Model
const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    razorpay_order_id: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      default: "INR",
    },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Exporting userSchema as User
module.exports = mongoose.model("Order", orderSchema);

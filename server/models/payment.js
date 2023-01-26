const mongoose = require("mongoose");

// User(Customer, Admin) Model
const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    razorpay_reference_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_payment_signature: {
      type: String,
    },
    payment_status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Exporting userSchema as User
module.exports = mongoose.model("Payment", paymentSchema);

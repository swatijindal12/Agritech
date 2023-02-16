const mongoose = require("mongoose");

// User(Customer, Admin) Model
const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    agreement_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agreement",
    },
    price: {
      type: Number,
    },
    unit: {
      type: Number,
    },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Exporting userSchema as User
module.exports = mongoose.model("OrderItem", orderItemSchema);

const mongoose = require("mongoose");
// User Model
const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        agreementIds: [{ type: String, required: true }],
        unit_price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Exporting userSchema as User
module.exports = mongoose.model("Cart", cartSchema);

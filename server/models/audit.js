const mongoose = require("mongoose");

// User Model
const auditSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    table_name: {
      type: String,
      required: true,
    },
    record_id: {
      type: String,
      required: true,
    },
    change_type: {
      type: String,
      required: true,
    },
    change_reason: { type: String, default: "Change made" }, // add reason_change field
    old_value: { type: String },
    new_value: { type: String },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);

// Exporting userSchema as User
module.exports = mongoose.model("Audit", auditSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

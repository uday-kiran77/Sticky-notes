const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, trim: true },
    notes: { type: Array },
  },
  {
    collection: "users",
  }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;

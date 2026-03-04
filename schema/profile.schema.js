const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: "English",
    },
    theme: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "author"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);

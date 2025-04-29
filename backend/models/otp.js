const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, expires: "10m", default: Date.now },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;

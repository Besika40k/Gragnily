const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
  ],
});

const user = mongoose.model("user", userSchema);

module.exports = user;

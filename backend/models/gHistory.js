const mongoose = require("mongoose");

const gHistorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  history: [
    {
      role: {
        type: String,
        enum: ["user", "model"],
        required: true,
      },
      parts: [{ text: String }],
    },
  ],
});

const gHistory = mongoose.model("gHistory", gHistorySchema);

module.exports = gHistory;

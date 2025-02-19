const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const generalChatSchema = new mongoose.Schema(
  {
    userId: String,
    history: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GeneralChat", generalChatSchema);

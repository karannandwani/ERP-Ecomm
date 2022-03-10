var mongoose = require("mongoose");

var DeviceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String },
  platform: { type: String, required: true, enum: ["web", "android", "ios"] },
  experienceId: { type: String },
});

module.exports = mongoose.model("Device", DeviceSchema);

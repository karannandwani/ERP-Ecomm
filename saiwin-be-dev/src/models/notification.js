const mongoose = require("mongoose");

var Notification = mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  data: { type: Object, required: true },
  sentToUsers: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
});

module.exports = mongoose.model("Notification", Notification);

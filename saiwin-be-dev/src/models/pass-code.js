var mongoose = require("mongoose");

var PassCodeSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

PassCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 });
module.exports = mongoose.model("PassCode", PassCodeSchema);

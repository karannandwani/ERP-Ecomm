var mongoose = require("mongoose");

var LocationSchema = mongoose.Schema({
  type: { type: String, enum: ["Polygon"], required: true },
  coordinates: { type: [[[Number]]], required: true },
});

var BeatSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  business: { type: String, required: true },
  areas: { type: String },
  active: { type: Boolean, required: true, default: false },
  location: { type: LocationSchema },
  assigned: { type: Boolean, default: false },
});

BeatSchema.index({ name: 1, business: 1 }, { unique: true });
module.exports = mongoose.model("Beat", BeatSchema);

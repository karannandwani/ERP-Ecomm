const mongoose = require("mongoose");

var beatDateList = mongoose.Schema({
  beat: { type: mongoose.Types.ObjectId, ref: "Beat" },
  day: { type: String, required: true, enum: ['0', '1', '2', '3', '4', '5', '6'] },
});

var assignBeatSchema = mongoose.Schema({
  salesPerson: { type: mongoose.Types.ObjectId, ref: "User" },
  business: { type: String, required: true },
  beatDateList: { type: [beatDateList] },
});
assignBeatSchema.set('validateBeforeSave', true);
module.exports = mongoose.model("assignBeat", assignBeatSchema);

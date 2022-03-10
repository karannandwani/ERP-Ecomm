const mongoose = require("mongoose");

var StaticData = mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  business: { type: mongoose.Types.ObjectId, ref: "Business" },
});

StaticData.index(
  {
    key: 1,
    business: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("StaticData", StaticData);

const mongoose = require("mongoose");

var StockMismatchReason = mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  facility: { type: mongoose.Types.ObjectId, ref: "Facility", required: true },
});

module.exports = mongoose.model("StockMismatchReason", StockMismatchReason);

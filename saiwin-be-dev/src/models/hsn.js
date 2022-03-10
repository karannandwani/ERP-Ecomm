var mongoose = require("mongoose");

var HSNSchema = mongoose.Schema({
  hsn: { type: String, required: true, trim: true },
  business: { type: String, required: true },
  description: { type: String },
  tax: [{ type: mongoose.Types.ObjectId, ref: "Tax" }],
});

HSNSchema.index({ hsn: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("HSN", HSNSchema);

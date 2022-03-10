var mongoose = require("mongoose");

var RedirectData = mongoose.Schema({
  id: { type: mongoose.Types.ObjectId, required: true },
  type: { type: String, required: true },
});

var SlideImage = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true, enum: ["URL", "FILE"] },
  aspectRatio: { type: Object, required: true },
  redirectData: { type: RedirectData, required: true },
  business: { type: String, required: true },
});

SlideImage.index({ name: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("SlideImage", SlideImage);

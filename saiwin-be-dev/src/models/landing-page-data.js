var mongoose = require("mongoose");

var DataExtractQuery = mongoose.Schema({
  type: { type: String, required: true },
  query: { type: Object, required: true },
  limit: { type: Number },
});

var LandingPageData = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Product", "Category", "Carousel", "Image"],
  },
  order: { type: Number, required: true },
  dataQuery: { type: DataExtractQuery },
  business: { type: mongoose.Types.ObjectId, ref: "Business", required: true },
  active: { type: Boolean, default: true, required: true },
  slideImages: [{ type: mongoose.Types.ObjectId, ref: "SlideImage" }],
  viewType: { type: String },
});

module.exports = mongoose.model("LandingPageData", LandingPageData);

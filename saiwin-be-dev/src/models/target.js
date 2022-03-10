var mongoose = require("mongoose");

var MonthTarget = {
  month: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  amount: { type: String, required: true },
};

var YearTarget = {
  year: { type: String, required: true, unique: true },
  yearTargetAmount: { type: String, required: true },
  monthTarget: { type: [MonthTarget] },
};

var Target = mongoose.Schema({
  business: { type: mongoose.Types.ObjectId, ref: "Business" },
  salesPerson: { type: mongoose.Types.ObjectId, ref: "User" },
  target: { type: [YearTarget] },
});

module.exports = mongoose.model("Target", Target);

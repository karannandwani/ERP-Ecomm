const mongoose = require("mongoose");

var AccountSchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Account", AccountSchema);

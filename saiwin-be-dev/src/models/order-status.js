var mongoose = require("mongoose");

/**
 * @typedef OrderStatus
 * @property { String } name.required
 */
var OrderStatusSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
});

// OrderStatusSchema.index({ name: 1, businessId: 1 }, { unique: true });

module.exports = mongoose.model("OrderStatus", OrderStatusSchema);

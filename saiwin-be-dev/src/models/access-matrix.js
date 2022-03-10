var mongoose = require("mongoose");

/**
 * @typedef AccessMatrix
 * @property { String } resource.required
 * @property { String } roleId.required
 * @property { String } userAttribute.required
 * @property { String } resourceAttribute.required
 */
let AccessMatrixSchema = mongoose.Schema({
    resource: { type: String, required: true },
    roleId: { type: String, required: true },
    userAttribute: { type: String, required: true },
    resourceAttribute: { type: String, required: true }
});

module.exports = mongoose.model('AccessMatrix', AccessMatrixSchema);
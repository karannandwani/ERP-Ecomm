var Resource = require('../config/resource');
var Role = require('../config/role');
var Action = require('../config/action');

exports.resourceList = (req, res) => {
    return res.staus(200).json(Resource.value());
};

exports.roles = (req, res) => {
    return res.staus(200).json(Role.value());
};

exports.actionList = (req, res) => {
    return res.staus(200).json(Action.value());
};
var AccessPolicy = require("../models/access-policy");
var Resource = require("../config/resource");
var Action = require("../config/action");
const {
  bodyToPolicyObject,
  bodyToPolicyFilterObject,
} = require("../utils/conversion-util");
const { addPolicyValidate } = require("../utils/validate-request");

exports.resourceList = (req, res) => {
  return res.status(200).json(Resource);
};

exports.actionList = (req, res) => {
  return res.status(200).json(Action);
};

exports.createPolicy = async (req, res) => {
  try {
    let body = req.body;
    addPolicyValidate(body)
      .then((result) => bodyToPolicyObject(body))
      .then((result) => this.createMultiplePolicy(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        if (error.code === 11000) {
          return res.status(500).json({
            message: "Duplicate entry!",
          });
        }
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};
exports.createMultiplePolicy = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      AccessPolicy.insertMany(obj, (err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          resolve(resp);
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.fetchPolicies = async (req, res) => {
  try {
    bodyToPolicyFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    AccessPolicy.findByIdAndDelete(req.params.policyId, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      return res.status(200).json(response);
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.checkPolicy = (resource, act) => {
  return async (req, res, next) => {
    try {
      var action =
        req.body._id || req.params.status !== undefined ? "Update" : "Create";

      let currentBusiness = req.user.businessRoleMap.find((x) => x.selected);
      if (!currentBusiness) {
        currentBusiness = req.user.businessRoleMap[0];
      }
      const permission = await AccessPolicy.exists({
        resource: resource,
        action: act ? act : action,
        roleId: {
          $in: currentBusiness.roles.map((x) => x._id.toString()),
        },
        businessId: currentBusiness.business.toString(),
      });
      if (!permission) {
        return res.status(403).json({
          message: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      AccessPolicy.find(query.query, (err, res) => {
        if (err) {
          reject(err);
        }
        let rr = res.reduce((result, cv) => {
          (result[cv.roleId] = result[cv.roleId] || []).push(cv);
          return result;
        }, {});
        resolve(rr);
      });
    } catch (e) {
      reject(e);
    }
  });

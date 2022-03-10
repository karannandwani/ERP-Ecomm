var Role = require("../models/role");
var passport = require("passport");
const {
  bodyToRoleObject,
  bodyToRoleFilterObject,
} = require("../utils/conversion-util");
const { addRoleValidate } = require("../utils/validate-request");

var fetchBusinessById = null;
exports.create = async (req, res) => {
  try {
    if (!fetchBusinessById)
      fetchBusinessById = require("./business-service").fetchBusinessById;
    let body = req.body;

    if (body.name !== "Admin") {
      passport.authenticate("jwt", {
        session: false,
      });
    }
    addRoleValidate(body)
      .then((result) => fetchBusinessById(body.businessId))
      .then(() => validateRoleName(body.name))
      .then(() => bodyToRoleObject(body))
      .then((result) => create(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const validateRoleName = async (name) =>
  new Promise((resolve, reject) => {
    try {
      this.fetchRoleByName(name)
        .then((result) =>
          result ? reject({ message: "Already exists" }) : resolve(true)
        )
        .catch((error) => {
          if (error.message.startsWith("Role with name")) {
            resolve(true);
          } else {
            console.error(error);
            reject(error);
          }
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let role = Role(obj);
      role.save((err, resp) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (resp) {
          resolve(resp);
        } else {
          console.error("Unable to create!");
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.fetchRoles = async (req, res) => {
  try {
    bodyToRoleFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchRoleByName = async (name) =>
  new Promise((resolve, reject) => {
    try {
      Role.findOne({ name: name }, (err, res) => {
        if (err) {
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: `Role with name: ${name} not found!` });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.fetchRoleById = async (id) =>
  new Promise((resolve, reject) => {
    try {
      Role.findById(id, (err, res) => {
        if (err) {
          reject(err);
        }
        if (res) {
          resolve(res);
        }
      });
    } catch (e) {
      reject(e);
    }
  });

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Role.find(query.query, null, query.size, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.validateRoles = async (roles) =>
  new Promise((resolve, reject) => {
    try {
      Role.countDocuments({ _id: { $in: roles } }, (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response && response === roles.length) {
          resolve(true);
        } else {
          reject({ message: "Invalid Role!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

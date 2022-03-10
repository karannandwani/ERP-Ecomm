var SchemeVariable = require("../models/scheme-variable");
const {
  bodyToSchemeVariableFindObject,
  bodyToSchemeVariableObject,
} = require("../utils/conversion-util");

exports.create = async (req, res) => {
  try {
    bodyToSchemeVariableObject(req.body)
      .then((result) =>
        req.body._id ? update(req.body._id, result) : add(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetch = async (req, res) => {
  try {
    bodyToSchemeVariableFindObject(req.query)
      .then((result) => fetchSchemeVariables(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const fetchSchemeVariables = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      SchemeVariable.find(obj.query, null, {
        skip: obj.skip,
        limit: obj.limit,
      }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.findById = async (req, res) => {};

const add = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let schemeVariable = SchemeVariable(obj);
      schemeVariable.save((error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          resolve(response);
        } else {
          reject({ message: "Unable to process" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const update = async (id, obj) =>
  new Promise((resolve, reject) => {
    try {
      SchemeVariable.findByIdAndUpdate(
        id,
        { $set: obj },
        { new: true },
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response) {
            resolve(response);
          } else {
            reject({ message: "Unable to process" });
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

var Country = require("../models/country");
const {
  bodyToCountryObject,
  bodyToCountryFilterObject,
} = require("../utils/conversion-util");
const { addCountryValidate } = require("../utils/validate-request");

exports.createOrUpdate = async (req, res) => {
  try {
    addCountryValidate(req.body)
      .then((result) => bodyToCountryObject(req.body))
      .then((result) =>
        req.body._id ? update(req.body, result) : create(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        if (error.code === 11000) {
          return res.status(500).json({
            message: "Already exists",
          });
        }
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let country = Country(obj);
      country.save((err, res) => {
        if (err) {
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: "Unable to save!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

const update = async (body, obj) =>
  new Promise((resolve, reject) => {
    try {
      Country.findByIdAndUpdate(
        body._id,
        { $set: obj },
        { new: true },
        (err, res) => {
          if (err) {
            reject(err);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Unable to save!" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.fetch = async (req, res) => {
  try {
    bodyToCountryFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Country.find(query.query, null, query.size, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

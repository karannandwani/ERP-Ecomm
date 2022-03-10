var Address = require("../models/address");
const { bodyToAddressObject } = require("../utils/conversion-util");
const { validateAddressRequest } = require("../utils/validate-request");

exports.add = async (req, res) => {
  try {
    validateAddressRequest(req.body)
      .then((result) => bodyToAddressObject(req.body, req.user))
      .then((result) =>
        req.body._id ? update(result, req.body._id) : create(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const update = async (obj, addressId) =>
  new Promise((resolve, reject) => {
    try {
      Address.findByIdAndUpdate(addressId, obj, { new: true }, (err, resp) => {
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

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let address = Address(obj);
      address.save((err, resp) => {
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

exports.fetch = async (req, res) => {
  try {
    findByQuery({ user: req.user._id, active: true })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    Address.find(query, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(response);
    });
  });

exports.deleteAddress = async (req, res) => {
  try {
    update({ active: false }, req.params.addressId)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

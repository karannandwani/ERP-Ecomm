var ExpiryProduct = require("../models/expiry-product");
const {
  bodyToInventoryLedgerObject,
  bodyToExpiryCountObject,
} = require("../utils/conversion-util");

exports.expiryProductCount = async (req, res) => {
  try {
    bodyToExpiryCountObject(req.query)
      .then((result) => countExpiry(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchExpiryProduct = async (req, res) => {
  try {
    bodyToInventoryLedgerObject(req.query)
      .then((result) => findExpiry(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchExpiryProductNew = async (req, res) => {
  try {
    bodyToInventoryLedgerObject(req.body)
      .then((result) => findExpiry(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findExpiry = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      ExpiryProduct.find(queryObj.query)
        .populate(queryObj.populate)
        .then(
          (result) => resolve(result),
          (error) => {
            console.error(error);
            reject(error);
          }
        );
    } catch (e) {
      reject(e);
    }
  });
const countExpiry = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      ExpiryProduct.aggregate(
        [
          {
            $match: queryObj,
          },
          {
            $group: {
              _id: null,
              productCount: {
                $sum: 1,
              },
            },
          },
        ],
        (_err, _res) => {
          if (_err) {
            console.error(_err);
            reject(_err);
          }

          if (_res) {
            resolve(_res);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

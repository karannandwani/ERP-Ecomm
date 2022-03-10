var QuantityNorm = require("../models/quantity-norm");
const {
  bodyToNormFilterObject,
  validateNormRequest,
} = require("../utils/conversion-util");
const { addQuantityNormValidate } = require("../utils/validate-request");

exports.add = async (req, res) => {
  try {
    validateNormRequest(req.body)
      .then((result) => addQuantityNormValidate(req.body))
      .then((result) => create(req.body))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (body) =>
  new Promise((resolve, reject) => {
    Promise.all(
      body.map((norm) => {
        let obj = {
          product: norm.product,
          facility: norm.facility,
        };

        return QuantityNorm.findOneAndUpdate(
          obj,
          {
            business: norm.business,
            minOrdQty: norm.minOrdQty,
            maxOrdQty: norm.maxOrdQty,
          },
          {
            upsert: true,
            new: true,
          }
        )
          .populate([{ path: "product" }])
          .exec();
      })
    )
      .then((result) => resolve(result))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
exports.fetchNorms = async (req, res) => {
  try {
    bodyToNormFilterObject(req.query)
      .then((result) => findNorm(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.delete = async (req, res) => {
  try {
    QuantityNorm.findByIdAndDelete(req.params.quantityNormId, (_err, _res) => {
      if (_err) {
        console.error(_err);
        return res.status(500).json(_err);
      }
      return res.status(200).json({
        message: "Deleted",
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchNormByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      QuantityNorm.find(query, (err, res) => {
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

const findNorm = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      QuantityNorm.find(queryObj.query, null, queryObj.size)
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

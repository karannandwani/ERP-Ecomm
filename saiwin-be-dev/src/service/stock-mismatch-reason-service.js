var StockMismatchReason = require("../models/stock-mismatch-reason");
const {
  bodyToStockMismatchReasonObject,
  queryToStockMismatchReasonFilterObj,
} = require("../utils/conversion-util");
const { addStockMismatchReasonValidate } = require("../utils/validate-request");

exports.createOrUpdate = async (req, res) => {
  try {
    addStockMismatchReasonValidate(req.body)
      .then((result) => bodyToStockMismatchReasonObject(req.body))
      .then((result) =>
        req.body._id ? update(req.body, result) : this.createReason(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.createReason = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let stockMismatchReason = StockMismatchReason(obj);
      stockMismatchReason.save((err, res) => {
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
      StockMismatchReason.findByIdAndUpdate(
        body._id,
        { $set: obj },
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
    queryToStockMismatchReasonFilterObj(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        console.error(error);
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      StockMismatchReason.find(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

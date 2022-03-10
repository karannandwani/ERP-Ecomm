const coupon = require("../models/coupon");
const Coupon = require("../models/coupon");
const {
  couponFetchObject,
  bodyToCouponObject,
  bodyToCouponFetchObject,
} = require("../utils/conversion-util");
const { addCouponValidate } = require("../utils/validate-request");

exports.add = async (req, res) => {
  try {
    addCouponValidate(req.body)
      .then((result) => bodyToCouponObject(req.body))
      .then((result) =>
        req.body._id ? update(req.body._id, result) : create(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const update = async (_id, obj) =>
  new Promise((resolve, reject) => {
    try {
      Coupon.findByIdAndUpdate(
        _id,
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
            reject({ message: "Unable to update!" });
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let coupon = Coupon(obj);
      coupon.save((error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          resolve(response);
        } else {
          reject({ message: "Unable to save!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.fetch = async (req, res) => {
  try {
    couponFetchObject(req.body)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      Coupon.find(obj.queryObj, null, {
        skip: obj.skip,
        limit: obj.limit,
      }).then(
        (response) => resolve(response),
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

exports.findOneCouponByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      coupon.findOne(query, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: "Coupon not found" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

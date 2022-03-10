const mongoose = require("mongoose");
var OrderFeedback = require("../models/order-feedback");
var Order = require("../models/order");
const { addCommentValidate } = require("../utils/validate-request");
const ImageService = require("./image-service");
const { findOrder, findEcommerceOrder } = require("./order-service");
const { findUserById } = require("./user-service");
const {
  bodyToOrderFeedbackObject,
  bodyToFeedbackFilterObject,
} = require("../utils/conversion-util");
const { saveImage } = require("./product-service");
exports.create = async (req, res) => {
  try {
    let body = req.body;
    let image, order;
    saveImage(body.image)
      .then((result) => {
        image = result;
        return addCommentValidate(body);
      })
      .then((result) => findOrder({ _id: body.orderId }))
      .then((result) => {
        order = result;
        return findUserById(req.user._id);
      })
      .then((result) => bodyToOrderFeedbackObject(body, image, order, req.user))
      .then((result) =>
        body._id ? update({ $set: result }, body._id) : create(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let orderFeedback = OrderFeedback(obj);
      orderFeedback.save((err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          Order.findByIdAndUpdate(
            obj.order,
            { $set: { feedback: resp._id } },
            { new: true },
            (err, response) => {
              if (err) {
                reject(err);
              }
              if (response) {
                findEcommerceOrder({
                  _id: mongoose.Types.ObjectId(obj.order),
                }).then((result) => resolve(result[0]));
              } else {
                reject({ message: "Unable to create!" });
              }
            }
          );
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

const update = async (query, _id) =>
  new Promise((resolve, reject) => {
    try {
      OrderFeedback.findByIdAndUpdate(
        _id,
        query,
        { new: true },
        (err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
          } else {
            reject({ message: "Unable to create!" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.findFeedback = async (req, res) => {
  try {
    bodyToFeedbackFilterObject(req.body)
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
      OrderFeedback.find(query.query)
        .populate([
          {
            path: "order",
            populate: {
              path: "products.product",
              model: "Product",
            },
          },
          { path: "facility" },
          { path: "user" },
        ])
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

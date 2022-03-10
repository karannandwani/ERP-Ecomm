var OrderStatus = require("../models/order-status");

exports.create = async (req, res) => {
  try {
    let body = req.body;

    let obj = {
      name: body.name,
    };
    (body._id ? update(obj, body) : create(obj))
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

const update = async (obj, body) =>
  new Promise((resolve, reject) => {
    try {
      OrderStatus.findByIdAndUpdate(
        body._id,
        { $set: obj },
        { new: true },
        (err, resp) => {
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
      let orderStatus = OrderStatus(obj);
      orderStatus.save((err, resp) => {
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

exports.fetchStatus = async (req, res) => {
  try {
    OrderStatus.find((_err, _res) => {
      if (_err) {
        return res.status(500).json(_err);
      }
      return res.status(200).json(_res);
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchOrderStatusByName = async (name) =>
  new Promise((resolve, reject) => {
    try {
      OrderStatus.findOne({ name: name }, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          console.error("Order Status error!");
          reject({ message: "Order Status error!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

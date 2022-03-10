const { findUserById } = require("./user-service");
const mongoose = require("mongoose");
const { result } = require("lodash");
const order = require("../models/order");

exports.calculateTodaySale = async (req, res) => {
  try {
    findUserById(req.query._id)
      .then((result) => {
        if (result) {
          let maxId = mongoose.Types.ObjectId(
            Math.floor(new Date() / 1000).toString(16) + "0000000000000000"
          );
          let fromDate = new Date();
          fromDate.setHours(00);
          fromDate.setMinutes(00);
          let minId = mongoose.Types.ObjectId(
            Math.floor(fromDate / 1000).toString(16) + "0000000000000000"
          );
          return findByQuery(maxId, minId, result._id);
        }
      })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return;
  }
};

const findByQuery = async (maxId, minId, _id) =>
  new Promise((resolve, reject) => {
    try {
      order.aggregate(
        [
          {
            $match: {
              createdBy: _id,
              $and: [
                {
                  _id: {
                    $gte: minId,
                  },
                },
                {
                  _id: {
                    $lte: maxId,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "orderstatuses",
              localField: "status",
              foreignField: "_id",
              as: "status",
            },
          },
          {
            $unwind: "$status",
          },
          {
            $match: {
              $and: [
                {
                  "status.name": {
                    $ne: "Generated",
                  },
                },
                {
                  "status.name": {
                    $ne: "Rejected",
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: null,
              amount: {
                $sum: "$subTotal",
              },
            },
          },
        ],
        (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (res) {
            resolve(res);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

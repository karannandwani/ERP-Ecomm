const Order = require("../models/order");
const mongoose = require("mongoose");

const awaitingAndHoldCount = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Order.aggregate(
        [
          {
            $match: queryObj,
          },
          {
            $lookup: {
              from: "orderstatuses",
              let: {
                sId: "$status",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$_id", "$$sId"],
                        },
                        {
                          $ne: ["$name", "Delivered"],
                        },
                        {
                          $ne: ["$name", "Rejected"],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "status",
            },
          },
          {
            $unwind: "$status",
          },
          {
            $group: {
              _id: "$status.name",
              count: {
                $sum: 1,
              },
            },
          },
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          resolve(response);
        }
      );
    } catch (e) {
      console.error(e);
      return res.status(500).json(e);
    }
  });

exports.orderCount = async (req, res) => {
  try {
    let queryObj = new Object(),
      awaitHoldCount;
    if (req.query.facility) {
      queryObj.facility = mongoose.Types.ObjectId(req.query.facility);
    } else {
      queryObj.business = mongoose.Types.ObjectId(req.query.business);
    }
    awaitingAndHoldCount(queryObj)
      .then((result) => {
        awaitHoldCount = result;
        return last24HourOrder(queryObj);
      })
      .then((result) => {
        let obj = {
          last24Hour: {
            count: result && result.length > 0 ? result[0].count : 0,
            icon: "user",
          },
          await: {
            count:
              awaitHoldCount &&
              awaitHoldCount.find((x) => x._id === "Generated")
                ? awaitHoldCount.find((x) => x._id === "Generated").count
                : 0,
            icon: "refresh",
          },
          hold: {
            count:
              awaitHoldCount && awaitHoldCount.find((x) => x._id === "Accepted")
                ? awaitHoldCount.find((x) => x._id === "Accepted").count
                : 0,
            icon: "clock",
          },
        };
        return res.status(200).json(obj);
      })
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const last24HourOrder = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      let currDate = new Date();
      currDate.setDate(currDate.getDate() - 1);
      let hexSec = Math.floor(currDate / 1000).toString(16);
      let objId = mongoose.Types.ObjectId(hexSec + "0000000000000000");
      queryObj._id = {
        $gte: objId,
      };
      Order.aggregate(
        [
          {
            $match: queryObj,
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        (err_order, res_order) => {
          if (err_order) {
            console.error(err_order);
            reject(err_order);
          }

          if (res_order) {
            resolve(res_order);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.orderQuickView = async (req, res) => {
  try {
    Order.aggregate(
      [
        {
          $lookup: {
            from: "suppliers",
            localField: "suppliers",
            foreignField: "_id",
            as: "suppliers",
          },
        },
        {
          $unwind: "$suppliers",
        },
        {
          $match: {
            $or: [
              {
                facility: mongoose.Types.ObjectId(req.query.facility),
              },
              {
                "suppliers.facility": mongoose.Types.ObjectId(
                  req.query.facility
                ),
              },
            ],
          },
        },
        {
          $lookup: {
            from: "orderstatuses",
            let: {
              sId: "$status",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", "$$sId"],
                      },
                      {
                        $eq: ["$name", "Generated"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "status",
          },
        },
        {
          $unwind: "$status",
        },
        {
          $project: {
            _id: 1,
            type: {
              $cond: [
                {
                  $eq: [
                    "$facility",
                    mongoose.Types.ObjectId(req.query.facility),
                  ],
                },
                "Procurement",
                "Supply",
              ],
            },
            facility: 1,
            suppliers: 1,
            orderNo: 1,
          },
        },
        {
          $lookup: {
            from: "facilities",
            let: {
              fId: "$facility",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$fId"],
                  },
                },
              },
              {
                $project: {
                  name: 1,
                },
              },
            ],
            as: "facility",
          },
        },
        {
          $unwind: "$facility",
        },
      ],
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        if (response) {
          return res.status(200).json(response);
        }
      }
    );
  } catch (e) {
    console.error(e);
  }
};

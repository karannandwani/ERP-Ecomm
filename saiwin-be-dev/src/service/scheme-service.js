var Scheme = require("../models/scheme");
var Product = require("../models/product");
var mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    let obj = JSON.parse(JSON.stringify(req.body));
    delete obj["_id"];
    (req.body._id ? update(req.body._id, obj) : create(obj))
      .then((result) => fetch({ _id: result._id }))
      .then((result) => res.status(200).json(result[0]))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let scheme = Scheme(obj);
      scheme.save({ validateBeforeSave: true }, (error, response) => {
        if (error) {
          reject(error);
        }
        if (response) {
          resolve(response);
        } else {
          reject({
            message: "Unable to process",
          });
        }
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

const update = async (id, obj) =>
  new Promise((resolve, reject) => {
    try {
      Scheme.findByIdAndUpdate(id, { $set: obj }, (error, response) => {
        if (error) {
          reject(error);
        }
        if (response) {
          resolve(response);
        } else {
          reject({
            message: "Unable to process",
          });
        }
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
exports.fetchScheme = async (req, res) => {
  try {
    fetch({
      business: mongoose.Types.ObjectId(req.query.business),
    })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const fetch = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Scheme.aggregate(
        [
          {
            $match: query,
          },
          {
            $unwind: {
              path: "$condition.products",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "products",
              let: {
                pId: {
                  $toObjectId: "$condition.products",
                },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$pId", "$_id"],
                    },
                  },
                },
              ],
              as: "conditionProduct",
            },
          },
          {
            $unwind: {
              path: "$conditionProduct",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              products: {
                $push: "$conditionProduct",
              },
              effectFrom: {
                $first: "$effectFrom",
              },
              effectTill: {
                $first: "$effectTill",
              },
              type: {
                $first: "$type",
              },
              business: {
                $first: "$business",
              },
              product: {
                $first: "$product",
              },
              active: {
                $first: "$active",
              },
              autoApplied: {
                $first: "$autoApplied",
              },
              effect: {
                $first: "$effect",
              },
              evaluation: {
                $first: "$evaluation",
              },
            },
          },
          {
            $addFields: {
              condition: {
                products: "$products",
              },
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: {
              path: "$product",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: "$evaluation",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "products",
              let: {
                pId: {
                  $toObjectId: "$evaluation.freeProduct",
                },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$pId", "$_id"],
                    },
                  },
                },
              ],
              as: "evalProduct",
            },
          },
          {
            $unwind: {
              path: "$evalProduct",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              condition: {
                $first: "$condition",
              },
              effectFrom: {
                $first: "$effectFrom",
              },
              effectTill: {
                $first: "$effectTill",
              },
              type: {
                $first: "$type",
              },
              business: {
                $first: "$business",
              },
              product: {
                $first: "$product",
              },
              active: {
                $first: "$active",
              },
              autoApplied: {
                $first: "$autoApplied",
              },
              effect: {
                $first: "$effect",
              },
              evaluation: {
                $push: {
                  qty: "$evaluation.qty",
                  type: "$evaluation.type",
                  discount: "$evaluation.discount",
                  freeProduct: "$evalProduct",
                  freeQty: "$evaluation.freeQty",
                },
              },
            },
          },
        ],
        (error, response) => {
          if (error) {
            reject(error);
          }
          if (response && response.length > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.findById = async (req, res) => {
  try {
    Scheme.findById(req.params.schemeId, async (_err, _res) => {
      let response = JSON.parse(JSON.stringify(_res));
      if (response.productId) {
        await Promise.all([
          new Promise((resolve, reject) => {
            Product.findById(
              response.productId,
              (_err_product, _res_product) => {
                if (_err_product) {
                  reject(_err_product);
                }
                if (_res_product) {
                  response.product = _res_product;
                  resolve();
                }
              }
            );
          }),
        ]);
      }
      if (_err) {
        return res.status(500).json(_err);
      }

      if (_res) {
        return res.status(200).json(response);
      } else {
        return res.status(500).json({ message: "Unable to process" });
      }
    });
  } catch (e) {
    return res.status(500).json(e);
  }
};

exports.findSchemesByQuery = async (query) =>
  new Promise((resolve, reject) => {
    Scheme.find(query).then(
      (response) => {
        resolve(response);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });

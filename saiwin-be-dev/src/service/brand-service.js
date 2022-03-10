var Brand = require("../models/brand");
var Manufacturer = require("../models/manufacturer");
const { fetchBusinessById } = require("./business-service");
const { manufacturerExists } = require("./manufacturer-service");
const {
  bodyToBrandObject,
  bodyToBrandFilterObject,
} = require("../utils/conversion-util");

var Business = require("../models/business");
const { addBrandValidate } = require("../utils/validate-request");
const { keywordEvent, brandEvent } = require("../utils/event-util");

exports.create = async (req, res) => {
  try {
    let body = req.body;
    addBrandValidate(body)
      .then(() => fetchBusinessById(body.business))
      .then(() => manufacturerExists(body.manufacturer))
      .then(() => bodyToBrandObject(body))
      .then((result) => (body._id ? update(result, body) : create(result)))
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
      Brand.findByIdAndUpdate(body._id, { $set: obj }, { new: true })
        .populate("manufacturer")
        .then(
          (result) => {
            if (result) {
              resolve(result);
              let obj = {
                business: result.business,
                type: "Brand",
                itemId: result._id,
                itemName: result.name,
              };
              keywordEvent.emit("create", obj);
            } else {
              reject({ message: "Unable to Save!" });
            }
          },
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let brand = Brand(obj);
      brand.save((err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          Brand.populate(brand, "manufacturer").then(
            (result) => resolve(result),
            (error) => reject(error)
          );
          let obj = {
            business: resp.business,
            type: "Brand",
            itemId: resp._id,
            itemName: resp.name,
          };
          keywordEvent.emit("create", obj);
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.fetchById = async (req, res) => {
  try {
    Brand.findById({
      _id: req.params.brandId,
    })
      .populate("manufacturer")
      .then(
        (result) => {
          return res.status(200).json(result);
        },
        (error) => {
          console.error(error);
          return res.status(500).json(error);
        }
      );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findBrands = async (req, res) => {
  try {
    bodyToBrandFilterObject(req.query)
      .then((result) => fetchBrandsByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findBrandsUpdated = async (req, res) => {
  try {
    bodyToBrandFilterObject(req.body)
      .then((result) => fetchBrandsByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.changeBrandStatus = async (req, res) => {
  try {
    Brand.findByIdAndUpdate(
      req.params.brandId,
      {
        $set: {
          active: req.params.status,
        },
      },
      {
        new: true,
      },
      (_err, _res) => {
        if (_err) {
          console.error(_err);
          return res.status(500).json(_err);
        }

        if (_res) {
          return res.status(200).json(_res);
        } else {
          return res.status(500).json({
            message: "Unabel to process",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.brandCount = async (req, res) => {
  try {
    let queryObj = new Object();
    if (req.query.business) {
      queryObj.business = req.query.business;
    }
    Brand.aggregate(
      [
        {
          $match: queryObj,
        },
        {
          $group: {
            _id: null,
            brandCount: {
              $sum: 1,
            },
          },
        },
      ],
      (err_count, res_count) => {
        if (err_count) {
          console.error(err_count);
          return res.status(500).json(err_count);
        }

        if (res_count) {
          return res.status(200).json(res_count);
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.brandExists = async (brandId) =>
  new Promise((resolve, reject) => {
    try {
      Brand.exists(
        {
          _id: brandId,
        },
        (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Provide a valid brand" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

const fetchBrandsByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Brand.aggregate(
        [
          {
            $match: queryObj.query,
          },
          {
            $lookup: {
              from: "manufacturers",
              let: {
                mId: "$manufacturer",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$mId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "manufacturer",
            },
          },
          {
            $unwind: "$manufacturer",
          },
          {
            $match: {
              $or: [
                {
                  "manufacturer.name": queryObj.name,
                },
                {
                  name: queryObj.name,
                },
              ],
            },
          },
          {
            $skip: queryObj.skip,
          },
          {
            $limit: queryObj.limit,
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

exports.findBrand = async (names) =>
  new Promise((resolve, reject) => {
    try {
      Brand.find({ name: { $in: Array.from(names) } }, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: "Provide a valid brand" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.createMultipleBrand = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      Brand.insertMany(obj, (err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          resolve(resp);
          brandEvent.emit("new-created", {
            business: business,
          });
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

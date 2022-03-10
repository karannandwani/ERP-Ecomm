var Inventory = require("../models/inventory");
var mongoose = require("mongoose");
var Product = require("../models/product");
var cron = require("node-cron");
var ExpiryProduct = require("../models/expiry-product");
const { inventoryEvent } = require("../utils/event-util");
const { inventoryLedgerEvent } = require("../utils/event-util");
const {
  queryToInventoryFilterObject,
  escapeRegex,
  bodyToInventoryFilterForReturn,
  bodyToInventoryfetchObject,
} = require("../utils/conversion-util");
const { updateStockValidation } = require("../utils/validate-request");
const inventory = require("../models/inventory");
const {
  fetchFacilityByLocation,
  fetchFacilityByQuery,
} = require("./facility-service");
const { findSchemesByQuery } = require("./scheme-service");
const config = require("../config/config");

exports.fetchInventory = async (req, res) => {
  try {
    queryToInventoryFilterObject(req.body)
      .then((result) => this.fetchInventoryQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.totalBrands = async (req, res) => {
  try {
    let queryObj = new Object();
    if (req.query.facility) {
      queryObj.facility = mongoose.Types.ObjectId(req.query.facility);
    }
    if (req.query.business) {
      queryObj.business = req.query.business;
    }
    Inventory.aggregate(
      [
        {
          $match: queryObj,
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
          $project: {
            x: "$product.brand",
            facility: "$facility",
          },
        },
        {
          $unwind: "$x",
        },
        {
          $group: {
            _id: "$facility",
            brands: {
              $addToSet: "$x",
            },
          },
        },
        {
          $unwind: "$brands",
        },
        {
          $group: {
            _id: "$_id",
            brandCount: {
              $sum: 1,
            },
          },
        },
      ],
      (err_inv, res_inv) => {
        if (err_inv) {
          console.error(err_inv);
          return res.status(500).json(err_inv);
        }

        if (res_inv) {
          return res.status(200).json(res_inv[0]);
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.noOfProductOutOfStock = async (req, res) => {
  try {
    let queryObj = new Object();
    if (req.query.facility) {
      queryObj.facility = mongoose.Types.ObjectId(req.query.facility);
    }
    if (req.query.business) {
      queryObj.business = req.query.business;
    }
    queryObj.products = {
      $size: 0,
    };
    Inventory.aggregate(
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

exports.fetchInventoryOfProduct = async (req, res) => {
  try {
    Inventory.findOne(
      {
        $and: [
          {
            facilityId: mongoose.Types.ObjectId(req.query.facilityId),
          },
          {
            productId: mongoose.Types.ObjectId(req.params.productId),
          },
        ],
      },
      (err_inv, res_inv) => {
        if (err_inv) {
          console.error(err_inv);
          return res.status(500).json(err_inv);
        }

        if (res_inv) {
          return res.status(200).json(res_inv);
        } else {
          return res.status(500).json({
            message: "Not found in inventory.",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.productCount = async (req, res) => {
  try {
    let queryObj = new Object();
    if (req.query.facility) {
      queryObj.facility = mongoose.Types.ObjectId(req.query.facility);
    }
    if (req.query.business) {
      queryObj.business = req.query.business;
    }
    Inventory.aggregate(
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

exports.fetchInventoryOfProducts = async (req, res) => {
  try {
    let productIds = req.body.productIds.map((t) => mongoose.Types.ObjectId(t));
    Inventory.find(
      {
        $and: [
          {
            facilityId: mongoose.Types.ObjectId(req.body.facilityId),
          },
          {
            productId: {
              $in: productIds,
            },
          },
        ],
      },
      (err_inv, res_inv) => {
        if (err_inv) {
          console.error(err_inv);
          return res.status(500).json(err_inv);
        }

        if (res_inv) {
          return res.status(200).json(res_inv);
        } else {
          return res.status(500).json({
            message: "Not found in inventory.",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.inventoryDetails = async (req, res) => {
  try {
    Inventory.findOne({
      $and: [
        {
          facility: mongoose.Types.ObjectId(req.body.facility),
        },
        {
          product: mongoose.Types.ObjectId(req.body.product),
        },
      ],
    })
      .populate("product")
      .then(
        (result) => {
          inventoryEvent.emit("create", result);
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

exports.fetchProductByInventory = async (req, res) => {
  try {
    let name = new RegExp(escapeRegex(req.body.name), "gi");
    let excludeIds = req.body.excludeIds
      ? req.body.excludeIds.map((t) => mongoose.Types.ObjectId(t))
      : [];
    Inventory.aggregate(
      [
        {
          $match: {
            $and: [
              {
                facilityId: mongoose.Types.ObjectId(req.body.facilityId),
              },
              {
                productId: { $nin: excludeIds },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "products",
            let: {
              pId: "$productId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", "$$pId"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $match: {
            "product.name": name,
          },
        },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "orders",
            let: {
              oId: {
                $toObjectId: "$products.orderId",
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$oId"],
                  },
                },
              },
            ],
            as: "order",
          },
        },
        {
          $unwind: "$order",
        },
        {
          $match: {
            "order.suppliersId": mongoose.Types.ObjectId(req.body.suppliersId),
          },
        },
        {
          $group: {
            _id: "$_id",
            products: {
              $push: {
                _id: "$products._id",
                noOfCase: "$products.noOfCase",
                noOfProduct: "$products.noOfProduct",
                lotId: "$products.lotId",
              },
            },
            facilityId: {
              $first: "$facilityId",
            },
            product: {
              $first: "$product",
            },
          },
        },
      ],
      (err_pro, res_pro) => {
        if (err_pro) {
          console.error(err_pro);
          return res.status(500).json(err_pro);
        }
        if (res_pro) {
          return res.status(200).json(res_pro);
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchInventoryByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Inventory.find(queryObj, (err, res) => {
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

exports.checkExpire = cron.schedule("59 23 * * *", () => {
  try {
    let expiryProduct, inventory;
    var now = new Date();
    var startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      0
    );

    this.findExpireInventory(startOfDay).then((result) => {
      inventory = result;
      for (let index = 0; index < inventory.length; index++) {
        const i = inventory[index];
        let lotArray = [];

        i.products.map((p) => {
          expiryProduct = p.expiryDate <= startOfDay;
          if (expiryProduct) {
            this.updateInventory({ _id: i._id, product: p });
            let product = {
              noOfCase: p.noOfCase,
              noOfProduct: p.noOfProduct,
              costPrice: p.costPrice,
              wholesalePrice: p.wholesalePrice,
              retailPrice: p.retailPrice,
              mrp: p.mrp,
              lotId: p.lotId,
              qtyPerCase: p.qtyPerCase,
              expiryDate: p.expiryDate,
              track: "expired",
            };
            lotArray.push(product);
          }
          this.saveExpireProduct({ inventory: i, products: lotArray });
          inventoryLedgerEvent.emit("create", {
            inventory: i,
            products: lotArray,
          });
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

exports.findExpireInventory = async (startOfDay) =>
  new Promise((resolve, reject) => {
    try {
      Inventory.find(
        { "products.expiryDate": { $lte: startOfDay } },
        (err, res) => {
          if (err) {
            reject(err);
          }
          if (res) {
            resolve(res);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.updateInventory = async (data) =>
  Inventory.findByIdAndUpdate(
    { _id: data._id },
    { $pull: { products: data.product } }
  ).exec();

exports.saveExpireProduct = async (data) => {
  let inventory = data.inventory;

  ExpiryProduct.findOneAndUpdate(
    {
      product: inventory.product,
      facility: inventory.facility,
      business: inventory.business,
    },
    {
      $push: {
        products: data.products,
      },
    },
    { upsert: true }
  ).exec();
};

inventoryEvent.on("create", (data) => {});

exports.fetchInventoryQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Inventory.aggregate(
        [
          {
            $match: queryObj.query,
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
            $unwind: "$product",
          },
          {
            $lookup: {
              from: "hsns",
              localField: "product.hsn",
              foreignField: "_id",
              as: "product.hsn",
            },
          },
          {
            $unwind: "$product.hsn",
          },
          {
            $lookup: {
              from: "taxes",
              localField: "product.hsn.tax",
              foreignField: "_id",
              as: "product.hsnTaxes",
            },
          },
          {
            $lookup: {
              from: "taxes",
              localField: "product.tax",
              foreignField: "_id",
              as: "product.tax",
            },
          },
          {
            $lookup: {
              from: "suppliers",
              localField: "products.supplier",
              foreignField: "_id",
              as: "supplier",
            },
          },
          {
            $match: {
              $or: [
                {
                  "product.name": queryObj.name,
                },
                {
                  "supplier.name": queryObj.name,
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$products",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              inTransit: 1,
              facility: 1,
              product: 1,
              business: 1,
              products: 1,
              type: 1,
              result: {
                $sum: [
                  "$products.noOfProduct",
                  {
                    $multiply: ["$products.noOfCase", "$products.qtyPerCase"],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$_id",
              inTransit: {
                $first: "$inTransit",
              },
              facility: {
                $first: "$facility",
              },
              product: {
                $first: "$product",
              },
              business: {
                $first: "$business",
              },
              type: {
                $first: "$type",
              },
              products: {
                $push: {
                  _id: "$products._id",
                  noOfCase: "$products.noOfCase",
                  noOfProduct: "$products.noOfProduct",
                  orderId: "$products.orderId",
                  wholesalePrice: "$products.wholesalePrice",
                  costPrice: "$products.costPrice",
                  retailPrice: "$products.retailPrice",
                  qtyPerCase: "$products.qtyPerCase",
                  mrp: "$products.mrp",
                  expiryDate: "$products.expiryDate",
                  lotId: "$products.lotId",
                  supplier: "$products.supplier",
                  barcodeNo: "$products.barcodeNo",
                  barCode: "$products.barCode",
                },
              },
              total: {
                $sum: "$result",
              },
            },
          },
          {
            $project: {
              _id: 1,
              inTransit: 1,
              facility: 1,
              product: 1,
              business: 1,
              products: 1,
              total: 1,
              type: 1,
              status: {
                $cond: [
                  {
                    $eq: ["$total", 0],
                  },
                  "Out Of Stock",
                  {
                    $cond: [
                      {
                        $gte: ["$total", "$product.lowStockMark"],
                      },
                      "High",
                      "Low",
                    ],
                  },
                ],
              },
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

exports.updateStocks = async (req, res) => {
  try {
    if (!req.body.inventoryId) {
      return res.status(500).json({ message: "Please provide inventoryId!" });
    }
    let inventory;
    this.fetchInventoryByQuery({ _id: req.body.inventoryId })
      .then((result) => {
        inventory = JSON.parse(JSON.stringify(result))[0];
        return updateStockValidation(inventory, req.body);
      })
      .then((result) =>
        this.fetchInventoryByQuery({
          product: inventory.product,
          type: "Business",
          business: inventory.business,
        })
      )
      .then((result) =>
        updateLot(inventory, req.body, JSON.parse(JSON.stringify(result))[0])
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateLot = async (result, body, businessInventory) =>
  new Promise((resolve, reject) => {
    try {
      // let response = JSON.parse(JSON.stringify(result))[0];
      let missingLotArray = [];
      let businessInventoryLots = businessInventory.products;
      for (let index = 0; index < result.products.length; index++) {
        const element = result.products[index];
        let request = body.products.find((x) => x._id === element._id);

        if (request) {
          let businessLotIndex = businessInventoryLots.findIndex(
            (z) => z.lotId === element.lotId
          );
          businessInventoryLots[businessLotIndex].noOfCase -=
            element.noOfCase - request.noOfCase;
          businessInventoryLots[businessLotIndex].noOfProduct -=
            element.noOfProduct - request.noOfProduct;

          element.noOfCase = request.noOfCase;
          element.noOfProduct = request.noOfProduct;
          request.missingStocks.forEach((x) => {
            missingLotArray.push({
              lotId: element._id,
              noOfCase: x.caseQty,
              noOfProduct: x.productQty,
              costPrice: element.costPrice,
              wholesalePrice: element.wholesalePrice,
              retailPrice: element.retailPrice,
              mrp: element.mrp,
              qtyPerCase: element.qtyPerCase,
              expiryDate: element.expiryDate,
              scheme: element.scheme,
              track: x.reason,
              price: element.costPrice,
            });
          });
        }
      }
      inventoryLedgerEvent.emit("create", {
        inventory: result,
        products: missingLotArray,
      });
      Inventory.findByIdAndUpdate(businessInventory._id, {
        $set: { products: businessInventoryLots },
      }).exec();

      Inventory.findByIdAndUpdate(
        body.inventoryId,
        { $set: { products: result.products } },
        { new: true }
      ).then(
        (resp) => {
          if (resp) {
            resolve(resp);
          } else {
            reject({ message: "Unable to save" });
          }
        },
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

exports.fetchLotDetails = async (req, res) => {
  try {
    Inventory.findOne(
      {
        business: req.body.business,
        "products.barcodeNo": req.body.barcodeNo,
        facility: req.body.facility,
      },
      { "products.barcodeNo.$": 1 }
    )
      .populate([{ path: "product" }, { path: "facility" }])
      .then(
        (response) => res.status(200).json(response),
        (error) => {
          console.error(error);
          return res.status(500).json(error);
        }
      );
  } catch (e) {
    console.error(e);
  }
};

exports.fetchProductsForEcommerce = async (req, res) => {
  try {
    bodyToInventoryfetchObject(req.body)
      .then((result) => fetchProductWithDetails(result))
      .then((result) =>
        findAndCheckForScheme(
          req.body.business,
          JSON.parse(JSON.stringify(result))
        )
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findAndCheckForScheme = async (business, products) =>
  new Promise((resolve, reject) => {
    if (products && products.length > 0) {
      findSchemesByQuery({
        business: business,
        type: "PRODUCT_DISCOUNT",
        $and: [
          { effectFrom: { $lte: new Date() } },
          { effectTill: { $gt: new Date() } },
          { active: true },
        ],
      })
        .then((result) => {
          if (result && result.length > 0) {
            Promise.all(
              products.map((product) => {
                let scheme = result.find((x) =>
                  x.condition.products.includes(product._id)
                );
                if (scheme) {
                  product.discountedPrice =
                    scheme.effect.type === "FLAT_DISCOUNT"
                      ? product.price - scheme.effect.value
                      : product.price -
                        (product.price * scheme.effect.value) / 100;
                  return product;
                } else {
                  return product;
                }
              })
            )
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                console.error(error);
                reject(error);
              });
          } else {
            resolve(products);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } else {
      resolve(products);
    }
  });

const fetchProductWithDetails = async (query) =>
  new Promise((resolve, reject) => {
    let priceQuery =
      config.lotPriceChoose === "LAST_RECEIVED"
        ? { $arrayElemAt: ["$inventory.products.retailPrice", -1] }
        : {
            $max: "$inventory.products.retailPrice",
          };
    Product.aggregate(
      [
        {
          $match: query,
        },
        {
          $lookup: {
            from: "inventories",
            let: {
              pId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$$pId", "$product"],
                      },
                      {
                        $eq: ["$type", "Business"],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  products: 1,
                },
              },
            ],
            as: "inventory",
          },
        },
        {
          $unwind: {
            path: "$inventory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            price: priceQuery,
          },
        },
        {
          $project: {
            inventory: 0,
            "image.image": 0,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $lookup: {
            from: "manufacturers",
            localField: "manufacturer",
            foreignField: "_id",
            as: "manufacturer",
          },
        },
        {
          $unwind: "$manufacturer",
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $unwind: "$brand",
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
  });

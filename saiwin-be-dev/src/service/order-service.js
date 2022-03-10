var Order = require("../models/order");
var Facility = require("../models/facility");
var Business = require("../models/business");
var Inventory = require("../models/inventory");
const mongoose = require("mongoose");
var Supplier = require("../models/supplier");
const GeneratedOrder = require("../models/generated-order");
const {
  fetchFacilityByQuery,
  fetchFacilityByPoint,
} = require("./facility-service");
const {
  findSupplierById,
  findOneSupplier,
  findSuppliersByQuery,
} = require("./supplier-service");
const { fetchInventoryByQuery } = require("./inventory-service");
const { fetchBusinessById } = require("./business-service");
const { fetchOrderStatusByName } = require("./order-status-service");
const { fetchProductsByQuery } = require("./product-service");
const { fetcHsnhByQuery } = require("./hsn-service");
const {
  billEvent,
  businessEvent,
  orderEvent,
  generateOrderEvent,
  notificationEvent,
  inventoryLedgerEvent,
  inventoryEvent,
  ecommerceEvent,
} = require("../utils/event-util");
const { fetchNormByQuery } = require("./quantity-norm-service");
const {
  queryToOrderFilterObject,
  bodyToEcoomerceOrderFettchObject,
} = require("../utils/conversion-util");
const { findOne } = require("./vehicle-service");
var bwipjs = require("bwip-js");
const inventoryLedger = require("../models/inventory-ledger");
const { fetchGeneratedOrderByQuery } = require("./generated-order-service");
const { checkForSchemeAndApply } = require("./apply-scheme-service");
const {
  generateOrderValidate,
  saveOrderValidate,
  rejectOrderValidate,
  assignVehicleValidate,
} = require("../utils/validate-request");
const { findSchemesByQuery } = require("./scheme-service");

exports.saveOrder = async (req, res) => {
  try {
    saveOrderValidate(req.body)
      .then((result) => saveOrderObject(req.body, req.user._id))
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        console.error(error);
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
  }
};

const saveOrderObject = async (body, user, generateOrderId) =>
  new Promise((resolve, reject) => {
    try {
      let supplier, productDocs, orderObj, order;
      fetchFacilityByQuery({ _id: body.facility })
        .then((result) => findSupplierById(body.suppliers))
        .then((result) => {
          supplier = result;
          return fetchProductsByQuery({
            query: {
              _id: { $in: body.products.map((t) => t.product) },
            },
            size: null,
            populate: [],
          });
        })
        .then((result) => {
          productDocs = result;
          return fetchInventoryByQuery({
            facility: supplier.facility,
            product: {
              $in: body.products.map((t) => t.productId),
            },
          });
        })
        .then((result) => {
          // inventoryOfSupplier = result; check this
          return fetcHsnhByQuery({
            _id: {
              $in: productDocs.map((t) => t.hsn),
            },
          });
        })
        .then((result) => createOrderObject(body, productDocs, result))
        .then((result) => {
          orderObj = result;
          return findOrderById(body.id);
        })
        .then((result) => {
          order = result;
          return order
            ? updateOrder(body, orderObj)
            : createOrder(
                body,
                { ...orderObj, userId: user },
                supplier,
                generateOrderId
              );
        })
        .then((result) => (order ? result : populateSavedOrder(result)))
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const populateSavedOrder = async (order) =>
  new Promise((resolve, reject) => {
    try {
      Order.populate(
        order,
        [
          { path: "products.product" },
          { path: "suppliers" },
          { path: "facility" },
          { path: "status" },
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response) {
            orderEvent.emit("order-placed-facility", response);
            resolve(response);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const updateOrder = async (body, order) =>
  new Promise((resolve, reject) => {
    try {
      Order.findOneAndUpdate(
        { id: body.id },
        {
          $set: {
            products: order.products,
            subTotal: order.subTotal,
          },
        },
        {
          new: true,
        }
      )
        .populate([
          { path: "products.product" },
          { path: "suppliers" },
          { path: "facility" },
          { path: "status" },
        ])
        .then(
          (result) => {
            orderEvent.emit("order-placed-facility", _res_save);
            resolve(result);
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
    } catch (e) {
      reject(e);
    }
  });

const createOrder = async (body, order, supplier, generateOrderId) =>
  new Promise((resolve, reject) => {
    try {
      fetchBusinessById(body.business)
        .then((result) => fetchOrderStatusByName("Generated"))
        .then((result) => {
          let orderObj = {
            id: body.id,
            suppliers: body.suppliers,
            facility: body.facility,
            business: body.business,
            status: result._id,
            createdBy: order.userId,
            products: order.products,
            subTotal: order.subTotal,
            orderNo: supplier.shortName + supplier.orderNo,
            password: Math.random().toString(36).substring(2, 10).toUpperCase(),
          };
          let newOrder = new Order(orderObj);
          newOrder.save((_err_save, _res_save) => {
            if (_err_save) {
              reject(_err_save);
            }

            if (_res_save) {
              if (supplier) updateOrderNoOfSupplier(supplier._id);
              if (generateOrderId) {
                GeneratedOrder.findOneAndDelete(generateOrderId).exec();
              }
              resolve(_res_save);
            } else {
              reject({
                message: "Unable to process.",
              });
            }
          });
        })
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });

const createOrderObject = async (body, productDocs, hsnDocs) =>
  new Promise((resolve, reject) => {
    try {
      let order = new Object();
      order.facility = body.facility;
      let products = [];

      for (let index = 0; index < body.products.length; index++) {
        const product = body.products[index];
        let productDetails = productDocs.find(
          (pro) => pro._id.toString() === product.product.toString()
        );

        let hsnGst = hsnDocs.find((hsn) => hsn._id == productDetails.hsn);
        if (!hsnGst) {
          reject({
            message: "GST not configured for this product",
            product: product,
          });
        }

        let obj = {
          product: product.product,
          ordNoOfCase: product.ordNoOfCase,
          ordNoOfProduct: product.ordNoOfProduct,
        };
        products.push(obj);
      }
      order.products = products;
      resolve(order);
    } catch (e) {
      reject(e);
    }
  });

exports.fetchOrderUpdated = async (req, res) => {
  try {
    findSuppliersByFacility(req.body)
      .then((result) => fetchOrderUpdatedByQuery(result, req.body))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};
const findSuppliersByFacility = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (body.facilities && body.facilities.length > 0) {
        findSuppliersByQuery({ query: { facility: { $in: body.facilities } } })
          .then((result) =>
            resolve({
              $or: [
                {
                  suppliers:
                    result && result.length > 0
                      ? {
                          $in: result.map((x) => x._id),
                        }
                      : { $ne: null },
                },
                {
                  facility: {
                    $in: body.facilities.map((x) => mongoose.Types.ObjectId(x)),
                  },
                },
              ],
            })
          )
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      } else {
        resolve({
          business: mongoose.Types.ObjectId(body.business),
        });
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.fetchOrder = async (req, res) => {
  try {
    let supplier;
    findOneSupplier(req.query.facility)
      .then((result) => {
        supplier = result;
        return queryToOrderFilterObject(req.query, supplier);
      })
      .then((result) =>
        !supplier && req.query.filter === "Supply"
          ? []
          : this.fetchOrderByQuery(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    let body = req.body;
    let orderStatus, order, productDocs, inventoryOfSupplier, supplierFacility;
    fetchOrderStatusByName("Accepted")
      .then((result) => {
        orderStatus = result;
        return fetchOrderAndValidate(body.id);
      })
      .then((result) => {
        order = result;
        return fetchFacilityByQuery({
          supplierDoc: order.suppliers._id,
        });
      })
      .then((result) => {
        supplierFacility = result;
        return fetchInventoryByQuery({
          facility: supplierFacility._id,
          product: {
            $in: order.products.map((x) => x.product),
          },
        });
      })
      .then((result) => {
        inventoryOfSupplier = result;
        return fetchProductsByQuery({
          query: {
            _id: { $in: body.products.map((t) => t.productId) },
          },
          size: null,
          populate: [{ path: "tax" }],
        });
      })
      .then((result) => {
        productDocs = result;
        return fetcHsnhByQuery({
          _id: {
            $in: productDocs.map((t) => t.hsn),
          },
        });
      })
      .then((result) =>
        saveEvaluatedOrder(
          body,
          result,
          productDocs,
          inventoryOfSupplier,
          supplierFacility,
          order,
          orderStatus,
          req.user
        )
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const fetchOrderAndValidate = (orderId) =>
  new Promise((resolve, reject) => {
    try {
      this.fetchOrderById(orderId, [
        { path: "suppliers" },
        { path: "facility" },
        { path: "status" },
      ])
        .then((result) => {
          if (result.status.name === "Generated") {
            resolve(result);
          } else {
            reject({ message: "Order already accepted!" });
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const saveEvaluatedOrder = async (
  body,
  hsnDocs,
  productDocs,
  inventoryOfSupplier,
  supplierFacility,
  order,
  orderStatus,
  user
) =>
  new Promise(async (resolve, reject) => {
    try {
      order.subTotal = 0;
      let products = order.products;
      let supplier = order.suppliers;
      let facility = order.facility;
      let business = order.business;
      let dataArray = [];
      let newInventoryLot = [];
      for (let index = 0; index < body.products.length; index++) {
        const product = body.products[index];
        let ordProduct = products.find((a) => a.product == product.productId);

        let productDetails = productDocs.find(
          (pr) => pr._id.toString() === product.productId
        );
        let hsn = hsnDocs.find((h) => h._id == productDetails.hsn);
        if (!hsn) {
          console.error("GST not configured for this product");
          reject({
            message: "GST not configured for this product",
            product: productDetails,
          });
        }

        let productOfInventory = inventoryOfSupplier.find(
          (p) => p.product.toString() === ordProduct.product.toString()
        );
        if (
          !productOfInventory ||
          productOfInventory.products.filter((x) => x.noOfCase || x.noOfProduct)
            .length == 0
        ) {
          console.error("No lot available for " + productDetails.name);
          reject({
            message: "No lot available for " + productDetails.name,
          });
          return;
        }
        ordProduct.price = 0;

        let lotArray = [];
        let transit = 0;
        let newArray = [];

        let existingArray = [];

        productOfInventory.products.map((t) =>
          existingArray.push(JSON.parse(JSON.stringify(t)))
        );
        for (let index1 = 0; index1 < product.lots.length; index1++) {
          const l = product.lots[index1];
          let price = 0;

          let lot = productOfInventory.products.find(
            (p) => p._id.toString() === l.lotId
          );
          existingArray = existingArray.filter(
            (t) => t._id !== lot._id.toString()
          );
          if (lot === undefined) {
            console.error("Please choose a valid lot!");
            reject({
              message: "Please choose a valid lot!",
            });
          } else if (
            (lot.noOfCase ? lot.noOfCase : 0) * lot.qtyPerCase +
              (lot.noOfProduct ? lot.noOfProduct : 0) <
            (l.noOfCase ? l.noOfCase : 0) * lot.qtyPerCase +
              (l.noOfProduct ? l.noOfProduct : 0)
          ) {
            let date = new Date(
              parseInt(lot._id.toString().substring(0, 8), 16) * 1000
            );
            let displayDate = new Date(date.toISOString()).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );
            console.error(
              "The selected lot " +
                displayDate +
                " do not have surplus products to fulfil the order,please select another lot."
            );
            reject({
              message:
                "The selected lot " +
                displayDate +
                " do not have surplus products to fulfil the order,please select another lot.",
            });
          }
          let costPrice = await calculateCostPrice(
            supplierFacility,
            facility,
            lot
          );
          price =
            (Number(lot.qtyPerCase) * Number(l.noOfCase) +
              Number(l.noOfProduct)) *
            costPrice;
          let tempTax;
          //remove unused check after supplier service update todo
          if (
            supplier.state &&
            facility.state.toString() !== supplier.state.toString()
          ) {
            tempTax = hsn.tax.filter(
              (x) => x.name !== "CGST" && x.name !== "SGST"
            );
          } else {
            tempTax = hsn.tax.filter((x) => x.name !== "IGST");
          }
          let tax = tempTax.map((x) => {
            return {
              type: x.name,
              percent: x.percentage,
              amount: (price * x.percentage) / 100,
            };
          });

          let lotObj = {
            id: l.id,
            lotId: lot._id,
            noOfCase: l.noOfCase,
            noOfProduct: l.noOfProduct,
            costPrice: costPrice,
            wholesalePrice: lot.wholesalePrice,
            retailPrice: lot.retailPrice,
            mrp: lot.mrp,
            qtyPerCase: lot.qtyPerCase,
            expiryDate: lot.expiryDate,
            scheme: lot.scheme,
            track: `Order No ${order.orderNo} delivered to
              ${facility.name}`,
            supplier: supplier._id,
            orderNo: order.orderNo,
            barcodeNo: lot.barcodeNo,
            barCode: lot.barCode,
            tax: tax,
            price: costPrice,
          };

          ordProduct.price += price;
          order.subTotal += price;
          tax.forEach((x) => (order.subTotal += x.amount));
          lotArray.push(lotObj);

          lot.noOfCase = l.remainingNoOfCases;
          lot.noOfProduct = l.remainingNoOfProducts;
          transit += l.noOfCase * lot.qtyPerCase + l.noOfProduct;
          newArray.push(lot);
        }

        inventoryLedgerEvent.emit("create", {
          inventory: productOfInventory,
          products: lotArray,
        });

        newArray.push(...existingArray);

        let invObj = {
          transit: productOfInventory.inTransit + transit,
          _id: productOfInventory._id.toString(),
          products: newArray,
        };

        if (productDetails.tax) {
          ordProduct.extraTax = productDetails.tax.map((x) => ({
            name: x.name,
            amount: (ordProduct.price * x.percentage) / 100,
            percentage: x.percentage,
          }));
          ordProduct.extraTax.map((x) => (order.subTotal += x.amount));
        }
        newInventoryLot.push(invObj);
        ordProduct.lots = lotArray;
        ordProduct.acpNoOfCase = product.acpNoOfCase;
        ordProduct.acpNoOfProduct = product.acpNoOfProduct;
        dataArray.push(ordProduct);
      }
      Order.findOneAndUpdate(
        { id: body.id },
        {
          $set: {
            products: dataArray,
            subTotal: order.subTotal,
            status: orderStatus._id,
          },
        },
        {
          new: true,
        }
      )
        .populate([{ path: "status" }, { path: "products.product" }])
        .then(
          (result) => {
            orderEvent.emit("order-updated", result);
            orderEvent.emit("create", {
              inventory: newInventoryLot,
              facility: supplierFacility,
              business: business,
              user: user,
            });
            let response = JSON.parse(JSON.stringify(result));
            resolve({
              status: response.status,
              products: response.products,
              subTotal: response.subTotal,
              _id: response._id,
              id: response.id,
            });
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

generateOrderEvent.on("create", (data) => {
  try {
    let facility;
    fetchFacilityByQuery({ _id: data.facility })
      .then((result) => {
        facility = result;
        return generateOrder(data.facility);
      })
      .then((result) => {
        let products = [];
        result.products.map((p) => {
          let obj = {
            product: p.product._id,
            ordNoOfCase: p.ordNoOfCase,
            ordNoOfProduct: p.ordNoOfProduct,
          };
          products.push(obj);
        });
        if (facility.suppliers.length === 1) {
          return [
            {
              facility: data.facility._id,
              business: data.business,
              products: products,
              suppliers: facility.suppliers[0],
              createdBy: data.user._id,
            },
          ];
        } else {
          return checkForSupplierByProduct(
            products,
            facility._id,
            data.business,
            data.user
          );
        }
      })
      .then((result) => {
        saveGeneratedOrder(result);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (e) {
    console.error(e);
  }
});

const checkForSupplierByProduct = async (products, facility, business, user) =>
  new Promise((resolve, reject) => {
    Promise.all(
      products.map((x) => {
        return inventoryLedger
          .aggregate([
            {
              $unwind: "$products",
            },
            {
              $match: {
                facility: facility,
                product: mongoose.Types.ObjectId(x.product),
                "products.orderId": {
                  $ne: null,
                },
                "products.returnId": {
                  $eq: null,
                },
              },
            },
            {
              $sort: {
                "products._id": -1,
              },
            },
            {
              $project: {
                supplier: "$products.supplier",
              },
            },
          ])
          .then((response) => {
            if (response && response.length > 0) {
              return {
                products: x,
                suppliers: response[0].supplier,
                facility: facility,
                business: business,
                createdBy: user._id,
              };
            }
          });
      })
    ).then((result) => {
      let groupBySupplier = result.reduce((finalResult, current) => {
        (finalResult[current.suppliers] =
          finalResult[current.suppliers] || []).push(current);
        return finalResult;
      }, {});
      let response = [];
      Object.entries(groupBySupplier).forEach((x) =>
        response.push({
          products: x[1].map((xx) => xx.products).flat(),
          suppliers: x[0],
          facility: facility,
          business: business,
          createdBy: user._id,
        })
      );
      resolve(response);
    });
  });

orderEvent.on("create", (data) => {
  try {
    generateOrderEvent.emit("create", {
      facility: data.facility._id,
      business: data.business,
      user: data.user,
    });
    Promise.all(
      data.inventory.map((_body) => {
        return Inventory.findByIdAndUpdate(
          _body._id,
          {
            $set: {
              inTransit: _body.transit || 0,
              products: _body.products,
            },
          },
          {
            new: true,
          },
          (_err, _res) => {
            if (_err) {
              console.error(_err);
            }

            if (_res) {
              let blankLots = _res.products.filter(
                (t) => t.noOfCase < 1 && t.noOfProduct < 1
              );
              Inventory.findByIdAndUpdate(_res._id, {
                $pull: {
                  products: {
                    _id: {
                      $in: blankLots.map((x) => x._id),
                    },
                  },
                },
              }).exec();
              return _res;
            }
          }
        );
      })
    ).then(
      (result) => {
        inventoryEvent.emit("lot-updated", {
          facility: data.facility._id,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  } catch (e) {
    console.error(e);
  }
});

exports.generateOrderForFacility = async (req, res) => {
  try {
    generateOrderValidate(req.body)
      .then((result) => generateOrder(req.body.facility))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
  }
};
const generateOrder = async (facility) =>
  new Promise((resolve, reject) => {
    try {
      let productDocs, quantityNorm;
      fetchFacilityByQuery({
        _id: facility,
      })
        .then((result) =>
          fetchNormByQuery({
            facility: facility,
          })
        )
        .then((result) => {
          if (!result) {
            resolve([]);
          } else {
            quantityNorm = result;
            return fetchProductsByQuery({
              query: {
                _id: {
                  $in: result.map((t) => t.product),
                },
              },
              size: null,
              populate: [],
            });
          }
        })
        .then((result) => {
          productDocs = result;
          return fetchInventoryByQuery({
            facility: facility,
          });
        })
        .then((result) =>
          buildOrderObjectAccordingToNorm(result, quantityNorm, productDocs)
        )
        .then((order) => resolve(order))
        .catch((error) => reject(error));
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });

const buildOrderObjectAccordingToNorm = async (
  inventory,
  quantityNorm,
  productDocs
) =>
  new Promise((resolve, reject) => {
    try {
      let order = new Object();
      let products = [];
      for (let index = 0; index < quantityNorm.length; index++) {
        let temp = true;
        let totalQuantity = 0;
        let qtyToOrd = 0;
        const norm = quantityNorm[index];
        let invPro = inventory.find(
          (pro) => pro.product.toString() === norm.product.toString()
        );
        if (invPro === undefined) {
          qtyToOrd = norm.maxOrdQty;
        } else {
          invPro.products.map((lot) => {
            lot.quantity =
              (lot.noOfCase ? lot.noOfCase : 0) * lot.qtyPerCase +
              (lot.noOfProduct ? lot.noOfProduct : 0);
            totalQuantity += Number(lot.quantity);
          });
          if (totalQuantity >= norm.minOrdQty) {
            temp = false;
          } else {
            qtyToOrd = norm.maxOrdQty - totalQuantity;
          }
        }
        let prod = productDocs.find(
          (pro) => pro._id.toString() === norm.product.toString()
        );
        let obj = {
          product: norm.product,
          ordNoOfCase: 0,
          ordNoOfProduct: qtyToOrd,
          product: prod,
        };

        if (temp) products.push(obj);
      }
      order.products = products;
      resolve(order);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const saveGeneratedOrder = async (generatedOrder) => {
  try {
    for (let index = 0; index < generatedOrder.length; index++) {
      const element = generatedOrder[index];
      let obj = {
        facility: element.facility,
        suppliers: element.suppliers,
      };
      GeneratedOrder.findOneAndUpdate(
        obj,
        {
          $set: {
            products: element.products,
            business: element.business,
            createdBy: element.createdBy,
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
        }
      ).exec();
    }
  } catch (e) {
    console.error(e);
  }
};

exports.findById = async (req, res) => {
  try {
    Order.aggregate(
      [
        {
          $match: {
            id: req.params.orderId,
          },
        },
        {
          $lookup: {
            from: "suppliers",
            localField: "suppliers",
            foreignField: "_id",
            as: "supplier",
          },
        },
        {
          $unwind: "$supplier",
        },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "inventories",
            let: {
              fId: "$supplier.facility",
              pId: "$products.product",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$facility", "$$fId"],
                      },
                      {
                        $eq: ["$product", "$$pId"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "inventory",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productDoc",
          },
        },
        {
          $unwind: "$productDoc",
        },
        {
          $lookup: {
            from: "facilities",
            localField: "facility",
            foreignField: "_id",
            as: "facility",
          },
        },
        {
          $unwind: "$facility",
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
          $unwind: {
            path: "$inventory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            products: {
              $push: {
                _id: "$products._id",
                product: "$productDoc",
                inventory: "$inventory",
                ordNoOfProduct: "$products.ordNoOfProduct",
                ordNoOfCase: "$products.ordNoOfCase",
                acpNoOfProduct: "$products.acpNoOfProduct",
                acpNoOfCase: "$products.acpNoOfCase",
                lots: "$products.lots",
                gst: "$products.gst",
              },
            },
            facility: {
              $first: "$facility",
            },
            suppliers: {
              $first: "$suppliers",
            },
            business: {
              $first: "$business",
            },
            orderNo: {
              $first: "$orderNo",
            },
            status: {
              $first: "$status",
            },
            reason: {
              $first: "$reason",
            },
            vehicle: {
              $first: "$vehicle",
            },
          },
        },
      ],
      (err_ord, res_ord) => {
        if (err_ord) {
          console.error(err_ord);
          return res.status(500).json(err_ord);
        }

        if (res_ord) {
          return res.status(200).json(res_ord[0]);
        } else {
          return res.status(500).json({
            message: "Unable to process!",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

billEvent.on("created", (data) => {
  try {
    let req = data.inventory;
    generateOrderEvent.emit("create", {
      facility: data.supplier,
      business: data.bill.business,
      user: data.user,
    });
    for (let index = 0; index < req.length; index++) {
      const _body = req[index];
      Inventory.findByIdAndUpdate(
        _body._id,
        {
          $set: {
            inTransit: _body.transit || 0,
            products: _body.products,
          },
        },
        {
          new: true,
        },
        (_err, _res) => {
          if (_err) {
            console.error(_err);
          }

          if (_res) {
            let blankLots = _res.products.filter(
              (t) => t.noOfCase < 1 && t.noOfProduct < 1
            );
            Inventory.findByIdAndUpdate(_res._id, {
              $pull: {
                products: {
                  _id: {
                    $in: blankLots.map((x) => x._id),
                  },
                },
              },
            }).exec();
          }
        }
      );
    }
  } catch (e) {
    console.error(e);
  }
});

//update business inventory
billEvent.on("created", (data) => {
  try {
    let products = data.bill.products;
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      for (let index1 = 0; index1 < product.lots.length; index1++) {
        const lot = product.lots[index1];
        Inventory.findOneAndUpdate(
          {
            product: product.product,
            business: data.bill.business,
            type: "Business",
            "products.lotId": lot.lotId.toString(),
          },
          {
            $inc: {
              "products.$.noOfCase": -lot.noOfCase,
              "products.$.noOfProduct": -lot.noOfProduct,
            },
          },
          {
            new: true,
          },
          (_err, _res) => {
            if (_err) {
              console.error(_err);
            }

            if (_res) {
              let blankLots = _res.products.filter(
                (t) => t.noOfCase < 1 && t.noOfProduct < 1
              );
              Inventory.findByIdAndUpdate(_res._id, {
                $pull: {
                  products: {
                    _id: {
                      $in: blankLots.map((x) => x._id),
                    },
                  },
                },
              }).exec();
            }
          }
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
});

exports.generatePassword = async (req, res) => {
  try {
    updatePassword(req.params.orderId, "")
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updatePassword = async (orderId, type) =>
  new Promise((resolve, reject) => {
    try {
      let password =
        type == "ECom"
          ? Math.random().toString(10).substring(2, 7).toUpperCase()
          : Math.random().toString(36).substring(2, 10).toUpperCase();
      Order.findOneAndUpdate(
        { id: orderId },
        {
          $set: {
            password: password,
          },
        },
        {
          new: true,
        },
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }

          if (response) {
            resolve(response);
          } else {
            reject({
              message: "Unable to process",
            });
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.assignVehicle = async (req, res) => {
  try {
    let body = req.body;
    assignVehicleValidate(body)
      .then((result) => findOne(body))
      .then((result) => updateVehicle(body))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchDetailsForInvoice = async (req, res) => {
  try {
    Order.findById(req.params.orderId)
      .populate("suppliers")
      .populate("facility")
      .populate("products.product")
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

exports.fetchOrderDetailsWithInventory = async (req, res) => {
  try {
    Order.findById(req.params.orderId, (err_order, res_order) => {
      if (err_order) {
        console.error(err_order);
        return res.status(500).json(err_order);
      }

      if (res_order) {
        let productIds = res_order.products.map((t) =>
          mongoose.Types.ObjectId(t.productId)
        );
        Inventory.find({
          $and: [
            {
              facilityId: mongoose.Types.ObjectId(res_order.suppliersId),
            },
            {
              productId: {
                $in: productIds,
              },
            },
          ],
        })
          .populate("productId")
          .then(
            (result) => {
              let response = JSON.parse(JSON.stringify(res_order));
              response.products.map((x) => {
                x.inventory = result.find(
                  (t) => t.productId._id.toString() === x.productId.toString()
                );
              });
              return res.status(200).json(response);
            },
            (error) => {
              console.error(error);
              return res.status(500).json(error);
            }
          );
      } else {
        return res.status(500).json({
          message: "Unable to fetch order details",
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateOrderNoOfSupplier = async (suppliersId) => {
  try {
    Supplier.findByIdAndUpdate(suppliersId, {
      $inc: {
        orderNo: 1,
      },
    }).exec();
  } catch (e) {
    console.error(e);
  }
};

billEvent.on("created", (data) => {
  try {
    Facility.findByIdAndUpdate(data.supplier, {
      $inc: {
        billNo: 1,
      },
    }).exec();
  } catch (e) {
    console.error(e);
  }
});

const fetchOrderAndVerifyPassword = async (body) =>
  new Promise((resolve, reject) => {
    try {
      this.fetchOrderById(body.id, [
        { path: "suppliers" },
        { path: "products.product" },
      ]).then((result) => {
        if (!result.suppliers.facility && !body.products) {
          reject({
            message: "Please give price information",
          });
        } else if (result.suppliers.facility) {
          if (!body.password) {
            reject({
              message: "Please enter password!",
            });
          } else if (body.password !== result.password) {
            reject({
              message: "Given password doesn't match!",
            });
          }
        }
        resolve(result);
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.deliverOrder = async (req, res) => {
  try {
    let order, inventoryOfFacility, business;

    fetchOrderAndVerifyPassword(req.body)
      .then((result) => {
        order = result;
        return fetchBusinessById(order.business);
      })
      .then((result) => {
        business = result;
        return fetchInventoryByQuery({
          $and: [
            {
              facility: order.facility,
            },
            {
              product: {
                $in: order.products.map((t) => t.product._id.toString()),
              },
            },
          ],
        });
      })
      .then((result) => {
        inventoryOfFacility = result;
        return fetchInventoryByQuery({
          $and: [
            {
              facility: order.suppliers.facility,
            },
            { type: null },
            {
              product: {
                $in: order.products.map((t) => t.product._id.toString()),
              },
            },
          ],
        });
      })
      .then((inventoryOfSupplier) =>
        updateOrderDocumentForDeliver(
          req.body,
          order,
          inventoryOfFacility,
          inventoryOfSupplier,
          business
        )
      )
      .then((result) => fetchOrderStatusByName("Delivered"))
      .then((result) =>
        updateOrderDocByQuery(order.id, {
          $set: {
            status: result._id,
          },
        })
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateOrderDocByQuery = async (oId, query) =>
  new Promise((resolve, reject) => {
    try {
      Order.findOneAndUpdate({ id: oId }, query, {
        new: true,
      })
        .populate([{ path: "suppliers" }])
        .then(
          (result) => {
            orderEvent.emit("order-delivered", result);
            resolve(result);
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

const updateOrderDocumentForDeliver = async (
  body,
  order,
  inventoryOfFacility,
  inventoryOfSupplier,
  business
) =>
  new Promise((resolve, reject) => {
    try {
      for (let index = 0; index < order.products.length; index++) {
        const product = order.products[index];

        let productDetails = product.product;
        let orderProduct;
        let inventoryOfSupplierForProduct;
        let lotToBeInsert = [];
        let total = 0;
        if (!inventoryOfSupplier || inventoryOfSupplier.length === 0) {
          orderProduct = body.products.find((op) => op._id == product._id);
          if (orderProduct) {
            if (
              !orderProduct.wholesalePrice ||
              !orderProduct.costPrice ||
              !orderProduct.retailPrice ||
              !orderProduct.mrp
            ) {
              reject({
                message: "Unable to recieve without price information!",
              });
              return;
            }
            let lotProduct = {
              id: orderProduct.id,
              noOfCase: orderProduct.acpNoOfCase,
              noOfProduct: orderProduct.acpNoOfProduct,
              orderId: order._id,
              wholesalePrice: orderProduct.wholesalePrice,
              costPrice: orderProduct.costPrice,
              retailPrice: orderProduct.retailPrice,
              qtyPerCase: orderProduct.qtyPerCase
                ? orderProduct.qtyPerCase
                : productDetails.qtyPerCase,
              mrp: orderProduct.mrp,
              expiryDate: orderProduct.expiryDate,
              scheme: orderProduct.scheme,
              track: `Order No ${order.orderNo} received from
            ${order.suppliers.name}`,
              supplier: order.suppliers._id,
              orderNo: order.orderNo,
              barcodeNo: business.barcodeSequence,
              price: orderProduct.costPrice,
            };
            lotToBeInsert.push(lotProduct);
          }
        } else {
          for (let x = 0; x < product.lots.length; x++) {
            let lotOfOrderProduct = product.lots[x];
            if (lotOfOrderProduct) {
              let lotProduct = {
                id: lotOfOrderProduct.id,
                noOfCase: lotOfOrderProduct.noOfCase,
                noOfProduct: lotOfOrderProduct.noOfProduct,
                orderId: order._id,
                wholesalePrice: lotOfOrderProduct.wholesalePrice,
                costPrice: lotOfOrderProduct.costPrice,
                retailPrice: lotOfOrderProduct.retailPrice,
                qtyPerCase: lotOfOrderProduct.qtyPerCase
                  ? lotOfOrderProduct.qtyPerCase
                  : productDetails.qtyPerCase,
                mrp: lotOfOrderProduct.mrp,
                expiryDate: lotOfOrderProduct.expiryDate,
                scheme: lotOfOrderProduct.scheme,
                lotId: lotOfOrderProduct.lotId,
                track: `Order No ${order.orderNo} received from
              ${order.suppliers.name}`,
                supplier: order.suppliers._id,
                orderNo: order.orderNo,
                barcodeNo: lotOfOrderProduct.barcodeNo,
                barCode: lotOfOrderProduct.barCode,
                price: lotOfOrderProduct.costPrice,
              };

              total +=
                lotOfOrderProduct.noOfCase * lotOfOrderProduct.qtyPerCase +
                lotOfOrderProduct.noOfProduct;
              lotToBeInsert.push(lotProduct);
            }
          }

          inventoryOfSupplierForProduct = inventoryOfSupplier.find(
            (s) => s.product.toString() === product.product._id.toString()
          );
        }

        let inventoryOfRequester = inventoryOfFacility.find(
          (i) => i.product.toString() === product.product._id.toString()
        );

        if (inventoryOfRequester) {
          let obj = {
            _id: inventoryOfRequester._id,
            product: lotToBeInsert,
          };
          updateInventoryOfFacility(obj, order.suppliers, business);
          inventoryLedgerEvent.emit("create", {
            inventory: inventoryOfRequester,
            products: lotToBeInsert,
          });
        } else {
          let obj = {
            facility: order.facility,
            product: product.product._id,
            business: order.business,
            products: lotToBeInsert,
          };
          inventoryLedgerEvent.emit("create", {
            inventory: obj,
            products: obj.products,
          });
          let inventory = new Inventory(obj);
          inventory.save((error, response) => {
            if (error) {
              console.error(error);
              reject(error);
              return;
            }
            if (response && !order.suppliers.facility) {
              generateBarcode(
                response.products[response.products.length - 1].barcodeNo
              ).then((result) => {
                Inventory.findOneAndUpdate(
                  {
                    _id: response._id,
                    "products._id": response.products[0]._id,
                  },
                  {
                    $set: {
                      "products.$.lotId": response.products[0]._id.toString(),
                      "products.$.barCode": result,
                    },
                  }
                ).then(
                  (resp) => {
                    inventoryEvent.emit("lot-updated", {
                      facility: resp.facility,
                    });
                  },
                  (er) => console.error(er)
                );

                let obj1 = {
                  type: "Business",
                  product: product.product._id,
                  business: order.business,
                  facility: null,
                  products: [
                    {
                      ...lotToBeInsert[0],
                      lotId: response.products[0]._id.toString(),
                      barCode: result,
                    },
                  ],
                };
                let newInventory = new Inventory(obj1);
                newInventory.save((er, resp) => {
                  if (resp) {
                    inventoryEvent.emit("lot-updated-business", {
                      business: response.business,
                    });
                  }
                  if (er) {
                    console.error(er);
                  }
                });
                businessEvent.emit("barcode-created", business);
              });
            } else {
              inventoryEvent.emit("lot-updated", {
                facility: response.facility,
              });
            }
          });
        }
        if (inventoryOfSupplierForProduct) {
          Inventory.findByIdAndUpdate(inventoryOfSupplierForProduct._id, {
            $set: {
              inTransit: inventoryOfSupplierForProduct.inTransit - total,
            },
          }).exec();
        }
      }
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });

const updateInventoryOfFacility = async (req, supplier, business) => {
  try {
    Inventory.findByIdAndUpdate(
      req._id,
      {
        $push: {
          products: req.product,
        },
      },
      {
        new: true,
      },
      (error, response) => {
        if (error) {
          console.error(error);
        }
        if (response && !supplier.facility) {
          generateBarcode(
            response.products[response.products.length - 1].barcodeNo
          ).then((result) => {
            Inventory.findOneAndUpdate(
              {
                _id: req._id,
                "products._id":
                  response.products[response.products.length - 1]._id,
              },
              {
                $set: {
                  "products.$.lotId":
                    response.products[
                      response.products.length - 1
                    ]._id.toString(),
                  "products.$.barCode": result,
                },
              }
            ).then(
              (resp) => {
                inventoryEvent.emit("lot-updated", {
                  facility: response.facility,
                });
              },
              (er) => console.error(er)
            );
            let newLot = {
              ...req.product[0],
              lotId:
                response.products[response.products.length - 1]._id.toString(),
              barCode: result,
            };
            Inventory.findOneAndUpdate(
              {
                business: response.business,
                type: "Business",
                product: response.product,
              },
              {
                $push: {
                  products: newLot,
                },
              }
            ).then(
              (resp) => {
                inventoryEvent.emit("lot-updated-business", {
                  business: response.business,
                });
              },
              (er) => console.error(er)
            );
          });
          businessEvent.emit("barcode-created", business);
        } else {
          inventoryEvent.emit("lot-updated", {
            facility: response.facility,
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

businessEvent.on("barcode-created", (data) => {
  try {
    let x = parseInt(data.barcodeSequence) + 1;
    Business.findByIdAndUpdate(data._id, {
      $set: {
        barcodeSequence: String(x).padStart(8, "0"),
      },
    }).exec();
  } catch (e) {
    console.error(e);
  }
});

exports.rejectOrder = async (req, res) => {
  try {
    rejectOrderValidate(req.body)
      .then((result) => rejectSupplyOrder(req.body.orderId, req.body.reason))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};
const rejectSupplyOrder = (orderId, reason) =>
  new Promise((resolve, reject) => {
    fetchOrderStatusByName("Rejected")
      .then((result) =>
        Order.findOneAndUpdate(
          { id: orderId },
          {
            $set: {
              status: result._id,
              reason: reason,
            },
          },
          {
            new: true,
          }
        ).exec()
      )
      .then((result) => {
        checkAndSwitchToAnotherFacility(
          result,
          result.products.map((x) => ({
            product: x.product.toString(),
            ordNoOfCase: x.ordNoOfCase,
            ordNoOfProduct: x.ordNoOfProduct,
          })),
          result.discount,
          result.subTotal
        );
        if (result.type !== "E-COM") {
          orderEvent.emit("order-updated", result);
        }
        resolve(result);
      })
      .catch((error) => reject(error));
  });

const calculateCostPrice = async (supplierFacility, facility, lot) => {
  try {
    if (
      supplierFacility.type === "Warehouse" &&
      facility.type === "Warehouse"
    ) {
      return lot.costPrice;
    } else if (
      supplierFacility.type === "Warehouse" &&
      facility.type === "Store"
    ) {
      return lot.wholesalePrice;
    } else if (supplierFacility.type === "Store" && facility.type === "Store") {
      return lot.costPrice;
    } else if (
      supplierFacility.type === "Store" &&
      facility.type === "Warehouse"
    ) {
      return lot.costPrice;
    }
  } catch (err) {
    console.error(err);
  }
};

exports.fetchOrderById = async (oId, populate) =>
  new Promise((resolve, reject) => {
    try {
      Order.findOne({ id: oId })
        .populate(populate)
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject({ message: "No order found!" });
            }
          },
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

exports.findOrder = async (query, populate) =>
  new Promise((resolve, reject) => {
    try {
      Order.findOne(query)
        .populate(populate)
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject({ message: "No order found!" });
            }
          },
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });
const findOrderById = async (oId, populate) =>
  new Promise((resolve, reject) => {
    try {
      Order.findOne({ id: oId })
        .populate(populate)
        .then(
          (result) => {
            resolve(result);
          },
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

exports.fetchOrderByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Order.aggregate(
        [
          {
            $match: queryObj.query,
          },
          {
            $lookup: {
              from: "suppliers",
              localField: "suppliers",
              foreignField: "_id",
              as: "supplier",
            },
          },
          {
            $unwind: "$supplier",
          },
          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: "products",
              localField: "products.product",
              foreignField: "_id",
              as: "pro",
            },
          },
          {
            $unwind: "$pro",
          },
          ...queryObj.queryAddOn,
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
                    $ne: "Delivered",
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
            $lookup: {
              from: "facilities",
              localField: "facility",
              foreignField: "_id",
              as: "facility",
            },
          },
          {
            $unwind: "$facility",
          },
          {
            $lookup: {
              from: "vehicles",
              localField: "vehicle",
              foreignField: "_id",
              as: "vehicle",
            },
          },
          {
            $unwind: {
              path: "$vehicle",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $or: [
                {
                  "facility.name": queryObj.name,
                },
                {
                  "pro.name": queryObj.name,
                },
                {
                  orderNo: queryObj.name,
                },
              ],
            },
          },
          {
            $group: {
              _id: "$_id",
              products: {
                $push: {
                  _id: "$products._id",
                  product: "$pro",
                  ordNoOfProduct: "$products.ordNoOfProduct",
                  ordNoOfCase: "$products.ordNoOfCase",
                  lots: "$products.lots",
                  gst: "$products.gst",
                  acpNoOfProduct: "$products.acpNoOfProduct",
                  acpNoOfCase: "$products.acpNoOfCase",
                },
              },
              id: {
                $first: "$id",
              },
              facility: {
                $first: "$facility",
              },
              suppliers: {
                $first: "$supplier",
              },
              business: {
                $first: "$business",
              },
              subTotal: {
                $first: "$subTotal",
              },
              orderNo: {
                $first: "$orderNo",
              },
              status: {
                $first: "$status",
              },
              reason: {
                $first: "$reason",
              },
              vehicle: {
                $first: "$vehicle",
              },
              password: {
                $first: "$password",
              },
            },
          },
          {
            $skip: queryObj.skip,
          },
          {
            $limit: queryObj.limit,
          },
          { $sort: { orderNo: -1 } },
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }

          if (response) {
            resolve(response);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
const updateVehicle = async (body) =>
  new Promise((resolve, reject) => {
    try {
      fetchOrderStatusByName("Vehicle Assigned")
        .then((result) => {
          Order.findOneAndUpdate(
            { id: body.orderId },
            {
              $set: {
                vehicle: body.vehicle,
                status: result._id,
              },
            },
            {
              new: true,
            }
          )
            .populate([{ path: "vehicle" }])
            .then(
              (response) => {
                if (response.type !== "E-COM") {
                  orderEvent.emit("order-updated", response);
                }
                resolve(response);
              },
              (error) => {
                console.error(error);
                reject(error);
              }
            );
        })
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });

exports.fetchPrice = async (req, res) => {
  try {
    let body = req.body;
    let productDocs, inventoryOfSupplier, supplier;
    let productIds = body.products.map((t) => t.product);

    fetchFacilityByQuery({ _id: body.suppliers })
      .then((result) => {
        supplier = result;
        return fetchInventoryByQuery({
          facility: supplier._id,
          product: {
            $in: productIds,
          },
        });
      })
      .then((result) => {
        inventoryOfSupplier = result;
        return fetchProductsByQuery({
          query: {
            _id: { $in: productIds },
          },
          size: null,
          populate: [{ path: "tax" }],
        });
      })
      .then((result) => {
        productDocs = result;
        return fetcHsnhByQuery({
          _id: {
            $in: productDocs.map((t) => t.hsn),
          },
        });
      })
      .then(
        (result) =>
          objectForPriceCalculation(
            result,
            body,
            inventoryOfSupplier,
            productDocs
          )
        // supplier check this
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};
const objectForPriceCalculation = async (
  gstHsnDocs,
  body,
  inventoryOfSupplier,
  productDocs
) =>
  new Promise((resolve, reject) => {
    try {
      let order = new Object();
      order.subTotal = 0;
      let products = [];

      for (let index = 0; index < body.products.length; index++) {
        const product = body.products[index];
        let invPro = inventoryOfSupplier.find(
          (p) => p.product.toString() === product.product
        );
        let productDetails = productDocs.find(
          (pro) => pro._id.toString() === product.product
        );

        let hsn = gstHsnDocs.find((h) => h._id == productDetails.hsn);
        if (!hsn) {
          reject({
            message: "GST not configured for this product",
            product: product,
          });
        }
        let lotArray = [];

        let totalPrice = 0;
        for (let pi = 0; pi < product.lotArray.length; pi++) {
          const t = product.lotArray[pi];

          let currentLot = invPro.products.find(
            (l) => l._id.toString() === t.lotId
          );
          let price = 0;
          if (currentLot) {
            price +=
              currentLot.retailPrice *
              (currentLot.qtyPerCase * t.noOfCase + t.noOfProduct);
          }

          let tax = hsn.tax
            .filter((x) => x.name !== "IGST")
            .map((x) => {
              return {
                type: x.name,
                percent: x.percentage,
                amount: (price * x.percentage) / 100,
              };
            });

          let lotObj = {
            tax: tax,
          };
          lotArray.push(lotObj);

          totalPrice += price;
          order.subTotal += Number(price);
          tax.forEach((x) => (order.subTotal += x.amount));
        }

        let obj = {
          price: totalPrice,
          lots: lotArray,
        };
        if (productDetails.tax) {
          obj.extraTax = productDetails.tax.map((x) => ({
            name: x.name,
            amount: (totalPrice * x.percentage) / 100,
            percentage: x.percentage,
          }));
          obj.extraTax.map((x) => (order.subTotal += x.amount));
        }
        products.push(obj);
        order.products = products;
      }

      resolve(order);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const generateBarcode = async (text) =>
  new Promise((resolve, reject) => {
    try {
      bwipjs.toBuffer(
        {
          bcid: "code128",
          text: text,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: "center",
        },
        (error, buffer) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (buffer) {
            let gifBase64 = `data:image/gif;base64,${buffer.toString(
              "base64"
            )}`;
            resolve(gifBase64);
          } else {
            reject({ message: "Unable to generate the barcode!" });
          }
        }
      );
    } catch (e) {
      console.error(e);
    }
  });

exports.confirmGeneratedOrder = async (req, res) => {
  try {
    let body = req.body,
      generateOrder;

    fetchGeneratedOrderByQuery({ _id: body._id })
      .then((result) => {
        generateOrder = JSON.parse(JSON.stringify(result));
        delete generateOrder["_id"];
        return body.status
          ? saveOrderObject(
              generateOrder,
              generateOrder.createdBy,
              result._id.toString()
            )
          : rejectOrder(body);
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
  }
};

const rejectOrder = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let updateObj = new Object();
      if (body.type === "Procurement") {
        updateObj.rejectedByFacility = true;
      } else if (body.type === "Supply") {
        updateObj.rejectedBySupplier = true;
      } else {
        reject({ message: "Nothing to update" });
      }
      GeneratedOrder.findByIdAndUpdate(
        body._id,
        {
          $set: updateObj,
        },
        { new: true },
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

const fetchOrderUpdatedByQuery = async (obj, body) =>
  new Promise((resolve, reject) => {
    try {
      Order.aggregate(
        [
          {
            $match: obj,
          },
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
            $lookup: {
              from: "facilities",
              localField: "facility",
              foreignField: "_id",
              as: "facility",
            },
          },
          {
            $unwind: "$facility",
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
              $and:
                body.type === "Active"
                  ? [
                      {
                        "status.name": {
                          $ne: "Delivered",
                        },
                      },
                      {
                        "status.name": {
                          $ne: "Rejected",
                        },
                      },
                    ]
                  : [
                      {
                        "status.name": {
                          $eq: "Delivered",
                        },
                      },
                      {
                        "status.name": {
                          $eq: "Rejected",
                        },
                      },
                    ],
            },
          },
          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: "products",
              localField: "products.product",
              foreignField: "_id",
              as: "pro",
            },
          },
          {
            $unwind: "$pro",
          },
          {
            $group: {
              _id: "$_id",
              products: {
                $push: {
                  _id: "$products._id",
                  product: "$pro",
                  ordNoOfProduct: "$products.ordNoOfProduct",
                  ordNoOfCase: "$products.ordNoOfCase",
                  lots: "$products.lots",
                  gst: "$products.gst",
                  acpNoOfProduct: "$products.acpNoOfProduct",
                  acpNoOfCase: "$products.acpNoOfCase",
                  extraTax: "$products.extraTax",
                },
              },
              id: {
                $first: "$id",
              },
              facility: {
                $first: "$facility",
              },
              suppliers: {
                $first: "$suppliers",
              },
              business: {
                $first: "$business",
              },
              subTotal: {
                $first: "$subTotal",
              },
              orderNo: {
                $first: "$orderNo",
              },
              status: {
                $first: "$status",
              },
              reason: {
                $first: "$reason",
              },
              vehicle: {
                $first: "$vehicle",
              },
              password: {
                $first: "$password",
              },
            },
          },
          { $sort: { _id: -1 } },
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response) {
            resolve(response);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.findEcommerceOrder = async (query, body, skip) =>
  new Promise((resolve, reject) => {
    try {
      let statusFilter = [
        {
          $unwind: "$status",
        },
      ];
      if (body && body.type === "Delivered") {
        statusFilter.push({
          $match: {
            "status.name": { $eq: "Delivered" },
          },
        });
      } else if (body && (body.type === "Active" || body.type === "Business")) {
        statusFilter.push({
          $match: {
            "status.name": { $ne: "Delivered" },
          },
        });
      }
      let sortAndPageQuery = [{ $sort: { _id: -1 } }];
      if (skip != null) {
        sortAndPageQuery.push(
          {
            $skip: skip,
          },
          {
            $limit: 10,
          }
        );
      }
      Order.aggregate(
        [
          {
            $match: query,
          },
          {
            $lookup: {
              from: "facilities",
              localField: "suppliers",
              foreignField: "_id",
              as: "suppliers",
            },
          },
          {
            $unwind: "$suppliers",
          },
          {
            $lookup: {
              from: "orderstatuses",
              localField: "status",
              foreignField: "_id",
              as: "status",
            },
          },
          ...statusFilter,
          {
            $lookup: {
              from: "vehicles",
              localField: "vehicle",
              foreignField: "_id",
              as: "vehicle",
            },
          },
          {
            $unwind: {
              path: "$vehicle",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "driver",
              foreignField: "_id",
              as: "driver",
            },
          },
          {
            $unwind: {
              path: "$driver",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
            },
          },
          {
            $unwind: "$createdBy",
          },
          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: "products",
              localField: "products.product",
              foreignField: "_id",
              as: "pro",
            },
          },
          {
            $unwind: "$pro",
          },
          {
            $lookup: {
              from: "addresses",
              localField: "address",
              foreignField: "_id",
              as: "address",
            },
          },
          {
            $unwind: "$address",
          },
          {
            $lookup: {
              from: "orderfeedbacks",
              localField: "feedback",
              foreignField: "_id",
              as: "feedback",
            },
          },
          {
            $unwind: {
              path: "$feedback",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              business: {
                $first: "$business",
              },
              products: {
                $push: {
                  _id: "$products._id",
                  product: "$pro",
                  ordNoOfCase: "$products.ordNoOfCase",
                  ordNoOfProduct: "$products.ordNoOfProduct",
                  acpNoOfCase: "$products.acpNoOfCase",
                  acpNoOfProduct: "$products.acpNoOfProduct",
                  price: "$products.price",
                  lots: "$products.lots",
                  extraTax: "$products.extraTax",
                },
              },
              id: {
                $first: "$id",
              },
              type: {
                $first: "$type",
              },
              suppliers: {
                $first: "$suppliers",
              },
              orderNo: {
                $first: "$orderNo",
              },
              subTotal: {
                $first: "$subTotal",
              },
              address: {
                $first: "$address",
              },
              createdBy: {
                $first: "$createdBy",
              },
              status: {
                $first: "$status",
              },
              expectedDeliveryBy: {
                $first: "$expectedDeliveryBy",
              },
              vehicle: {
                $first: "$vehicle",
              },
              driver: {
                $first: "$driver",
              },
              password: {
                $first: "$password",
              },
              feedback: {
                $first: "$feedback",
              },
              discount: {
                $first: "$discount",
              },
              checkoutSubtotal: {
                $first: "$checkoutSubtotal",
              },
            },
          },
          ...sortAndPageQuery,
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response) {
            resolve(response);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.fetchEcommerceOrder = async (req, res) => {
  try {
    bodyToEcoomerceOrderFettchObject(req.body)
      .then((result) =>
        this.findEcommerceOrder(result, req.body, req.body.skip)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.dispatchOrders = async (req, res) => {
  try {
    fetchOrderStatusByName("Dispatched").then((result) => {
      Order.updateMany(
        { _id: { $in: req.body.orders.map((x) => x._id) } },
        { $set: { status: result._id } }
      ).then(
        (result) => {
          Order.find({ _id: { $in: req.body.orders.map((x) => x._id) } })
            .populate([{ path: "status" }])
            .then(
              (response) => res.status(200).json(response),
              (err) => {
                console.error(err);
                return res.status(500).json(err);
              }
            );
        },
        (error) => {
          console.error(error);
          res.status(500).json(error);
        }
      );
    });
  } catch (e) {
    error(e);
    return res.status(500).json(e);
  }
};

exports.updateEcommerceOrder = async (req, res) => {
  try {
    updateEcomOrder(req.body, req.user)
      .then((result) =>
        this.findEcommerceOrder({ _id: mongoose.Types.ObjectId(req.body._id) })
      )
      .then((result) => {
        if (req.body.type === "Delivery") {
          ecommerceEvent.emit("delivered", {
            ...result[0],
            operation: req.body.type,
          });
        } else if (!["Assign Driver", "Vehicle"].includes(req.body.type)) {
          ecommerceEvent.emit("update-by-facility", {
            ...result[0],
            operation: req.body.type,
          });
        }
        return res.status(200).json(result[0]);
      })
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateEcomOrder = (body, user) =>
  new Promise((resolve, reject) => {
    (body.type === "Accept"
      ? acceptEcommerceOrder(body, user)
      : body.type === "Reject"
      ? rejectSupplyOrder(body.orderId, body.reason)
      : body.type === "Vehicle"
      ? updateVehicle({ orderId: body.orderId, vehicle: body.vehicle })
      : body.type === "Password"
      ? updatePassword(body.orderId, "ECom")
      : body.type === "Delivery"
      ? deliverEcomOrder(body)
      : body.type === "Dispatch"
      ? dispatchOrder(body)
      : assignDriver(body)
    )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

const acceptEcommerceOrder = async (body, user) =>
  new Promise((resolve, reject) => {
    try {
      let orderStatus,
        order,
        productDocs,
        inventoryOfSupplier,
        supplierFacility,
        schemes;
      fetchOrderStatusByName("Accepted")
        .then((result) => {
          orderStatus = result;
          return this.fetchOrderById(body.id, [{ path: "createdBy" }]);
        })
        .then((result) => {
          order = result;
          return validateComboProduct(result, body);
        })
        .then((result) => {
          return findSchemesByQuery({
            business: order.business,
            type: {
              $in: [
                "PRODUCT_DISCOUNT",
                "COMBO_PRODUCT_DISCOUNT",
                "COMBO_PRODUCT_FREE",
              ],
            },
            $and: [
              { effectFrom: { $lte: new Date() } },
              { effectTill: { $gt: new Date() } },
              { active: true },
            ],
          });
        })
        .then((result) => {
          schemes = result;
          return checkForComboScheme(body, result);
        })
        .then((result) => {
          return fetchFacilityByQuery({
            _id: order.suppliers,
          });
        })
        .then((result) => {
          supplierFacility = result;
          return fetchInventoryByQuery({
            facility: supplierFacility._id,
            product: {
              $in: order.products.map((x) => x.product),
            },
          });
        })
        .then((result) => {
          inventoryOfSupplier = result;
          return fetchProductsByQuery({
            query: {
              _id: { $in: body.products.map((t) => t.productId) },
            },
            size: null,
            populate: [{ path: "tax" }],
          });
        })
        .then((result) => {
          productDocs = result;
          return fetcHsnhByQuery({
            _id: {
              $in: productDocs.map((t) => t.hsn),
            },
          });
        })
        .then((result) =>
          saveEvaluatedEcommerceOrder(
            body,
            result,
            productDocs,
            inventoryOfSupplier,
            supplierFacility,
            order,
            orderStatus,
            user,
            schemes
          )
        )
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });

const validateComboProduct = (order, body) =>
  new Promise((resolve, reject) => {
    try {
      let comboProducts = order.products.filter((x) => x.comboProduct);
      if (comboProducts.length > 0) {
        for (let index = 0; index < comboProducts.length; index++) {
          const element = comboProducts[index];
          let acceptedProduct = body.products.find(
            (x) => x.productId === element.comboProduct.toString()
          );
          let orderedProduct = order.products.find(
            (x) => x.product.toString() == element.comboProduct.toString()
          );
          if (
            !acceptedProduct ||
            acceptedProduct.acpNoOfCase != orderedProduct.ordNoOfCase ||
            acceptedProduct.acpNoOfProduct != orderedProduct.ordNoOfProduct
          ) {
            reject({
              message:
                "You cannot accept a product partially which is involved in a scheme. Need to accept with ordered quantity or remove it then accept.",
            });
            return;
          } else {
            resolve(true);
          }
        }
      } else {
        resolve(true);
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const checkForComboScheme = (body, schemes) =>
  new Promise((resolve, reject) => {
    try {
      if (schemes && schemes.length > 0) {
        let comboDiscount = schemes.filter((x) =>
          x.type.startsWith("COMBO_PRODUCT")
        );
        if (comboDiscount.length > 0) {
          Promise.all(
            body.products.map((x) => {
              if (x.free) {
                return x;
              } else {
                let scheme = comboDiscount.find(
                  (cs) => cs.product.toString() === x.productId
                );
                if (scheme) {
                  let effect = scheme.evaluation
                    .sort((a, b) => b.qty - a.qty)
                    .find((y) => y.qty <= x.ordNoOfProduct);
                  if (!effect) {
                    effect = {};
                  }
                  if (effect.type === "FLAT_DISCOUNT") {
                    x.comboFlatDiscount = effect.discount;
                    return x;
                  } else if (effect.type === "PERCENTAGE_DISCOUNT") {
                    x.comboPercentDiscount = effect.discount;
                    return x;
                  } else if (effect.type === "FREE_PRODUCT") {
                    if (
                      body.products.find(
                        (x) =>
                          x.productId === effect.freeProduct &&
                          x.acpNoOfProduct == effect.freeQty &&
                          x.free
                      )
                    ) {
                      return x;
                    } else {
                      reject({
                        message:
                          "Without free product you cannot accept the order!",
                      });
                    }
                    // return [
                    //   x,
                    //   {
                    //     productId: effect.freeProduct,
                    //     ordNoOfProduct: effect.freeQty,
                    //     free: true,
                    //   },
                    // ];
                  } else {
                    return x;
                  }
                } else {
                  return x;
                }
              }
            })
          )
            .then((result) => resolve(result.flat()))
            .catch((error) => reject(error));
        } else {
          resolve(body.products.filter((x) => !x.free));
        }
      } else {
        resolve(body.products.filter((x) => !x.free));
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const saveEvaluatedEcommerceOrder = async (
  body,
  hsnDocs,
  productDocs,
  inventoryOfSupplier,
  supplierFacility,
  order,
  orderStatus,
  user,
  schemes
) =>
  new Promise(async (resolve, reject) => {
    try {
      let subTotal = 0;
      let products = order.products;
      let business = order.business;
      let dataArray = [];
      let newInventoryLot = [];
      let acceptedProducts = body.products
        .filter((x) => !x.free)
        .map((x) => x.productId);
      let notFulfilled = products
        .filter(
          (x) => x.price && !acceptedProducts.includes(x.product.toString())
        )
        .map((x) => ({
          product: x.product.toString(),
          ordNoOfCase: x.ordNoOfCase,
          ordNoOfProduct: x.ordNoOfProduct,
        }));
      let productDiscountSchemes = schemes.filter(
        (x) => x.type === "PRODUCT_DISCOUNT"
      );
      for (let index = 0; index < body.products.length; index++) {
        const product = body.products[index];
        let ordProduct = JSON.parse(
          JSON.stringify(products.find((a) => a.product == product.productId))
        );

        let productDetails = productDocs.find(
          (pr) => pr._id.toString() === product.productId
        );
        let hsn = hsnDocs.find((h) => h._id == productDetails.hsn);
        if (!hsn) {
          console.error("GST not configured for this product");
          reject({
            message: "GST not configured for this product",
            product: productDetails,
          });
        }

        let productOfInventory = inventoryOfSupplier.find(
          (p) => p.product.toString() === ordProduct.product.toString()
        );
        if (!productOfInventory) {
          console.error("No lot available for " + productDetails.name);
          reject({
            message: "No lot available for " + productDetails.name,
          });
          return;
        }
        ordProduct.price = 0;

        let lotArray = [];
        let transit = 0;
        let newArray = [];

        let existingArray = [];

        productOfInventory.products.map((t) =>
          existingArray.push(JSON.parse(JSON.stringify(t)))
        );
        let schemeToBeApplied = productDiscountSchemes.find((x) =>
          x.condition.products.includes(product.productId)
        );
        for (let index1 = 0; index1 < product.lots.length; index1++) {
          const l = product.lots[index1];
          let price = 0;

          let lot = productOfInventory.products.find(
            (p) => p._id.toString() === l.lotId
          );
          existingArray = existingArray.filter(
            (t) => t._id !== lot._id.toString()
          );
          if (lot === undefined) {
            console.error("Please choose a valid lot!");
            reject({
              message: "Please choose a valid lot!",
            });
            return;
          } else if (
            (lot.noOfCase ? lot.noOfCase : 0) * lot.qtyPerCase +
              (lot.noOfProduct ? lot.noOfProduct : 0) <
            (l.noOfCase ? l.noOfCase : 0) * lot.qtyPerCase +
              (l.noOfProduct ? l.noOfProduct : 0)
          ) {
            let date = new Date(
              parseInt(lot._id.toString().substring(0, 8), 16) * 1000
            );
            let displayDate = new Date(date.toISOString()).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );
            console.error(
              "The selected lot " +
                displayDate +
                " do not have surplus products to fulfil the order,please select another lot."
            );
            reject({
              message:
                "The selected lot " +
                displayDate +
                " do not have surplus products to fulfil the order,please select another lot.",
            });
            return;
          }
          let costPrice, tax;
          if (product.free) {
            costPrice = 0;
            tax = [];
          } else {
            costPrice = schemeToBeApplied
              ? lot.retailPrice -
                (schemeToBeApplied.effect.type == "FLAT_DISCOUNT"
                  ? schemeToBeApplied.effect.value
                  : (lot.retailPrice * schemeToBeApplied.effect.value) / 100)
              : lot.retailPrice;
            price =
              (Number(lot.qtyPerCase) * Number(l.noOfCase) +
                Number(l.noOfProduct)) *
              costPrice;

            if (product.comboFlatDiscount) {
              price -= product.comboFlatDiscount;
            }

            if (product.comboPercentDiscount) {
              price -= (price * product.comboPercentDiscount) / 100;
            }

            tax = hsn.tax
              .filter((x) => x.name !== "IGST")
              .map((x) => {
                return {
                  type: x.name,
                  percent: x.percentage,
                  amount: (price * x.percentage) / 100,
                };
              });
          }

          let lotObj = {
            id: l.id,
            lotId: lot._id,
            noOfCase: l.noOfCase,
            noOfProduct: l.noOfProduct,
            costPrice: costPrice,
            wholesalePrice: lot.wholesalePrice,
            retailPrice: lot.retailPrice,
            mrp: lot.mrp,
            qtyPerCase: lot.qtyPerCase,
            expiryDate: lot.expiryDate,
            scheme: lot.scheme,
            track: `Order No ${order.orderNo} delivered in ecommerce to
              ${order.createdBy.name}`,
            orderNo: order.orderNo,
            barcodeNo: lot.barcodeNo,
            barCode: lot.barCode,
            tax: tax,
            customer: order.createdBy._id,
            price: costPrice,
          };

          ordProduct.price += price;
          subTotal += price;
          tax.forEach((x) => (subTotal += x.amount));
          lotArray.push(lotObj);

          lot.noOfCase = l.remainingNoOfCases;
          lot.noOfProduct = l.remainingNoOfProducts;
          transit += l.noOfProduct;
          newArray.push(lot);
        }

        inventoryLedgerEvent.emit("create", {
          inventory: productOfInventory,
          products: lotArray,
        });

        newArray.push(...existingArray);

        let invObj = {
          transit: productOfInventory.inTransit + transit,
          _id: productOfInventory._id.toString(),
          products: newArray,
        };

        if (productDetails.tax) {
          ordProduct.extraTax = productDetails.tax.map((x) => ({
            name: x.name,
            amount: (ordProduct.price * x.percentage) / 100,
            percentage: x.percentage,
          }));
          ordProduct.extraTax.map((x) => (subTotal += x.amount));
        }
        newInventoryLot.push(invObj);
        ordProduct.lots = lotArray;
        ordProduct.acpNoOfCase = product.acpNoOfCase;
        ordProduct.acpNoOfProduct = product.acpNoOfProduct;
        if (
          ordProduct.ordNoOfCase - product.acpNoOfCase ||
          ordProduct.ordNoOfProduct - product.acpNoOfProduct
        ) {
          notFulfilled.push({
            product: product.productId,
            ordNoOfCase: ordProduct.ordNoOfCase - product.acpNoOfCase,
            ordNoOfProduct: ordProduct.ordNoOfProduct - product.acpNoOfProduct,
          });
        }
        dataArray.push(ordProduct);
      }
      let remainingDiscount,
        newDiscount,
        remainingSubtotal = order.subTotal - subTotal;
      if (order.discount && notFulfilled.length === 0) {
        subTotal -= order.discount;
      } else if (order.discount && notFulfilled.length > 0) {
        let discountPercent = order.discount / order.subTotal;
        newDiscount = subTotal * discountPercent;
        remainingDiscount = order.discount - newDiscount;
        subTotal -= newDiscount;
        remainingSubtotal = order.subTotal - subTotal;
      }
      if (
        notFulfilled.length > 0 &&
        supplierFacility.name !== "Master Warehouse"
      ) {
        checkAndSwitchToAnotherFacility(
          order,
          notFulfilled,
          remainingDiscount,
          remainingSubtotal
        );
      }
      Order.findOneAndUpdate(
        { _id: body._id },
        {
          $set: {
            products: dataArray,
            subTotal: subTotal,
            status: orderStatus._id,
            expectedDeliveryBy: body.expectedDeliveryBy,
            discount: newDiscount,
          },
        }
      ).then(
        (result) => {
          orderEvent.emit("create", {
            inventory: newInventoryLot,
            facility: supplierFacility,
            business: business,
            user: user,
          });
          resolve(result);
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

const dispatchOrder = async (body) =>
  new Promise((resolve, reject) => {
    try {
      fetchOrderStatusByName("Dispatched").then((result) => {
        Order.findOneAndUpdate(
          { id: body.orderId },
          {
            $set: {
              status: result._id,
            },
          }
        ).then(
          (response) => resolve(response),
          (error) => {
            console.error(error);
            reject(error);
          }
        );
      });
    } catch (e) {
      reject(e);
    }
  });

const assignDriver = async (body) =>
  new Promise((resolve, reject) => {
    try {
      Order.findOneAndUpdate(
        { id: body.orderId },
        {
          $set: {
            driver: body.driver,
          },
        }
      ).then(
        (response) => resolve(response),
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    } catch (e) {
      reject(e);
    }
  });

const deliverEcomOrder = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let order, supplierInevntory;
      findOrderById(body.orderId)
        .then((result) => {
          order = result;
          if (result.password === body.password) {
            return fetchInventoryByQuery({
              $and: [
                {
                  facility: order.suppliers,
                },
                { type: null },
                {
                  product: {
                    $in: order.products.map((t) => t.product._id.toString()),
                  },
                },
              ],
            });
          } else {
            return Promise.reject({
              message: "Given password does not match with delivery password!",
            });
          }
        })
        .then((result) => {
          supplierInevntory = result;
          updateSupplierAndBusinessInventory(order, supplierInevntory);
          return fetchOrderStatusByName("Delivered");
        })
        .then((result) =>
          Order.findByIdAndUpdate(order._id, {
            $set: { status: result._id },
          }).exec()
        )
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
      console.error(e);
    }
  });

const updateSupplierAndBusinessInventory = async (order, supplierInevntory) => {
  for (let index = 0; index < order.products.length; index++) {
    let orderProduct = order.products[index];
    let supInv = supplierInevntory.find(
      (x) => x.product.toString() === orderProduct.product.toString()
    );
    Inventory.findByIdAndUpdate(supInv._id, {
      $inc: { inTransit: -orderProduct.ordNoOfProduct },
    }).exec();
    for (let index1 = 0; index1 < orderProduct.lots.length; index1++) {
      const element = orderProduct.lots[index1];
      Inventory.findOneAndUpdate(
        {
          type: "Business",
          business: order.business.toString(),
          product: orderProduct.product,
          "products.lotId": element.lotId.toString(),
        },
        {
          $inc: {
            "products.$.noOfProduct": -element.noOfProduct,
          },
        },
        {
          new: true,
        },
        (_err, _res) => {
          if (_err) {
            console.error(_err);
          }

          if (_res) {
            let blankLots = _res.products.filter(
              (t) => t.noOfCase < 1 && t.noOfProduct < 1
            );
            Inventory.findByIdAndUpdate(_res._id, {
              $pull: {
                products: {
                  _id: {
                    $in: blankLots.map((x) => x._id),
                  },
                },
              },
            }).exec();
          }
        }
      );
    }
  }
};

const checkAndSwitchToAnotherFacility = async (
  order,
  notFulfilled,
  remainingDiscount,
  remainingSubtotal
) => {
  try {
    let orderStatus;
    fetchOrderStatusByName("Generated")
      .then((result) => {
        orderStatus = result;
        return findNextFacilityWithCurrentBeat(order);
      })
      .then((facility) => {
        let orderObj = {
          id: `O${facility.shortName.toUpperCase()}${new Date()
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "")}${
            new Date().toLocaleTimeString().replace(/:/g, "").split(" ")[0]
          }`,
          suppliers: facility._id,
          products: notFulfilled,
          status: orderStatus._id,
          createdBy: order.createdBy,
          business: order.business,
          beat: order.beat,
          orderNo: facility.shortName + facility.billNo,
          type: "E-COM",
          address: order.address,
          payment: order.payment,
          subTotal: remainingSubtotal,
        };
        if (remainingDiscount) {
          orderObj.discount = remainingDiscount;
        }

        let newOrder = new Order(orderObj);
        newOrder.save((error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }

          if (response) {
            ecommerceEvent.emit("order-place", response);
          } else {
            console.error({
              message: "Unable to process.",
            });
          }
        });
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
    reject(e);
  }
};

const findNextFacilityWithCurrentBeat = async (order) =>
  new Promise((resolve, reject) => {
    fetchFacilityByPoint({ beat: order.beat.toString() })
      .then((result) => {
        let current = result.find(
          (x) => x._id.toString() === order.suppliers.toString()
        );
        if (!current || current.name === "Master Warehouse") {
          reject({ message: "Order cannot be fulfilled!" });
        } else {
          if (result.find((x) => x.priority === current.priority + 1)) {
            resolve(result.find((x) => x.priority === current.priority + 1));
          } else {
            fetchFacilityByQuery({
              name: "Master Warehouse",
              business: order.business.toString(),
            })
              .then((response) => resolve(response))
              .catch((error) => reject(error));
          }
        }
      })
      .catch((error) => reject(error));
  });

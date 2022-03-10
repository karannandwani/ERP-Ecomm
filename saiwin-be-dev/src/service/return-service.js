var Return = require("../models/return");
var Facility = require("../models/facility");
var Product = require("../models/product");
var Business = require("../models/business");
var mongoose = require("mongoose");
var Supplier = require("../models/supplier");
var Inventory = require("../models/inventory");
const { fetchFacilityByQuery } = require("./facility-service");
const { fetchInventoryByQuery } = require("./inventory-service");
const { inventoryLedgerEvent, inventoryEvent } = require("../utils/event-util");
const {
  queryToReturnFilterObject,
  bodyToReturnFilterObject,
} = require("../utils/conversion-util");
const {
  findSupplierById,
  findOneSupplier,
  findSuppliersByQuery,
} = require("./supplier-service");
const { fetchOrderStatusByName } = require("./order-status-service");
const {
  rejectReturnOrderValidate,
  returnOrderValidate,
  assignVehicleValidateForReturn,
} = require("../utils/validate-request");
const { findOne } = require("./vehicle-service");
exports.create = async (req, res) => {
  try {
    let body = req.body;
    let inventoryOfFacility, supplier, facility;
    returnOrderValidate(body)
      .then((result) => fetchFacilityByQuery({ _id: body.facility }))
      .then((result) => {
        facility = result;
        return fetchInventoryByQuery({
          facility: facility._id,
          product: {
            $in: body.products.map((t) => t.productId),
          },
        });
      })
      .then((result) => {
        inventoryOfFacility = result;
        return findSupplierById(body.suppliers);
      })
      .then((result) => {
        supplier = result;
        return fetchOrderStatusByName("Requested");
      })
      .then((orderStatus) => {
        return updateInventoryOfFacility(
          body,
          inventoryOfFacility,
          supplier,
          facility,
          orderStatus
        );
      })
      .then((result) => save(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const save = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let newObj = new Return(obj.return);
      newObj.save((_err_save, _res_save) => {
        if (_err_save) {
          reject(_err_save);
        }

        if (_res_save) {
          updateReturnNo(obj.facility);
          updateInventory(obj);
          Return.populate(
            _res_save,
            [
              { path: "status" },
              { path: "products.product" },
              { path: "facility" },
              { path: "vehicle" },
              { path: "suppliers" },
            ],
            (error, response) => {
              if (error) {
                console.error(error);
                reject(error);
              }
              if (response) {
                resolve(response);
              } else {
                reject({
                  message: "Return request submitted. But unable to refresh.",
                });
              }
            }
          );
        } else {
          reject({
            message: "Unable to process.",
          });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const updateReturnNo = async (facility) => {
  try {
    Facility.findByIdAndUpdate(facility, {
      $inc: {
        returnNo: 1,
      },
    }).exec();
  } catch (e) {
    console.error(e);
  }
};

exports.fetchReturnsNew = async (req, res) => {
  try {
    fetchSuppliers(req.body.facilities)
      .then((result) => {
        return bodyToReturnFilterObject(req.body, result);
      })
      .then((result) => fetchReturnByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const fetchSuppliers = (facilities) =>
  new Promise((resolve, reject) => {
    if (facilities && facilities.length > 0) {
      findSuppliersByQuery({
        query: { facility: { $in: facilities } },
        populate: [],
      })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    } else {
      resolve([]);
    }
  });

exports.fetchReturns = async (req, res) => {
  try {
    let supplier;
    findOneSupplier(req.query.facility)
      .then((result) => {
        supplier = result;
        return queryToReturnFilterObject(req.body, supplier);
      })
      .then((result) =>
        !supplier && req.query.filter === "Supply"
          ? []
          : fetchReturnByQuery(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchReturnCountForLast24Hour = async (req, res) => {
  try {
    let currDate = new Date();
    currDate.setDate(currDate.getDate() - 1);
    let hexSec = Math.floor(currDate / 1000).toString(16);
    let objId = mongoose.Types.ObjectId(hexSec + "0000000000000000");
    let queryObj = new Object();
    if (req.query.facility && req.query.procurement === "Procurement") {
      queryObj.facility = mongoose.Types.ObjectId(req.query.facility);
    } else {
      queryObj.business = mongoose.Types.ObjectId(req.query.business);
    }
    if (req.query.suppliers && req.query.procurement === "Supply") {
      queryObj.suppliers = mongoose.Types.ObjectId(req.query.suppliers);
    }
    queryObj._id = { $gte: objId };
    Return.aggregate(
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
          return res.status(500).json(err_order);
        }

        if (res_order) {
          return res.status(200).json(res_order);
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.sta;
  }
};

exports.deliverReturn = async (req, res) => {
  try {
    let returnObj, inventoryOfFacility, inventoryOfSupplier;

    fetchReturnAndVerifyPassword(req.body)
      .then((result) => {
        returnObj = result;
        return fetchInventoryByQuery({
          $and: [
            {
              facility: returnObj.facility,
            },
            {
              product: {
                $in: returnObj.products.map((t) => t.product._id.toString()),
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
              facility: returnObj.suppliers.facility,
            },
            {
              product: {
                $in: returnObj.products.map((t) => t.product._id.toString()),
              },
            },
          ],
        });
      })
      .then((result) => {
        inventoryOfSupplier = result;
        updateReturnDocument(
          returnObj,
          inventoryOfFacility,
          inventoryOfSupplier
        );
        return fetchOrderStatusByName("Delivered");
      })
      .then((result) =>
        updateReturnDocByQuery(returnObj._id, {
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
const updateReturnDocument = async (
  returnObj,
  inventoryOfFacility,
  inventoryOfSupplier
) =>
  new Promise((resolve, reject) => {
    try {
      for (let index = 0; index < returnObj.products.length; index++) {
        const product = returnObj.products[index];
        let productDetails = product.product;
        let existingLots = JSON.parse(
          JSON.stringify(
            inventoryOfSupplier.find(
              (inv) => inv.product.toString() === product.product._id.toString()
            ).products
          )
        );
        let total = 0;
        let lotArray = [];
        for (let x = 0; x < product.lotArray.length; x++) {
          let lotOfOrderProduct = product.lotArray[x];
          let existingLotIndex = existingLots.findIndex(
            (el) => el.lotId === lotOfOrderProduct.lotId
          );
          if (existingLotIndex > -1) {
            let existingLot = existingLots[existingLotIndex];
            existingLot.noOfCase += lotOfOrderProduct.noOfCase;
            existingLot.noOfProduct += lotOfOrderProduct.noOfProduct;
            existingLot.returnId = returnObj._id;
            existingLot.track = `Return No ${returnObj.returnNo} received from
            ${returnObj.facility.name}`;
            existingLot.price = lotOfOrderProduct.costPrice;
            let obj = {
              ...existingLot,
              noOfCase: lotOfOrderProduct.noOfCase,
              noOfProduct: lotOfOrderProduct.noOfProduct,
            };
            delete obj["_id"];
            lotArray.push(obj);
            existingLots[existingLotIndex] = existingLot;
          } else {
            let obj = {
              id: lotOfOrderProduct.id,
              noOfCase: lotOfOrderProduct.noOfCase,
              noOfProduct: lotOfOrderProduct.noOfProduct,
              orderId: returnObj._id,
              returnId: returnObj._id,
              wholesalePrice: lotOfOrderProduct.wholesalePrice,
              costPrice: lotOfOrderProduct.costPrice,
              retailPrice: lotOfOrderProduct.retailPrice,
              qtyPerCase: lotOfOrderProduct.qtyPerCase
                ? lotOfOrderProduct.qtyPerCase
                : productDetails.qtyPerCase,
              mrp: lotOfOrderProduct.mrp,
              expiryDate: lotOfOrderProduct.expiryDate,
              lotId: lotOfOrderProduct.lotId,
              track: `Return No ${returnObj.returnNo} received from
              ${returnObj.facility.name}`,
              supplier: returnObj.suppliers._id, //add supplier from order -todo
              orderNo: returnObj.returnNo,
              barCode: lotOfOrderProduct.barCode,
              barcodeNo: lotOfOrderProduct.barcodeNo,
              price: lotOfOrderProduct.costPrice,
            };
            existingLots.push(obj);
            lotArray.push(obj);
          }
          total +=
            lotOfOrderProduct.noOfCase * lotOfOrderProduct.qtyPerCase +
            lotOfOrderProduct.noOfProduct;
        }
        let inventoryOfSupplierForProduct = inventoryOfSupplier.find(
          (i) => i.product.toString() === product.product._id.toString()
        );

        if (inventoryOfSupplierForProduct) {
          let obj = {
            _id: inventoryOfSupplierForProduct._id,
            products: existingLots,
          };
          updateInventoryOfSupplier(obj, returnObj);
          inventoryLedgerEvent.emit("create", {
            inventory: inventoryOfSupplierForProduct,
            products: lotArray,
          });
        }

        let inventoryOfFacilityForProduct = inventoryOfFacility.find(
          (s) => s.product.toString() === product.product._id.toString()
        );

        if (inventoryOfFacilityForProduct) {
          Inventory.findByIdAndUpdate(inventoryOfFacilityForProduct._id, {
            $set: {
              inTransit: inventoryOfFacilityForProduct.inTransit - total,
            },
          }).exec();
        }
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });

const updateReturnDocByQuery = async (returnId, query) =>
  new Promise((resolve, reject) => {
    try {
      Return.findByIdAndUpdate(returnId, query, {
        new: true,
      })
        .populate([
          { path: "status" },
          { path: "products.product" },
          { path: "facility" },
          { path: "vehicle" },
          { path: "suppliers" },
        ])
        .then(
          (result) => {
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

exports.findById = async (req, res) => {
  try {
    Return.findById(req.params.returnId)
      .populate("products.product")
      .populate("facility")
      .populate("status")
      .populate("suppliers")
      .then(
        (result) => {
          return res.status(200).json(result);
        },
        (error) => {
          return res.status(500).json(error);
        }
      );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.rejectReturn = async (req, res) => {
  try {
    let returnObj, inventoryOfFacility;
    rejectReturnOrderValidate(req.body)
      .then((result) =>
        fetchReturnById(req.body.returnId, [
          { path: "suppliers" },
          { path: "products.product" },
          { path: "facility" },
        ])
      )
      .then((result) => {
        returnObj = result;
        return fetchInventoryByQuery({
          $and: [
            {
              facility: returnObj.facility,
            },
            {
              product: {
                $in: returnObj.products.map((t) => t.product._id.toString()),
              },
            },
          ],
        });
      })
      .then((result) => {
        inventoryOfFacility = result;
        updateFacilityInventory(returnObj, inventoryOfFacility);
        return fetchOrderStatusByName("Rejected");
      })
      .then((result) => {
        return updateReturnDocByQuery(returnObj._id, {
          $set: {
            status: result._id,
            reason: req.body.reason,
          },
        });
      })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateInventoryOfFacility = async (
  body,
  inventoryOfFacility,
  supplier,
  facility,
  orderStatus
) =>
  new Promise((resolve, reject) => {
    try {
      let products = [];
      let newInventoryArray = [];

      for (let index = 0; index < body.products.length; index++) {
        const product = body.products[index];

        let invPro = inventoryOfFacility.find(
          (p) => p.product.toString() === product.productId
        );
        let lotArray = [];
        let transit = 0;
        totalPrice = 0;
        let existingLot = new Map();
        invPro.products.forEach((t) => {
          existingLot.set(t._id.toString(), JSON.parse(JSON.stringify(t)));
        });
        for (let index = 0; index < product.lotArray.length; index++) {
          const t = product.lotArray[index];

          let currentLot = invPro.products.find(
            (l) => l._id.toString() === t.lotId
          );
          let price = 0;

          price +=
            currentLot.costPrice *
            (currentLot.qtyPerCase * t.noOfCase + t.noOfProduct);
          totalPrice += price;
          let lotObj = {
            id: currentLot.id,
            lotId: currentLot.lotId,
            noOfProduct: t.noOfProduct ? t.noOfProduct : 0,
            noOfCase: t.noOfCase ? t.noOfCase : 0,
            costPrice: currentLot.costPrice,
            wholesalePrice: currentLot.wholesalePrice,
            retailPrice: currentLot.retailPrice,
            qtyPerCase: currentLot.qtyPerCase,
            mrp: currentLot.mrp,
            expiryDate: currentLot.expiryDate,
            barCode: currentLot.barCode,
            barcodeNo: currentLot.barcodeNo,
            track: `Return No ${facility.shortName + facility.returnNo
              } return to ${supplier.name}`,
            price: currentLot.costPrice,
            orderId: currentLot.orderId,
          };

          lotArray.push(lotObj);

          let currLot = {
            id: currentLot.id,
            noOfProduct: currentLot.noOfProduct - t.noOfProduct,
            noOfCase: currentLot.noOfCase - t.noOfCase,
            costPrice: currentLot.costPrice,
            wholesalePrice: currentLot.wholesalePrice,
            retailPrice: currentLot.retailPrice,
            qtyPerCase: currentLot.qtyPerCase,
            expiryDate: currentLot.expiryDate,
            mrp: currentLot.mrp,
            scheme: currentLot.scheme,
            orderId: currentLot.orderId,
            supplier: currentLot.supplier,
            lotId: currentLot.lotId,
            barCode: currentLot.barCode,
            barcodeNo: currentLot.barcodeNo,
          };
          existingLot.set(currentLot._id.toString(), currLot);
          transit +=
            Number(t.noOfCase) * Number(currentLot.qtyPerCase) +
            Number(t.noOfProduct);
        }
        let invObj = {
          _id: invPro._id,
          products: Array.from(existingLot.values()),
          inTransit: invPro.inTransit + transit,
        };
        newInventoryArray.push(invObj);

        inventoryLedgerEvent.emit("create", {
          inventory: invPro,
          products: lotArray,
        });

        let obj = {
          product: product.productId,
          reqNoOfCase: product.noOfCase ? product.noOfCase : 0,
          reqNoOfProduct: product.noOfProduct ? product.noOfProduct : 0,
          lotArray: lotArray,
        };
        products.push(obj);
      }

      let returnObj = {
        suppliers: body.suppliers,
        facility: body.facility,
        business: body.business,
        status: orderStatus._id,
        draft: body.draft,
        products: products,
        subTotal: totalPrice,
        returnNo: facility.shortName + facility.returnNo,
      };

      resolve({
        return: returnObj,
        newInventoryArray: newInventoryArray,
        facility: facility._id,
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const updateInventory = async (data) => {
  try {
    // for (let index = 0; index < req.length; index++) {
    //   const body = req[index];
    //   Inventory.findByIdAndUpdate(
    //     body._id,
    //     {
    //       $set: {
    //         inTransit: body.inTransit,
    //         products: body.products,
    //       },
    //     },
    //     {
    //       new: true,
    //     },
    //     (_err, _res) => {
    //       if (_err) {
    //         console.error(_err);
    //       }

    //       if (_res) {
    //         let blankLots = _res.products.filter(
    //           (t) => t.noOfCase < 1 && t.noOfProduct < 1
    //         );
    //         Inventory.findByIdAndUpdate(_res._id, {
    //           $pull: {
    //             products: {
    //               _id: {
    //                 $in: blankLots.map((x) => x._id),
    //               },
    //             },
    //           },
    //         }).exec();
    //       }
    //     }
    //   );
    // }

    Promise.all(
      data.newInventoryArray.map((_body) => {
        return Inventory.findByIdAndUpdate(
          _body._id,
          {
            $set: {
              inTransit: _body.inTransit || 0,
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
          facility: data.facility,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  } catch (e) {
    console.error(e);
  }
};

const fetchReturnByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Return.aggregate(
        [
          {
            $match: queryObj.query,
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
            $match: queryObj.statusFilter,
          },
          {
            $group: {
              _id: "$_id",
              products: {
                $push: {
                  _id: "$products._id",
                  product: "$pro",
                  reqNoOfCase: "$products.reqNoOfCase",
                  reqNoOfProduct: "$products.reqNoOfProduct",
                  acpNoOfCase: "$products.acpNoOfCase",
                  acpNoOfProduct: "$products.acpNoOfProduct",
                  lotArray: "$products.lotArray",
                },
              },
              draft: {
                $first: "$draft",
              },
              suppliers: {
                $first: "$suppliers",
              },
              business: {
                $first: "$business",
              },
              status: {
                $first: "$status",
              },
              facility: {
                $first: "$facility",
              },
              subTotal: {
                $first: "$subTotal",
              },
              returnNo: {
                $first: "$returnNo",
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
          { $sort: { returnNo: -1 } },
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

const fetchReturnById = async (returnId, populate) =>
  new Promise((resolve, reject) => {
    try {
      Return.findById(returnId)
        .populate(populate)
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject({ message: "No return found!" });
            }
          },
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

const updateInventoryOfSupplier = async (req, data) => {
  try {
    Inventory.findByIdAndUpdate(
      req._id,
      {
        $set: {
          products: req.products,
        },
      },
      {
        new: true,
      },
      (error, response) => {
        if (error) {
          console.error(error);
        }
        if (response) {
          inventoryEvent.emit("lot-updated", {
            facility: data.suppliers.facility,
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

exports.generatePassword = async (req, res) => {
  try {
    updateReturnDocByQuery(req.params.returnId, {
      $set: {
        password: Math.random().toString(36).substring(2, 10).toUpperCase(),
      },
    })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateFacilityInventory = async (returnObj, inventoryOfFacility) =>
  new Promise((resolve, reject) => {
    try {
      for (let index = 0; index < returnObj.products.length; index++) {
        const product = returnObj.products[index];
        let productDetails = product.product;
        let existingLots = JSON.parse(
          JSON.stringify(
            inventoryOfFacility.find(
              (inv) => inv.product.toString() === product.product._id.toString()
            ).products
          )
        );
        let total = 0;
        let lotArray = [];
        for (let x = 0; x < product.lotArray.length; x++) {
          let lotOfOrderProduct = product.lotArray[x];
          let existingLotIndex = existingLots.findIndex(
            (el) => el.lotId === lotOfOrderProduct.lotId
          );
          if (existingLotIndex > -1) {
            let existingLot = existingLots[existingLotIndex];
            existingLot.noOfCase += lotOfOrderProduct.noOfCase;
            existingLot.noOfProduct += lotOfOrderProduct.noOfProduct;
            existingLot.returnId = returnObj._id;
            existingLot.track = `Return No ${returnObj.returnNo} received from
          ${returnObj.suppliers.name}`;
            lotArray.push({
              ...existingLot,
              noOfCase: lotOfOrderProduct.noOfCase,
              noOfProduct: lotOfOrderProduct.noOfProduct,
            });
            existingLots[existingLotIndex] = existingLot;
          } else {
            let obj = {
              id: lotOfOrderProduct.id,
              noOfCase: lotOfOrderProduct.noOfCase,
              noOfProduct: lotOfOrderProduct.noOfProduct,
              orderId: returnObj._id,
              returnId: returnObj._id,
              wholesalePrice: lotOfOrderProduct.wholesalePrice,
              costPrice: lotOfOrderProduct.costPrice,
              retailPrice: lotOfOrderProduct.retailPrice,
              qtyPerCase: lotOfOrderProduct.qtyPerCase
                ? lotOfOrderProduct.qtyPerCase
                : productDetails.qtyPerCase,
              mrp: lotOfOrderProduct.mrp,
              expiryDate: lotOfOrderProduct.expiryDate,
              lotId: lotOfOrderProduct.lotId,
              track: `Return No ${returnObj.returnNo} received from
            ${returnObj.suppliers.name}`,
              supplier: returnObj.suppliers._id, //add supplier from order -todo
              orderNo: returnObj.returnNo,
              barCode: lotOfOrderProduct.barCode,
              barcodeNo: lotOfOrderProduct.barcodeNo,
            };
            existingLots.push(obj);
            lotArray.push(obj);
          }
          total +=
            lotOfOrderProduct.noOfCase * lotOfOrderProduct.qtyPerCase +
            lotOfOrderProduct.noOfProduct;
        }
        let inventoryOfFacilityForProduct = inventoryOfFacility.find(
          (i) => i.product.toString() === product.product._id.toString()
        );

        if (inventoryOfFacilityForProduct) {
          let obj = {
            _id: inventoryOfFacilityForProduct._id,
            products: existingLots,
            inTransit: inventoryOfFacilityForProduct.inTransit - total,
          };
          inventoryOfFacilityUpdate(obj, returnObj);
          inventoryLedgerEvent.emit("create", {
            inventory: inventoryOfFacilityForProduct,
            products: lotArray,
          });
        }
      }
      resolve();
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const inventoryOfFacilityUpdate = async (body, returnObj) =>
  new Promise((resolve, reject) => {
    try {
      Inventory.findByIdAndUpdate(
        body._id,
        {
          $set: {
            inTransit: body.inTransit || 0,
            products: body.products,
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
            resolve(_res);
            inventoryEvent.emit("lot-updated", {
              facility: returnObj.facility._id,
            });
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
const fetchReturnAndVerifyPassword = async (body) =>
  new Promise((resolve, reject) => {
    try {
      fetchReturnById(body._id, [
        { path: "suppliers" },
        { path: "products.product" },
        { path: "facility" },
      ]).then((result) => {
        if (result.suppliers.facility) {
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

exports.acceptReturnNew = async (req, res) => {
  try {
    let orderStatus, returnObj;
    fetchOrderStatusByName("Accepted")
      .then((result) => {
        orderStatus = result;
        return fetchReturnById(req.body._id);
      })
      .then((result) => {
        returnObj = result;
        return updateReturnObj(returnObj, req.body);
      })
      .then((result) => {
        return updateReturnDocByQuery(returnObj._id, {
          $set: {
            status: orderStatus._id,
            products: result,
          },
        });
      })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateReturnObj = async (returnObj, body) =>
  new Promise((resolve, reject) => {
    try {
      let acceptanceCheckProducts = [
        ...JSON.parse(JSON.stringify(returnObj.products)),
      ];
      let products = [];
      for (let index = 0; index < body.products.length; index++) {
        const product = body.products[index];

        let productOfReturnObj = returnObj.products.find(
          (p) => p.product.toString() === product.productId
        );
        let acceptanceCheckProduct = acceptanceCheckProducts.find(
          (x) => x.product === product.productId
        );
        let lotArray = [];
        for (let index = 0; index < product.lotArray.length; index++) {
          const lot = product.lotArray[index];

          lotOfReturnObj = productOfReturnObj.lotArray.find(
            (l) => l._id.toString() === lot._id
          );

          acceptanceCheckProduct.lotArray = acceptanceCheckProduct.lotArray.map(
            (x) =>
              x._id == lot._id
                ? {
                  ...x,
                  noOfCase: x.noOfCase - lot.noOfCase,
                  noOfProduct: x.noOfProduct - lot.noOfProduct,
                }
                : { ...x }
          );
          let lotObj = {
            id: lotOfReturnObj.id,
            lotId: lotOfReturnObj.lotId,
            noOfProduct: lot.noOfProduct ? lot.noOfProduct : 0,
            noOfCase: lot.noOfCase ? lot.noOfCase : 0,
            costPrice: lotOfReturnObj.costPrice,
            wholesalePrice: lotOfReturnObj.wholesalePrice,
            retailPrice: lotOfReturnObj.retailPrice,
            qtyPerCase: lotOfReturnObj.qtyPerCase,
            mrp: lotOfReturnObj.mrp,
            expiryDate: lotOfReturnObj.expiryDate,
            barcodeNo: lotOfReturnObj.barcodeNo,
            barCode: lotOfReturnObj.barCode,
            // track: `Return No ${facility.shortName + facility.returnNo
            //   } return to
            // ${supplier.name}`,
          };

          lotArray.push(lotObj);
        }
        let obj = {
          product: product.productId,
          reqNoOfCase: productOfReturnObj.reqNoOfCase,
          reqNoOfProduct: productOfReturnObj.reqNoOfProduct,
          acpNoOfCase: product.acpNoOfCase ? product.acpNoOfCase : 0,
          acpNoOfProduct: product.acpNoOfProduct ? product.acpNoOfProduct : 0,
          lotArray: lotArray,
        };
        products.push(obj);
      }
      let notAccepted = acceptanceCheckProducts.filter((x) =>
        x.lotArray.find((y) => y.noOfCase + y.noOfProduct > 0)
      );
      if (notAccepted.length > 0) {
        updateRequestersLot(notAccepted, returnObj.facility);
      }
      resolve(products);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const updateRequestersLot = async (notAcceptedProducts, facility) => {
  try {
    fetchInventoryByQuery({
      facility: facility,
      product: { $in: notAcceptedProducts.map((x) => x.product) },
    })
      .then((result) => {
        let response = JSON.parse(JSON.stringify(result));
        response.map((x) => {
          let inTransit = x.inTransit;
          let notAcceptedProduct = notAcceptedProducts.find(
            (x) => x.product === x.product
          );
          let products = x.products;
          for (
            let index = 0;
            index < notAcceptedProduct.lotArray.length;
            index++
          ) {
            const element = notAcceptedProduct.lotArray[index];
            delete element["_id"];
            let existingLotIndex = products.findIndex(
              (x) => x.lotId === element.lotId && x.id === element.id
            );
            if (existingLotIndex > -1) {
              let existingLot = products[existingLotIndex];
              existingLot.noOfCase += element.noOfCase;
              existingLot.noOfProduct += element.noOfProduct;
              inTransit -=
                element.qtyPerCase * element.noOfCase + element.noOfProduct;
            } else {
              products.push(element);
              inTransit -=
                element.qtyPerCase * element.noOfCase + element.noOfProduct;
            }
          }
          Inventory.findByIdAndUpdate(x._id, {
            $set: { inTransit: inTransit, products: products },
          }).exec();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (e) {
    console.error(e);
  }
};

exports.assignVehicle = async (req, res) => {
  try {
    let body = req.body;
    assignVehicleValidateForReturn(body)
      .then((result) => findOne(body))
      .then((result) =>
        updateReturnDocByQuery(body.returnId, {
          $set: {
            vehicle: body.vehicle,
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

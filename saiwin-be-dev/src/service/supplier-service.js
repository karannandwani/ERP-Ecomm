const Supplier = require("../models/supplier");
const mongoose = require("mongoose");
const {
  bodyToSupplierObject,
  bodyToSupplierFilterObject,
} = require("../utils/conversion-util");
const { fetchBusinessById } = require("./business-service");
const { supplierEvent } = require("../utils/event-util");
let fetchFacilityByQuery = null;
const { addSupplierValidate } = require("../utils/validate-request");

exports.initSupplier = () => {
  console.log("Supplier service init!");
};

exports.create = async (req, res) => {
  try {
    let body = req.body;
    addSupplierValidate(body)
      .then((result) => validateFacility(body.facility, body._id))
      .then((result) =>
        body._id
          ? result
          : { ...result, business: fetchBusinessById(body.business) }
      )
      .then((result) => bodyToSupplierObject(body, result))
      .then((result) => (body._id ? update(body, result) : create(result)))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let supplier = Supplier(obj);
      supplier.save((error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          supplierEvent.emit("create", response);
          Supplier.populate(response, [{ path: "facility" }], (err, resp) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            if (resp) {
              resolve(resp);
            }
          });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const update = async (body, obj) =>
  new Promise((resolve, reject) => {
    try {
      let previousFacility;
      this.findSupplierById(body._id)
        .then((result) => {
          previousFacility = JSON.parse(JSON.stringify(result)).facility;
          Supplier.findByIdAndUpdate(
            body._id,
            { $set: obj },
            { new: true, runValidators: true }
          )
            .populate([{ path: "facility" }])
            .then(
              (response) => {
                supplierEvent.emit("update", {
                  previousFacility: previousFacility,
                  newFacility: response.facility ? response.facility._id : null,
                  supplier: response,
                });
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
      console.error(e);
      reject(e);
    }
  });

exports.fetchSupplier = async (req, res) => {
  try {
    bodyToSupplierFilterObject(req.query)
      .then((result) => this.findSuppliersByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.supplierByIds = async (req, res) => {
  try {
    let ids = req.body.facilityIds.map((t) => mongoose.Types.ObjectId(t));
    Supplier.find(
      {
        _id: {
          $in: ids,
        },
      },
      {
        _id: 1,
        name: 1,
      },
      (err_supplier, res_supplier) => {
        if (err_supplier) {
          console.error(err_supplier);
          return res.status(500).json(err_supplier);
        }

        if (res_supplier) {
          return res.status(200).json(res_supplier);
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findSupplierById = async (sId) =>
  new Promise((resolve, reject) => {
    try {
      Supplier.findById(sId, (err, res) => {
        if (err) {
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: "No supplier found!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.findSuppliersByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Supplier.find(queryObj.query, queryObj.project, queryObj.size)
        .populate(queryObj.populate)
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
      reject(e);
    }
  });

const validateFacility = async (facility, supplierId) =>
  new Promise((resolve, reject) => {
    try {
      if (facility) {
        if (!fetchFacilityByQuery)
          fetchFacilityByQuery =
            require("./facility-service").fetchFacilityByQuery;
        fetchFacilityByQuery({ _id: facility })
          .then((result) => {
            if (result.suppliers && result.suppliers.length > 0) {
              if (
                result.suppliers
                  .map((x) => x._id.toString())
                  .includes(supplierId)
              ) {
                reject({
                  message:
                    "You cannot choose a facility which already ascociated with this supplier!",
                });
              } else {
                resolve(result);
              }
            } else {
              reject({
                message:
                  "You cannot assign a facility which do not have a supplier.",
              });
            }
          })
          .catch((error) => reject(error));
      } else {
        resolve();
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.findOneSupplier = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Supplier.findOne(
        {
          facility: mongoose.Types.ObjectId(query),
        },
        (err_sup, res_sup) => {
          if (err_sup) {
            reject(err_sup);
          }
          resolve(res_sup);
        }
      );
    } catch (e) {
      reject(e);
    }
  });

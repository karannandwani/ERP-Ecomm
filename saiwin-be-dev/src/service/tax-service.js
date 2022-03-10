const HSN = require("../models/hsn");
const Tax = require("../models/tax");
const {
  bodyToTaxObject,
  queryToTaxFilterObject,
} = require("../utils/conversion-util");
const { taxEvent } = require("../utils/event-util");
const { addTaxValidate } = require("../utils/validate-request");

var fetchOneHsnByQuery = null;

exports.create = async (req, res) => {
  try {
    if (!fetchOneHsnByQuery) {
      fetchOneHsnByQuery = require("./hsn-service").fetchOneHsnByQuery;
    }
    addTaxValidate(req.body)
      .then((result) => bodyToTaxObject(req.body))
      .then((result) =>
        req.body._id ? update(result, req.body) : create(result)
      )
      .then((result) =>
        result.hsn
          ? fetchOneHsnByQuery({ _id: result.hsn }, [{ path: "tax" }])
          : result
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let tax = Tax(obj);
      tax.save((error, response) => {
        if (error) {
          reject(error);
        }
        if (response) {
          taxEvent.emit("create", {
            hsn: response.hsn,
            tax: response._id,
          });
          resolve(response);
        } else {
          reject({ message: "Unable to save" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

taxEvent.on("create", (data) => {
  try {
    if (data.hsn) updateHsnTaxArray(data.hsn, [data.tax]);
  } catch (e) {
    console.error(e);
  }
});

const update = async (obj, body) =>
  new Promise((resolve, reject) => {
    try {
      Tax.findByIdAndUpdate(
        body._id,
        { $set: obj },
        { new: true },
        (error, response) => {
          if (error) {
            reject(error);
          }
          if (response) {
            resolve(response);
          } else {
            reject({ message: "Unable to save" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.fetch = async (req, res) => {
  try {
    queryToTaxFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchUpdated = async (req, res) => {
  try {
    queryToTaxFilterObject(req.body)
      .then((result) => findByQuery(result))
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Tax.find(query, (err, resp) => {
        if (err) {
          reject(err);
        }
        resolve(resp);
      });
    } catch (e) {
      reject(e);
    }
  });

const updateHsnTaxArray = async (hsn, tax) =>
  new Promise((resolve, reject) => {
    try {
      HSN.findByIdAndUpdate(hsn, { $push: { tax: tax } }, { new: true })
        .populate("tax")
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject({ message: "Unable to update hsn" });
            }
          },
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

exports.addInitTax = async (percentage, hsn) =>
  new Promise((resolve, reject) => {
    try {
      addMultipleTax(percentage, hsn)
        .then((result) =>
          updateHsnTaxArray(
            hsn,
            result.map((x) => x._id)
          )
        )
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    } catch (e) {
      reject();
    }
  });

const addMultipleTax = async (percentage, hsn) =>
  new Promise((resolve, reject) => {
    let taxArray = [
      {
        name: "CGST",
        percentage: percentage / 2,
        hsn: hsn,
        business: hsn.business,
      },
      {
        name: "SGST",
        percentage: percentage / 2,
        hsn: hsn,
        business: hsn.business,
      },
      {
        name: "IGST",
        percentage: percentage,
        hsn: hsn,
        business: hsn.business,
      },
    ];
    Tax.insertMany(taxArray, (err, res) => {
      if (err) {
        reject(err);
      }
      if (res) {
        resolve(res);
      } else {
        reject({ message: "Unable to save" });
      }
    });
  });

exports.findOneTaxById = async (tId) =>
  new Promise((resolve, reject) => {
    try {
      if (tId) {
        Tax.findById(tId, (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response) {
            resolve(response);
          } else {
            console.error("No tax available!");
            reject({ message: "No tax available!" });
          }
        });
      } else {
        resolve();
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.findTaxByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Tax.find(query, (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(JSON.parse(JSON.stringify(response)));
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

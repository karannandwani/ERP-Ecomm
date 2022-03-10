var HSN = require("../models/hsn");
var Business = require("../models/business");
const {
  bodyToHsnObject,
  escapeRegex,
  bodyToMultipleHsn,
  bodyToHsnFetchObject,
} = require("../utils/conversion-util");
const { fetchBusinessById } = require("./business-service");
const { addInitTax } = require("./tax-service");
const hsn = require("../models/hsn");
const { addHsnValidate } = require("../utils/validate-request");
const { hsnEvent } = require("../utils/event-util");

exports.create = async (req, res) => {
  try {
    addHsnValidate(req.body)
      .then((result) => fetchBusinessById(req.body.business))
      .then(() => bodyToHsnObject(req.body))
      .then((result) =>
        req.body._id ? update(req.body, result) : create(result)
      )
      .then((result) =>
        req.body._id ? result : addInitTax(req.body.percentage, result._id)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        if (error.code === 11000) {
          error.message = "Deplicate Entry!";
        }
        console.error(error);
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
      let hsn = HSN(obj);
      hsn.save((err, res) => {
        if (err) {
          let error = JSON.parse(JSON.stringify(err));
          if (error.code === 11000) {
            error.message = "Duplicate entry";
          }
          reject(error);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: "Unable to save!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

const update = async (body, obj) =>
  new Promise((resolve, reject) => {
    try {
      HSN.findByIdAndUpdate(
        body._id,
        { $set: obj },
        { new: true },
        (err, res) => {
          if (err) {
            let error = JSON.parse(JSON.stringify(err));
            if (error.code === 11000) {
              error.message = "Duplicate entry";
            }
            reject(error);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Unable to update!" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
exports.fetch = async (req, res) => {
  try {
    if (!req.query.business) {
      return res.status(500).json({
        message: "Provide business Id",
      });
    }

    let findObj = new Object();

    if (req.query.business) {
      findObj.business = req.query.business;
    }
    findObj.hsn = new RegExp(
      escapeRegex(req.query.hsn ? req.query.hsn : ""),
      "gi"
    );
    let limit = 1000;
    let skip = 0;
    if (req.query.pageNo && req.query.pageSize) {
      limit = Number(req.query.pageSize);
      skip = Number(req.query.pageSize) * Number(req.query.pageNo);
    }
    this.fetcHsn(findObj, null, {
      skip: skip,
      limit: limit,
    }).then(
      (result) => {
        let response = JSON.parse(JSON.stringify(result));
        response.forEach((x) => (x.show = false));
        return res.status(200).json(response);
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

exports.fetchUpdated = async (req, res) => {
  try {
    bodyToHsnFetchObject(req.body)
      .then((result) => this.fetcHsn(result.query, null, result.size))
      .then(
        (result) => {
          let response = JSON.parse(JSON.stringify(result));
          response.forEach((x) => (x.show = false));
          return res.status(200).json(response);
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

exports.fetcHsnhByQuery = async (query, project, size) =>
  new Promise((resolve, reject) => {
    try {
      HSN.find(query, project, size)
        .populate("tax")
        .then(
          (result) => resolve(JSON.parse(JSON.stringify(result))),
          (error) => {
            reject(error);
          }
        );
    } catch (e) {
      reject(e);
    }
  });

exports.fetcHsn = async (query, project, size) =>
  new Promise((resolve, reject) => {
    try {
      HSN.find(
        {
          $and: [
            {
              $or: [{ hsn: query.hsn }, { hsnDescription: query.hsn }],
            },
            {
              business: query.business,
            },
          ],
        },
        project,
        size
      )
        .populate("tax")
        .then(
          (result) => resolve(JSON.parse(JSON.stringify(result))),
          (error) => {
            reject(error);
          }
        );
    } catch (e) {
      reject(e);
    }
  });

exports.fetchOneHsnByQuery = async (query, populate) =>
  new Promise((resolve, reject) => {
    try {
      HSN.findOne(query)
        .populate(populate)
        .then(
          (res) => {
            resolve(res);
          },
          (err) => {
            console.error(err);
            reject(err);
          }
        );
    } catch (e) {
      reject(e);
    }
  });

exports.hsnExists = async (hsnId) =>
  new Promise((resolve, reject) => {
    try {
      HSN.exists({ _id: hsnId }, (err, res) => {
        if (err) {
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: "No hsn found!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.findHsn = async (query) =>
  new Promise((resolve, reject) => {
    try {
      HSN.find(query, (err, res) => {
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

exports.createMultipleHsn = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      bodyToMultipleHsn(obj, business).then((result) => {
        HSN.insertMany(result, (err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
            hsnEvent.emit("new-created", {
              business: business,
            });
          } else {
            reject({ message: "Unable to create!" });
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });

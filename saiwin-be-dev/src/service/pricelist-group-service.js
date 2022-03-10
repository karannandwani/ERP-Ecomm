var PricelistGroup = require("../models/pricelist-group");
const {
  bodyToPricelistObject,
  bodyToPricelistFilterObject,
  bodyToMultiplePricelist,
} = require("../utils/conversion-util");
const { fetchBusinessById } = require("./business-service");
const { addPriceListValidate } = require("../utils/validate-request");
const { pricelistEvent } = require("../utils/event-util");

exports.create = async (req, res) => {
  try {
    let body = req.body;
    addPriceListValidate(body)
      .then((result) => fetchBusinessById(body.business))
      .then(() => bodyToPricelistObject(body))
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
      PricelistGroup.findByIdAndUpdate(
        body._id,
        { $set: obj },
        { new: true },
        (err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
          } else {
            reject({ message: "Unable to create!" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let pricelist = PricelistGroup(obj);
      pricelist.save((err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          resolve(resp);
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.findPriceList = async (req, res) => {
  try {
    bodyToPricelistFilterObject(req.query)
      .then((result) => this.findPricelistByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findPriceListUpdated = async (req, res) => {
  try {
    bodyToPricelistFilterObject(req.body)
      .then((result) => this.findPricelistByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.changePricelistGroupStatus = async (req, res) => {
  try {
    PricelistGroup.findByIdAndUpdate(
      req.params.groupId,
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
            message: "Unable to process",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.pricelistExists = async (pricelistId) =>
  new Promise((resolve, reject) => {
    try {
      PricelistGroup.exists(
        {
          _id: pricelistId,
        },
        (err, res) => {
          if (err) {
            return res.status(500).json(err);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Provide a valid Pricelist Group" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.findPricelistByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      PricelistGroup.find(query.query, null, query.size, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

exports.createMultiplePricelist = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      bodyToMultiplePricelist(obj, business).then((result) => {
        PricelistGroup.insertMany(result, (err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
            pricelistEvent.emit("new-created", {
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

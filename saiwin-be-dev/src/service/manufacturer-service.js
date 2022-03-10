var Manufacturer = require("../models/manufacturer");
const { fetchBusinessById } = require("./business-service");
const {
  bodyToManufacturerObject,
  bodyToManufacturerFilterObject,
  bodyToMultipleManufacturer,
} = require("../utils/conversion-util");
const { addManufacturerValidate } = require("../utils/validate-request");
const { keywordEvent, manufacturerEvent } = require("../utils/event-util");
const { resizeImage } = require("./image-service");

exports.create = async (req, res) => {
  try {
    let body = req.body,
      image;
    addManufacturerValidate(body)
      .then((result) => fetchBusinessById(body.business))
      .then(() => resizeImage(body.image))
      .then((result) => {
        image = result;
        return bodyToManufacturerObject(body);
      })
      .then((result) =>
        body._id
          ? update({ ...result, image: image }, body)
          : create({ ...result, image: image })
      )
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
      Manufacturer.findByIdAndUpdate(
        body._id,
        { $set: obj },
        { new: true },
        (err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
            let obj = {
              business: resp.business,
              type: "Manufacturer",
              itemId: resp._id,
              itemName: resp.name,
            };
            keywordEvent.emit("create", obj);
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
      let manufacturer = Manufacturer(obj);
      manufacturer.save((err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          resolve(resp);
          let obj = {
            business: resp.business,
            type: "Manufacturer",
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

exports.findManufacturers = async (req, res) => {
  try {
    bodyToManufacturerFilterObject(req.query)
      .then((result) => this.findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findManufacturersUpdated = async (req, res) => {
  try {
    bodyToManufacturerFilterObject(req.body)
      .then((result) => this.findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.changeManufacturerStatus = async (req, res) => {
  try {
    Manufacturer.findByIdAndUpdate(
      req.params.manufacturerId,
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

exports.manufacturerExists = async (manufacturerId) =>
  new Promise((resolve, reject) => {
    try {
      Manufacturer.exists(
        {
          _id: manufacturerId,
        },
        (err, res) => {
          if (err) {
            return res.status(500).json(err);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Provide a valid manufacturer" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Manufacturer.find(query.query, query.project, query.size, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

exports.createMultipleManufacturer = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      bodyToMultipleManufacturer(obj, business).then((result) => {
        Manufacturer.insertMany(result, (err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
            manufacturerEvent.emit("new-created", {
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

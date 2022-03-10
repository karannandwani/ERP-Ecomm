var Vehicle = require("../models/vehicle");
var mongoose = require("mongoose");
const { fetchBusinessById } = require("./business-service");
const {
  bodyToVehicleObject,
  bodyToVehicleFilterObject,
} = require("../utils/conversion-util");
const { facilityExists } = require("./facility-service");
const { addVehicleValidate } = require("../utils/validate-request");

exports.create = async (req, res) => {
  try {
    let body = req.body;
    addVehicleValidate(body)
      .then((result) => fetchBusinessById(body.business))
      .then(() => facilityExists(body.facility))
      .then(() => bodyToVehicleObject(body))
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
      Vehicle.findByIdAndUpdate(
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
      let vehicle = Vehicle(obj);
      vehicle.save((err, resp) => {
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

exports.findvehicles = async (req, res) => {
  try {
    bodyToVehicleFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findvehiclesNew = async (req, res) => {
  try {
    bodyToVehicleFilterObject(req.body)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.changeVehicleStatus = async (req, res) => {
  try {
    Vehicle.findByIdAndUpdate(
      req.params.vehicleId,
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
const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Vehicle.find(query.query, null, query.size, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

exports.findOne = async (body) =>
  new Promise((resolve, reject) => {
    Vehicle.findOne(
      {
        _id: body.vehicle,
        facility: body.facility,
      },
      (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({
            message: "No vehicle avail for this facility",
          });
        }
      }
    );
  });

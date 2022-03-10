var Beat = require("../models/beat");
const { fetchBusinessById } = require("./business-service");
const {
  bodyToBeatObject,
  bodyToBeatFilterObject,
} = require("../utils/conversion-util");
const { addBeatValidate } = require("../utils/validate-request");

exports.create = async (req, res) => {
  try {
    let body = req.body;
    addBeatValidate(body)
      .then((result) => fetchBusinessById(body.business))
      .then(() => bodyToBeatObject(body))
      .then((result) =>
        body._id ? update({ $set: result }, body._id) : create(result)
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

const update = async (query, beatId) =>
  new Promise((resolve, reject) => {
    try {
      Beat.findByIdAndUpdate(beatId, query, { new: true }, (err, resp) => {
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

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let beat = Beat(obj);
      beat.save((err, resp) => {
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

exports.findBeats = async (req, res) => {
  try {
    bodyToBeatFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.changeBeatStatus = async (req, res) => {
  try {
    update(
      {
        $set: {
          active: req.params.status,
        },
      },
      req.params.beatId
    )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Beat.find(query.query, null, query.size, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

exports.fetchBeatByLocation = async (req, res) => {
  try {
    Beat.findOne(
      {
        location: {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: [
                req.body.coordinates.longitude,
                req.body.coordinates.latitude,
              ],
            },
          },
        },
        business: req.body.business,
      },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        if (response) {
          return res.status(200).json(response);
        } else {
          return res
            .status(500)
            .json({ message: "No area available here for delivery services." });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findById = async (beatId, populate) =>
  new Promise((resolve, reject) => {
    try {
      Beat.findById(beatId)
        .populate(populate)
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject({ message: "No Beat found!" });
            }
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

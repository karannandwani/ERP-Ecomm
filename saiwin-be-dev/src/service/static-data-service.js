var StaticData = require("../models/static-data");
const { bodyToStaticData } = require("../utils/conversion-util");

exports.createOrUpdate = async (req, res) => {
  try {
    bodyToStaticData(req.body)
      .then((result) =>
        req.body._id ? update(req.body, result) : create(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let staticData = StaticData(obj);
      staticData.save((err, res) => {
        if (err) {
          reject(err);
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
      StaticData.findByIdAndUpdate(body._id, { $set: obj }, { new: true }).then(
        (response) => {
          resolve(response);
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

exports.fetch = async (req, res) => {
  try {
    StaticData.find({ business: req.body.business }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      return res.status(200).json(response);
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchByKey = async (req, res) => {
  try {
    StaticData.findOne(
      { business: req.body.business, key: req.body.key },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        return res.status(200).json(response);
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

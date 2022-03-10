var State = require("../models/state");
const {
  bodyToStateObject,
  queryToStateFilterObj,
} = require("../utils/conversion-util");
const { addStateValidate } = require("../utils/validate-request");

exports.createOrUpdate = async (req, res) => {
  try {
    addStateValidate(req.body)
      .then((result) => bodyToStateObject(req.body))
      .then((result) =>
        req.body._id ? update(req.body, result) : create(result)
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

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let state = State(obj);
      state.save((err, res) => {
        if (err) {
          reject(err);
        }
        if (res) {
          State.populate(res, [{ path: "country" }], (error, response) => {
            if (error) {
              console.error(error);
              reject(error);
            }
            if (response) {
              resolve(response);
            }
          });
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
      State.findByIdAndUpdate(body._id, { $set: obj }, { new: true })
        .populate([{ path: "country" }])
        .then(
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
    queryToStateFilterObj(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        console.error(error);
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      State.find(queryObj.query, queryObj.project, queryObj.size)
        .populate(queryObj.populate)
        .then(
          (result) => resolve(result),
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

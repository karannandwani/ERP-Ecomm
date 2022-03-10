var EffectVariable = require("../models/effect-variable");
const {
  bodyToEffectRequest,
  bodyToEffectVariableFindObject,
} = require("../utils/conversion-util");

exports.create = async (req, res) => {
  try {
    bodyToEffectRequest(req.body)
      .then((result) =>
        req.body._id ? update(req.body._id, result) : create(result)
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
      let effect = EffectVariable(obj);
      effect.save((error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          resolve(response);
        } else {
          reject({ message: "Unable to save!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const update = async (effectId, obj) =>
  new Promise((resolve, reject) => {
    try {
      EffectVariable.findByIdAndUpdate(
        effectId,
        { $set: obj },
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response) {
            resolve(response);
          } else {
            reject({ message: "Unable to update!" });
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.fetch = async (req, res) => {
  try {
    bodyToEffectVariableFindObject(req.query)
      .then((result) => fetchEffectVariables(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const fetchEffectVariables = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      EffectVariable.find(obj.query, null, {
        skip: obj.skip,
        limit: obj.limit,
      }).then(
        (response) => resolve(response),
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

exports.findById = async (req, res) => {};

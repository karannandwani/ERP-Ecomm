const mongoose = require("mongoose");
var Target = require("../models/target");

const {
  bodyToTargetObject,
  bodyToTargetFilterObject,
} = require("../utils/conversion-util");
exports.createTarget = async (req, res) => {
  try {
    let dbTarget;
    create(req.body)
      .then((result) => {
        if (result.length > 0) {
          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            dbTarget = element.target;
            for (let index = 0; index < req.body.target.length; index++) {
              let t = req.body.target[index];
              let year = dbTarget.find((y) => y.year === t.year);
              if (year) {
                let dbMonth = year.monthTarget;
                for (let index = 0; index < t.monthTarget.length; index++) {
                  let month = t.monthTarget[index];
                  let monthIndex = year.monthTarget.findIndex(
                    (m) => m.month === month.month
                  );
                  if (monthIndex > -1) {
                    dbMonth[monthIndex] = month;
                  } else {
                    dbMonth.push(month);
                  }
                }
              } else {
                dbTarget.push(t);
              }
            }
          }
          return saveTarget(req.body, dbTarget);
        } else {
          return saveTarget(req.body);
        }
      })
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};
const saveTarget = async (body, target) =>
  new Promise((resolve, reject) => {
    try {
      Target.findOneAndUpdate(
        {
          salesPerson: body.salesPerson,
          business: body.business,
        },
        {
          $set: {
            target: target ? target : body.target,
          },
        },
        { upsert: true },
        (err, res) => {
          if (err) {
            console.error(err);
          }
          if (res) {
            resolve(res);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      Target.find(
        {
          salesPerson: obj.salesPerson,
          business: obj.business,
        },

        (err, res) => {
          if (err) {
            console.error(err);
          }
          if (res) {
            resolve(res);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.targetFetchBySalesPerson = async (req, res) => {
  try {
    bodyToTargetFilterObject(req.query)
      .then((result) => findByQuery(result))
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
      Target.find(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

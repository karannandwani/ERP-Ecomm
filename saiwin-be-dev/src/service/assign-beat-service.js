var AssignBeat = require("../models/assign-beat");
var Role = require("../models/role");
const { fetchRoleByName } = require("./role-service");

exports.createAssignBeat = async (req, res) => {
  try {
    let body = req.body;
    let queryObj = new Object();
    if (body.salesPerson && queryObj.business) {
      queryObj.salesPerson = body.salesPerson;
      queryObj.business = body.business;
    }
    AssignBeat.findOneAndUpdate(
      { salesPerson: body.salesPerson, business: body.business },
      { $set: { beatDateList: body.beatDateList } },
      { upsert: true, new: true },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        if (response) {
          return res.status(200).json(response);
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.fetchAssignBeatList = async (req, res) => {
  try {
    let findObj = new Object();
    if (req.query.business) {
      findObj.business = req.query.business;
    }
    fetchRoleByName("Salesmanager")
      .then((result) => {
        if (
          result &&
          !req.user.businessRoleMap
            .find((x) => x.business.toString() === req.query.business)
            .roles.includes(result._id)
        ) {
          findObj.salesPerson = req.user._id;
        }
        return findObj;
      })
      .then((result) => fetchAssignedBeats(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const fetchAssignedBeats = (filterObj) =>
  new Promise((resolve, reject) => {
    try {
      AssignBeat.find(filterObj)
        .populate([
          {
            path: "salesPerson",
            select: {
              password: 0,
            },
          },
          { path: "beatDateList.beat" },
        ])
        .then(
          (result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    } catch (e) {
      reject(e);
    }
  });

exports.assigBeatDateListDetail = async (req, res) => {
  try {
    AssignBeat.findOne(
      {
        business: req.query.business,
        salesPerson: req.query.salesPerson,
      },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }

        if (response) {
          return res.status(200).json(response);
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

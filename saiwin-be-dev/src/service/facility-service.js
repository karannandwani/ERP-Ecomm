var Facility = require("../models/facility");
var FacilityMap = require("../models/facility-user-mapping");
const {
  bodyToFacilityObject,
  queryToFilterObj,
} = require("../utils/conversion-util");
var findSuppliersByQuery = null;
var fetchBusinessById = null;
const {
  supplierEvent,
  facilityEvent,
  businessEvent,
  ecommerceEvent,
} = require("../utils/event-util");
const { createReason } = require("./stock-mismatch-reason-service");
exports.initFacility = () => {};
const {
  addFacilityValidate,
  validateFacilityFetchByLocation,
} = require("../utils/validate-request");
const mongoose = require("mongoose");

exports.createOrUpdate = async (req, res) => {
  try {
    let body = req.body;
    if (!fetchBusinessById) {
      fetchBusinessById = require("./business-service").fetchBusinessById;
    }
    addFacilityValidate(body)
      .then((result) => validateSuppliers(body.suppliers, body._id))
      .then((result) => validateAreasWithPriority(body))
      .then((result) => (body._id ? result : fetchBusinessById(body.business)))
      .then((result) => bodyToFacilityObject(body))
      .then((result) => (body._id ? update(body, result) : create(result)))
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
      let facility = Facility(obj);
      facility.save((error, response) => {
        if (error) {
          reject(error);
        }
        if (response) {
          facilityEvent.emit("create", response);
          Facility.populate(response, [
            { path: "country" },
            { path: "state" },
            { path: "suppliers" },
            { path: "areas.area" },
          ]).then(
            (result) => resolve(result),
            (err) => {
              console.error(err);
              reject(err);
            }
          );
        } else {
          reject({ message: "Unable to save" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

const update = async (body, obj) =>
  new Promise((resolve, reject) => {
    try {
      Facility.findByIdAndUpdate(body._id, { $set: obj }, { new: true })
        .populate([
          { path: "country" },
          { path: "state" },
          { path: "suppliers" },
          { path: "areas.area" },
        ])
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

exports.facilityList = async (req, res) => {
  try {
    queryToFilterObj(req.query)
      .then((result) => this.findFacilityByQuery(result))
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

exports.findFacilityByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Facility.find(queryObj.query, queryObj.project, queryObj.size)
        .populate(queryObj.populate)
        .then(
          (result) => resolve(result),
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

exports.changeFacilityStatus = async (req, res) => {
  try {
    Facility.findByIdAndUpdate(
      req.params.facilityId,
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

exports.findFacilityOfLoggedInUser = async (req, res) => {
  try {
    this.findFacilitiesOfUser(req.user._id)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findFacilitiesOfUser = async (userId) =>
  new Promise((resolve, reject) => {
    try {
      FacilityMap.find({
        user: userId,
      })
        .populate({ path: "facility", populate: { path: "suppliers" } })
        .then(
          (result) => {
            resolve(result);
          },
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

exports.fetchFacilityByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Facility.findOne(query)
        .populate({ path: "suppliers" })
        .then(
          (result) => {
            resolve(result);
          },
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

exports.fetchSuppliersFacilityByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Facility.findOne(query, (err_wh, res_wh) => {
        if (err_wh) {
          reject({ message: "Error in facility check" });
        }

        resolve(res_wh);
      });
    } catch (e) {
      reject(e);
    }
  });

supplierEvent.on("update", (data) => {
  try {
    if (
      data.previousFacility &&
      data.previousFacility !== (data.newFacility ? data.newFacility._id : null)
    ) {
      Facility.findByIdAndUpdate(data.previousFacility, {
        $unset: {
          supplierDoc: 1,
        },
      }).exec();
    }
    if (data.newFacility) {
      update({ _id: data.newFacility._id }, { supplierDoc: data.supplier._id });
    }
  } catch (e) {
    console.error(e);
  }
});

supplierEvent.on("create", (data) => {
  try {
    if (data.facility) {
      update({ _id: data.facility }, { supplierDoc: data._id });
    }
  } catch (e) {
    console.error(e);
  }
});

const validateSuppliers = async (suppliers, facilityId) =>
  new Promise((resolve, reject) => {
    try {
      if (!findSuppliersByQuery) {
        findSuppliersByQuery =
          require("./supplier-service").findSuppliersByQuery;
      }
      if (suppliers && suppliers.length > 0) {
        findSuppliersByQuery({
          query: { _id: { $in: suppliers } },
          project: { _id: 1, facility: 1 },
        }).then((result) => {
          if (result.length !== suppliers.length) {
            reject({ message: "Invalid suppliers" });
          } else if (
            result
              .filter((x) => x.facility)
              .map((x) => x.facility.toString())
              .includes(facilityId)
          ) {
            reject({
              message:
                "You cannot add the supplier, which is already ascociated with the given facility!",
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });

const validateAreasWithPriority = async (body) =>
  new Promise((resolve, reject) => {
    if (body.areas && body.areas.length > 0) {
      this.findFacilityByQuery({
        query: {
          $and: [
            { _id: { $ne: body._id } },
            {
              $or: body.areas.map((x) => ({
                areas: {
                  $elemMatch: {
                    area: mongoose.Types.ObjectId(x.area),
                    priority: x.priority,
                  },
                },
              })),
            },
          ],
        },
        populate: [{ path: "areas.area" }],
        project: { areas: 1, name: 1 },
      }).then((result) => {
        if (result && result.length > 0) {
          reject({
            message: `Unable to assign areas with given priorities as other facility having same priorities. ${result.map(
              (x) =>
                "\nFor " +
                x.name +
                x.areas
                  .filter((z) =>
                    body.areas
                      .map((a) => a.area)
                      .includes(z.area._id.toString())
                  )
                  .map((y) => ": " + y.priority + " - " + y.area.name)
            )}`,
          });
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(true);
    }
  });

facilityEvent.on("create", (data) => {
  try {
    createReason({ name: "Missing", facility: data._id });
    createReason({ name: "Theft", facility: data._id });
  } catch (e) {
    console.error(e);
  }
});

exports.facilityExists = async (facility) =>
  new Promise((resolve, reject) => {
    try {
      Facility.exists(
        {
          _id: facility,
        },
        (err, res) => {
          if (err) {
            return res.status(500).json(err);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Provide a valid facility" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

businessEvent.on("create-facility", (data) => {
  try {
    let obj = {
      name: "Master Warehouse",
      active: true,
      address: data.business.address,
      business: data.business._id,
      suppliers: null,
      type: "Warehouse",
      shortName: "MSTWH",
      country: data.business.country,
      state: data.business.state,
      billNo: 1,
      returnNo: 1,
    };
    create(obj).then((result) => {
      facilityEvent.emit("created", {
        facility: result,
        business: data.business._id,
        user: data.user,
      });
    });
  } catch (e) {
    console.error(e);
  }
});

exports.fetchFacilityByLocation = async (body) =>
  new Promise((resolve, reject) => {
    if (body.location && body.location.latitude && body.location.longitude)
      Facility.aggregate(
        [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [body.location.latitude, body.location.longitude],
              },
              distanceField: "distance",
              distanceMultiplier: 0.001,
              spherical: true,
              query: {
                business: body.business,
              },
            },
          },
          {
            $project: {
              distance: 1,
              name: 1,
              address: 1,
              type: 1,
              country: 1,
              state: 1,
            },
          },
          {
            $sort: {
              distance: 1,
            },
          },
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response && response.length > 0) {
            resolve(response[0]);
          } else {
            reject({ message: "No nearby SaiWin store found!" });
          }
        }
      );
    else resolve(null);
  });

exports.fetchFacilityForEcom = async (req, res) => {
  try {
    validateFacilityFetchByLocation(req.body)
      .then((result) => this.fetchFacilityByPoint(req.body))
      .then((result) => res.status(200).json(result[0]))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    reject(e);
  }
};

exports.fetchFacilityByPoint = async (body) =>
  new Promise((resolve, reject) => {
    try {
      Facility.aggregate(
        [
          {
            $unwind: "$areas",
          },
          {
            $lookup: {
              from: "beats",
              localField: "areas.area",
              foreignField: "_id",
              as: "areas.area",
            },
          },
          {
            $unwind: "$areas.area",
          },
          {
            $match: {
              "areas.area._id": mongoose.Types.ObjectId(body.beat),
            },
          },
          {
            $group: {
              _id: "$_id",
              name: {
                $first: "$name",
              },
              priority: {
                $first: "$areas.priority",
              },
              shortName: {
                $first: "$shortName",
              },
              billNo: {
                $first: "$billNo",
              },
            },
          },
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (response) {
            resolve(response.sort((a, b) => a.priority - b.priority));
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

ecommerceEvent.on("order-place", (data) => {
  Facility.findByIdAndUpdate(data.suppliers, {
    $inc: {
      billNo: 1,
    },
  }).exec();
});

exports.fetchFacilityByBeat = async (req, res) => {
  try {
    this.fetchFacilityByPoint(req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    reject(e);
  }
};

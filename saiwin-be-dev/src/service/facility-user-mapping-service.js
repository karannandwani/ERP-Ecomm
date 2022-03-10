const FacilityUserMap = require("../models/facility-user-mapping");
const User = require("../models/user");
const { fetchFacilityByQuery } = require("./facility-service");
const { findUserById } = require("./user-service");
const { fetchRoleByName } = require("./role-service");
const mongoose = require("mongoose");
const { facilityMappingEvent, facilityEvent } = require("../utils/event-util");

exports.initFacilityUserMapping = () => {
  console.log("Facility User Map service init!");
};

exports.add = async (req, res) => {
  let body = req.body;
  try {
    let facility;
    fetchFacilityByQuery({ _id: body.facility })
      .then((result) => {
        facility = result;
        return findUserById(body.user, []);
      })
      .then((result) => fetchRoleByName("Facility"))
      .then((result) => update(body, result, facility))
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const update = async (body, result, facility) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        facility: body.facility,
        user: body.user,
        business: body.business,
      };
      let warehouseMap = new FacilityUserMap(obj);
      warehouseMap.save((error, response) => {
        if (error) {
          reject(error);
        }

        if (response) {
          facilityMappingEvent.emit("assign", {
            user: body.user,
            roleId: result._id,
            business: body.business,
          });
          FacilityUserMap.populate(
            response,
            [{ path: "user" }],
            (err, resp) => {
              if (err) {
                console.error(err);
                reject(err);
              }
              if (resp) {
                resolve(resp);
              }
            }
          );
        } else {
          reject({ message: "Unable to process" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

facilityMappingEvent.on("assign", async (data) => {
  try {
    User.findOne(
      { _id: data.user, "businessRoleMap.business": data.business },
      (error, response) => {
        if (error) {
          console.error(error);
        }

        if (
          !response.businessRoleMap
            .find((x) => x.business.toString() === data.business)
            .roles.includes(data.roleId)
        ) {
          User.findOneAndUpdate(
            { _id: data.user, "businessRoleMap.business": data.business },
            {
              $set: {
                "businessRoleMap.$.roles": [
                  ...response.businessRoleMap[0].roles,
                  data.roleId,
                ],
              },
            }
          ).exec();
        }
      }
    );
  } catch (e) {
    console.error(e);
  }
});

exports.fetchByFacility = async (req, res) => {
  try {
    FacilityUserMap.find({ facility: req.params.facility })
      .populate("user")
      .then(
        (result) => {
          return res.status(200).json(result);
        },
        (reject) => {
          return res.status(500).json(reject);
        }
      );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.removeUser = async (req, res) => {
  try {
    findFacilityUserMapById(req.params.mapId)
      .then((response) => deleteFacilityUserMapById(req.params.mapId, response))
      .then((response) => {
        facilityMappingEvent.emit("remove", response);
        return res.status(200).json(response);
      })
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

facilityMappingEvent.on("remove", async (response) => {
  try {
    fetchRoleByName("Facility").then((result) => {
      FacilityUserMap.exists({ user: response.user }, (err, res) => {
        if (err) {
          console.error(err);
        }

        if (!res || res.length === 0) {
          User.findOneAndUpdate(
            {
              _id: response.user,
              "businessRoleMap.business": response.facility.business,
            },
            {
              $pull: { "businessRoleMap.$.roles": result._id },
            },
            { new: true },
            (error, resp) => {
              if (error) {
                console.error(error);
              }
              if (resp) {
                let currentBusinessMap = resp.businessRoleMap.find(
                  (x) =>
                    x.business.toString() ===
                    response.facility.business.toString()
                );
                if (currentBusinessMap.roles.length === 0) {
                  fetchRoleByName("User").then((userRole) => {
                    User.findOneAndUpdate(
                      {
                        _id: response.user,
                        "businessRoleMap.business": response.facility.business,
                      },
                      {
                        $push: { "businessRoleMap.$.roles": userRole._id },
                      }
                    ).exec();
                  });
                }
              }
            }
          );
        }
      });
    });
  } catch (e) {
    console.error(e);
  }
});

exports.updateSelected = async (req, res) => {
  try {
    FacilityUserMap.updateMany(
      { user: req.user._id },
      { $set: { selected: false } },
      { new: true },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        if (response) {
          FacilityUserMap.findOneAndUpdate(
            { user: req.user._id, facility: req.params.facility },
            { $set: { selected: true } },
            { new: true },
            (err, resp) => {
              if (err) {
                console.error(err);
                return res.status(500).json(err);
              }
              if (resp) {
                return res.status(200).json(resp);
              }
            }
          );
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findFacilityUserMapById = async (mapId) =>
  new Promise((resolve, reject) => {
    try {
      FacilityUserMap.findById(mapId)
        .populate([{ path: "facility" }])
        .then(
          (result) => resolve(result),
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

const deleteFacilityUserMapById = async (mapId, response) =>
  new Promise((resolve, reject) => {
    try {
      FacilityUserMap.findByIdAndDelete(mapId)
        .populate([{ path: "facility" }])
        .then(
          (result) => resolve(response),
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

exports.fetch = async (req, res) => {
  try {
    FacilityUserMap.find({ business: req.query.business })
      .populate("user")
      .then(
        (result) => {
          return res.status(200).json(result);
        },
        (reject) => {
          return res.status(500).json(reject);
        }
      );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

// facilityEvent.on("created", async (data) => {
//   try {
//     fetchRoleByName("Facility").then((result) => {
//       update(
//         {
//           facility: data.facility._id,
//           user: data.user._id.toString(),
//           business: data.facility.business,
//         },
//         result,
//         data.facility
//       );
//     });
//   } catch (e) {
//     console.error(e);
//   }
// });

exports.findAssignedUserByFacility = async (facility) =>
  new Promise((resolve, reject) => {
    FacilityUserMap.find({ facility: facility }).then(
      (result) => {
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });

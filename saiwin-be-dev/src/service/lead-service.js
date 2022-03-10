var Lead = require("../models/lead");
var ImageService = require("./image-service");
const { leadEvent } = require("../utils/event-util");
const { createBusiness } = require("./business-service");
const { fetchRoleByName } = require("./role-service");
const { bodyToLeadObject, bodyToComment } = require("../utils/conversion-util");
const { addLeadValidation } = require("../utils/validate-request");

exports.addLead = async (req, res) => {
  try {
    addLeadValidation(req.body)
      .then((result) => ImageService.resizeImage(req.body.storeLogo))
      .then((result) => bodyToLeadObject(req.body, result, req.user))
      .then((result) =>
        req.body._id ? update(result, req.body._id) : create(result)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const update = async (obj, leadId) =>
  new Promise((resolve, reject) => {
    try {
      Lead.findByIdAndUpdate(
        leadId,
        {
          $set: obj,
        },
        { new: true },
        (error, response) => {
          if (error) {
            reject(error);
          }
          if (response) {
            resolve(response);
          } else {
            reject({ message: "Unable to update!!!" });
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
      let newLead = Lead(obj);
      newLead.save({ validateBeforeSave: true }, (error, response) => {
        if (error) {
          reject(error);
        }
        if (response) {
          resolve(response);
        } else {
          reject({ message: "Unable to save!!!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.viewLead = async (req, res) => {
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
          findObj.user = req.user._id;
        }
        return findObj;
      })
      .then((result) => fetchLeadList(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const fetchLeadList = (filterObj) =>
  new Promise((resolve, reject) => {
    try {
      Lead.find(filterObj)
        .populate([
          {
            path: "user",
            select: { password: 0 },
          },
          {
            path: "assignTo",
            select: { password: 0 },
          },
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

exports.leadById = async (req, res) => {
  try {
    Lead.findById(req.params.leadId, async (_err, _res) => {
      if (_err) {
        console.error(_err);
        return res.status(500).json(_err);
      }
      if (_res) {
        return res.status(200).json(_res);
      } else {
        return res.status(500).json({ message: "Unable to process" });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

exports.commentInLead = async (req, res) => {
  try {
    bodyToComment(req.body)
      .then((result) => addCommentToLead(req.body, result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const addCommentToLead = async (body, obj) =>
  new Promise((resolve, reject) => {
    try {
      Lead.findByIdAndUpdate(
        { _id: body._id },
        { ...obj },
        { new: true },
        (lead_err, lead_res) => {
          if (lead_err) {
            reject(lead_err);
          }
          if (lead_res) {
            if (body.status === "Converted")
              leadEvent.emit("Converted", lead_res);
            resolve(lead_res);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

leadEvent.on("Converted", (data) => {
  let obj = {
    email: data.email,
    name: data.name,
    active: true,
  };
  createBusiness(obj);
});

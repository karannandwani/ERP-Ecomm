var MenuRoleMap = require("../models/menu-item-role-map");
var Menuitem = require("../models/menu-item");
const { findOne } = require("./menu-item-service");
const {
  bodyToMenuRoleMapObject,
  bodyMenuRoleFilterObject,
} = require("../utils/conversion-util");
const { addMenuRoleValidate } = require("../utils/validate-request");

exports.add = async (req, res) => {
  try {
    let body = req.body;
    addMenuRoleValidate(body)
      .then((result) => findOne(body.menu))
      .then(() => bodyToMenuRoleMapObject(body))
      .then((result) => create(result))
      .then((result) =>
        MenuRoleMap.populate(result, [{ path: "roleId" }, { path: "menu" }])
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        if (error.code === 11000) {
          return res.status(500).json({
            message: "Duplicate Entry!!!",
          });
        }
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let menuRole = new MenuRoleMap(body);
      menuRole.save((err, resp) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        if (resp) {
          resolve(resp);
          if (resp.parentId != null) {
            ParentMenuitem(body);
          }
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

const ParentMenuitem = async (req) => {
  try {
    MenuRoleMap.findOneAndUpdate(
      req,
      {
        $set: req,
      },
      {
        upsert: true,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        if (res) {
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

exports.fetchMenuitemRoles = async (req, res) => {
  try {
    bodyMenuRoleFilterObject(req.query)
      .then((result) => findMenuRole(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.delete = async (req, res) => {
  try {
    MenuRoleMap.findByIdAndDelete(req.params.menuId, (err, res_menu) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (res_menu) {
        return res.status(200).json(res_menu);
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findMenuRole = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      MenuRoleMap.find(queryObj.query, null, queryObj.size)
        .populate(queryObj.populate)
        .then(
          (result) => {
            let response = result.reduce((result, cv) => {
              (result[cv.roleId._id] = result[cv.roleId._id] || []).push(cv);
              return result;
            }, {});
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

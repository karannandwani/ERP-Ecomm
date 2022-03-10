var MenuItem = require("../models/menu-item");
const { bodyToMenuObject } = require("../utils/conversion-util");
exports.add = async (req, res) => {
  try {
    let body = req.body;

    bodyToMenuObject(body)
      .then((result) => (body._id ? update(result, body) : create(result)))
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

const update = async (obj, body) =>
  new Promise((resolve, reject) => {
    try {
      MenuItem.findByIdAndUpdate(
        body._id,
        { $set: obj },
        { new: true },
        (err, resp) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (resp) {
            resolve(resp);
          } else {
            reject({ message: "Unable to create!" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let menuItem = new MenuItem(obj);
      menuItem.save(
        {
          validateBeforeSave: true,
        },
        (err, resp) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (resp) {
            resolve(resp);
          } else {
            reject({ message: "Unable to create!" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
exports.delete = async (req, res) => {
  try {
    MenuItem.findOneAndDelete(req.params.menuId, (err_menu, res_menu) => {
      if (err_menu) {
        return res.status(500).json(err_menu);
      }

      if (res_menu) {
        return res.status(200).json({
          message: "Deleted",
        });
      } else {
        return res.status(500).json({
          message: "Unable to process",
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchMenuItems = async (req, res) => {
  try {
    findByQuery()
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const findByQuery = async () =>
  new Promise((resolve, reject) => {
    MenuItem.find(
      {
        parentId: {
          $ne: null,
        },
      },
      (err_mi, res_mi) => {
        if (err_mi) {
          console.error(err_mi);
          reject(err_mi);
        }

        if (res_mi) {
          resolve(res_mi);
        } else {
          reject({
            message: "Unable to process!",
          });
        }
      }
    );
  });

exports.findOne = async (menu) =>
  new Promise((resolve, reject) => {
    MenuItem.findById(menu, (_err, _res) => {
      if (_err) {
        console.error(_err);
        reject(_err);
      }
      if (_res) {
        resolve(_res);
      } else {
        console.error("Invalid Menuitem");
        reject({
          message: "Invalid Menuitem",
        });
      }
    });
  });

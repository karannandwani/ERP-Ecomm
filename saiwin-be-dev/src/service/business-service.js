var Business = require("../models/business");
const MenuItem = require("../models/menu-item");
const MenuItemRoleMap = require("../models/menu-item-role-map");
const {
  bodyToBusinessObject,
  bodyToBusinessFilterObject,
  bodyToPolicyObject,
} = require("../utils/conversion-util");
const { businessEvent } = require("../utils/event-util");
const { fetchRoleByName } = require("./role-service");
const { saveOrUpdateUser } = require("./user-service");
const { createMultiplePolicy } = require("../service/access-policy-service");
const { addBusinessValidate } = require("../utils/validate-request");

exports.create = async (req, res) => {
  try {
    addBusinessValidate(req.body)
      .then((result) => bodyToBusinessObject(req.body))
      .then((obj) => (req.body._id ? update(req.body, obj) : create(obj)))
      .then((result) => (req.body._id ? result : populateObject(result)))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const update = async (body, obj) =>
  new Promise((resolve, reject) => {
    try {
      Business.findByIdAndUpdate(
        body._id,
        {
          $set: obj,
        },
        { new: true }
      )
        .populate([{ path: "state" }, { path: "country" }])
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject({ message: "Unable to update" });
            }
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

const populateObject = (result) =>
  new Promise((resolve, reject) => {
    Business.populate(
      result,
      [{ path: "state" }, { path: "country" }],
      (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          resolve(response);
        } else {
          reject({ message: "Unable to populate saved object" });
        }
      }
    );
  });

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let business = Business(obj);
      business.save((err_business, res_business) => {
        if (err_business) {
          console.error(err_business);
          reject(err_business);
        }

        if (res_business) {
          businessEvent.emit("create", res_business);
          resolve(res_business);
        } else {
          reject({ message: "Unable to create!!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

businessEvent.on("create", (data) => {
  try {
    let userObj = {
      name: data.name,
      email: data.email,
      role: "Business",
      businessId: data._id,
    };
    saveOrUpdateUser(userObj).then((result) =>
      businessEvent.emit("create-facility", {
        business: data,
        user: result.user,
      })
    );
  } catch (e) {
    console.error(e);
  }
});

businessEvent.on("create", (data) => {
  fetchRoleByName("Business").then((result) =>
    addMenuPolicyForBusiness(
      result,
      [
        "Orders and Returns",
        "Sales",
        "User Management",
        "Master",
        "Dashboard",
        "Manufacturer",
        "Category",
        "Product",
        "Brand",
        "Beat",
        "Pricelist Group",
        "POS",
        "Orders",
        "Policies",
        "Returns",
        "Users",
        "Schemes",
        "Facility",
        "Policies",
        "HSN",
        "Role",
        "Role Menu Assign",
        "Supplier",
        "Tax",
        "Coupon",
        "Quantity Norm",
        "Inventory",
        "Order Feedbacks",
        "Ecom Landing Page",
        "Static Data",
      ],
      data
    )
  );
});

businessEvent.on("create", (data) => {
  fetchRoleByName("Facility").then((result) =>
    addMenuPolicyForBusiness(
      result,
      [
        "Sales",
        "Dashboard",
        "Orders and Returns",
        "Orders",
        "Returns",
        "Inventory",
        "User Management",
        "Users",
        "Master",
        "Vehicle",
        "POS",
        "Stock Mismatch Reason",
        "Coupon",
      ],
      data
    )
  );
});

businessEvent.on("create", (data) => {
  fetchRoleByName("Salesmanager").then((result) =>
    addMenuPolicyForBusiness(
      result,
      [
        "Dashboard",
        "CRMS",
        "Assign Beat",
        "Lead Generate",
        "User Management",
        "Users",
      ],
      data
    )
  );
});

businessEvent.on("create", (data) => {
  fetchRoleByName("Sales Person").then((result) =>
    addMenuPolicyForBusiness(
      result,
      ["Dashboard", "Tasks", "BeatList", "CRMS", "Lead Generate"],
      data
    )
  );
});

businessEvent.on("create", (data) => {
  fetchRoleByName("Driver").then((result) =>
    addMenuPolicyForBusiness(
      result,
      ["Dashboard", "CRMS", "Delivery Order", "Delivered Orders"],
      data
    )
  );
});

businessEvent.on("create", (data) => {
  fetchRoleByName("Business")
    .then((business_role) => ({
      roleId: business_role._id,
      resource: [
        "Category",
        "Manufacturer",
        "Sub Category",
        "Vehicle",
        "Beat",
        "Quantity Norm",
        "Order",
        "Order Status",
        "Pricelist Group",
        "Brand",
        "Product",
        "Facility",
        "Return",
        "Role",
        "Supplier",
        "Menu Role Map",
        "Lead",
        "Tax",
        "Country",
        "State",
      ],
      action: ["Create", "Update", "View", "Delete"],
      businessId: data._id.toString(),
    }))
    .then((result) => bodyToPolicyObject(result))
    .then((result) => createMultiplePolicy(result));
});

const addMenuPolicyForBusiness = async (role, items, business) => {
  try {
    MenuItem.find({ title: { $in: items } }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (res) {
        let menuItemMap = [];
        res.forEach((t) => {
          let obj = {
            menu: t._id,
            roleId: role._id,
            businessId: business._id,
          };
          menuItemMap.push(obj);
        });
        MenuItemRoleMap.insertMany(menuItemMap);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

exports.fetch = async (req, res) => {
  try {
    bodyToBusinessFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchBusinessById = async (businessId) =>
  new Promise((resolve, reject) => {
    try {
      Business.findById(businessId, (err, res) => {
        if (err) {
          reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject({ message: "Provide a valid business" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
const findByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Business.find(
        {
          $or: [{ name: queryObj.query.name }, { email: queryObj.query.email }],
        },
        null,
        queryObj.size
      )
        .populate([{ path: "state" }, { path: "country" }])
        .then(
          (result) => resolve(result),
          (error) => {
            console.error(error);
            reject(error);
          }
        );
    } catch (e) {
      reject(e);
    }
  });

exports.fetchBusinessByName = async (req, res) => {
  try {
    Business.findOne({ name: req.body.name }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      if (response) {
        return res.status(200).json(response);
      } else {
        return res.status(500).json({ message: "Business not available!" });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

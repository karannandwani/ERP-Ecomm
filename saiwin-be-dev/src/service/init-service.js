var OrderStatus = require("../models/order-status");
var User = require("../models/user");
var Role = require("../models/role");
var Policy = require("../models/access-policy");
var MenuItem = require("../models/menu-item");
var MenuRoleMap = require("../models/menu-item-role-map");
const { init } = require("./email-service");
const { inventoryLedgerInit } = require("./inventory-ledger-service");
const { keywordInit } = require("./keyword-service");
const { initSupplier } = require("./supplier-service");
const { initFacility } = require("./facility-service");
const Scheme = require("../models/scheme");
var mongoose = require("mongoose");
const SchemeVariable = require("../models/scheme-variable");
const Business = require("../models/business");
const EffectVariable = require("../models/effect-variable");
const { fetchRoleByName } = require("./role-service");
const { initFacilityUserMapping } = require("./facility-user-mapping-service");
var Facility = require("../models/facility");
const beat = require("../models/beat");
const { notificationInit } = require("./notification-service");
const { orderEventServiceInit } = require("./order-event-service");
const SlideImage = require("../models/slide-images");
const LandingPage = require("../models/landing-page-data");

exports.createOnStart = async () => {
  try {
    addSuperAdminRoleAndUser();
    addRoles();
    addOrderStatus();
    init();
    inventoryLedgerInit();
    initSupplier();
    initFacility();
    initFacilityUserMapping();
    keywordInit();
    // updateBeat();
    notificationInit();
    orderEventServiceInit();
    createScheme();
    createLandingPage();
  } catch (e) {
    console.error(e);
  }
};

const addSuperAdminRoleAndUser = async () => {
  try {
    let role;
    findOrCreateRole("Super Admin")
      .then((result) => {
        role = result;
        return findOrCreateBiziedgeBusiness();
      })
      .then((result) => {
        User.findOne({ email: "ops@yoctotta.com" }, (error, response) => {
          if (error) {
            console.error(error);
          }
          if (!response) {
            let _obj = {
              name: "Admin",
              email: "xxxx@xxx.com",
              password: "xxxx",
              active: true,
              businessRoleMap: [
                {
                  business: result._id,
                  roles: [role._id],
                },
              ],
            };
            let user = new User(_obj);
            user.save();
            addPolicyAndMenuItemForSuperAdmin(role, result._id);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (e) {
    console.error(e);
  }
};

const findOrCreateRole = async (name) =>
  new Promise((resolve, reject) => {
    Role.findOne({ name: name }, async (_err, _res) => {
      if (!_res) {
        let obj = {
          name: name,
        };
        let role = new Role(obj);
        let savedRole = role.save();
        savedRole.then(
          (result) => {
            resolve(result);
          },
          (error) => reject(error)
        );
      } else {
        resolve(_res);
      }
    });
  });

const findOrCreateBiziedgeBusiness = async () =>
  new Promise((resolve, reject) => {
    Business.findOne({ name: "Biziedge" }, async (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Biziedge",
          email: "biziedge@gmail.com",
        };
        let business = new Business(obj);
        let savedbusiness = business.save();
        savedbusiness.then(
          (result) => {
            resolve(result);
          },
          (error) => reject(error)
        );
      } else {
        resolve(_res);
      }
    });
  });

const addOrderStatus = async () => {
  try {
    OrderStatus.findOne({ name: "Generated" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Generated",
        };
        let status = new OrderStatus(obj);
        status.save();
      }
    });
    OrderStatus.findOne({ name: "Accepted" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Accepted",
        };
        let status = new OrderStatus(obj);
        status.save();
      }
    });
    OrderStatus.findOne({ name: "Rejected" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Rejected",
        };
        let status = new OrderStatus(obj);
        status.save();
      }
    });
    OrderStatus.findOne({ name: "Delivered" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Delivered",
        };
        let status = new OrderStatus(obj);
        status.save();
      }
    });
    OrderStatus.findOne({ name: "Requested" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Requested",
        };
        let status = new OrderStatus(obj);
        status.save();
      }
    });
    OrderStatus.findOne({ name: "Vehicle Assigned" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Vehicle Assigned",
        };
        let status = new OrderStatus(obj);
        status.save();
      }
    });
    OrderStatus.findOne({ name: "Dispatched" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Dispatched",
        };
        let status = new OrderStatus(obj);
        status.save();
      }
    });
  } catch (e) {
    console.error(e);
    console.error("Error while adding order status");
  }
};

const addRoles = async () => {
  try {
    Role.findOne({ name: "Business" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Business",
        };
        let role = new Role(obj);
        role.save();
      }
    });
    Role.findOne({ name: "Facility" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Facility",
        };
        let role = new Role(obj);
        role.save();
      }
    });
    Role.findOne({ name: "Salesmanager" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Salesmanager",
        };
        let role = new Role(obj);
        role.save();
      }
    });
    Role.findOne({ name: "Delivery Person" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Delivery Person",
        };
        let role = new Role(obj);
        role.save();
      }
    });
    Role.findOne({ name: "Customer" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Customer",
        };
        let role = new Role(obj);
        role.save();
      }
    });
    Role.findOne({ name: "User" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "User",
        };
        let role = new Role(obj);
        role.save();
      }
    });
    Role.findOne({ name: "Sales Person" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Sales Person",
        };
        let role = new Role(obj);
        role.save();
      }
    });
    Role.findOne({ name: "Driver" }, (_err, _res) => {
      if (!_res) {
        let obj = {
          name: "Driver",
        };
        let role = new Role(obj);
        role.save();
      }
    });
  } catch (e) {
    console.error(e);
    console.error("Error while adding role");
  }
};

const addPolicyForSuperAdmin = async (role) => {
  try {
    Policy.findOne(
      { roleId: role._id, resource: "Business", action: "Create" },
      (err, res) => {
        if (err) {
          console.error(err);
        }

        if (!res) {
          let obj = {
            roleId: role._id,
            resource: "Business",
            action: "Create",
            businessId: "super_admin",
          };
          let policy = new Policy(obj);
          policy.save();
        }
      }
    );

    Policy.findOne(
      { roleId: role._id, resource: "Business", action: "Update" },
      (err, res) => {
        if (err) {
          console.error(err);
        }

        if (!res) {
          let obj = {
            roleId: role._id,
            resource: "Business",
            action: "Update",
            businessId: "super_admin",
          };
          let policy = new Policy(obj);
          policy.save();
        }
      }
    );

    Policy.findOne(
      { roleId: role._id, resource: "Country", action: "Create" },
      (err, res) => {
        if (err) {
          console.error(err);
        }

        if (!res) {
          let obj = {
            roleId: role._id,
            resource: "Country",
            action: "Create",
            businessId: "super_admin",
          };
          let policy = new Policy(obj);
          policy.save();
        }
      }
    );

    Policy.findOne(
      { roleId: role._id, resource: "Country", action: "Update" },
      (err, res) => {
        if (err) {
          console.error(err);
        }

        if (!res) {
          let obj = {
            roleId: role._id,
            resource: "Country",
            action: "Update",
            businessId: "super_admin",
          };
          let policy = new Policy(obj);
          policy.save();
        }
      }
    );

    Policy.findOne(
      { roleId: role._id, resource: "State", action: "Create" },
      (err, res) => {
        if (err) {
          console.error(err);
        }

        if (!res) {
          let obj = {
            roleId: role._id,
            resource: "State",
            action: "Create",
            businessId: "super_admin",
          };
          let policy = new Policy(obj);
          policy.save();
        }
      }
    );

    Policy.findOne(
      { roleId: role._id, resource: "State", action: "Update" },
      (err, res) => {
        if (err) {
          console.error(err);
        }

        if (!res) {
          let obj = {
            roleId: role._id,
            resource: "State",
            action: "Update",
            businessId: "super_admin",
          };
          let policy = new Policy(obj);
          policy.save();
        }
      }
    );
  } catch (e) {
    console.error(e);
    console.error("Error while adding policy for super admin");
  }
};

const addMenuItemForSuperAdmin = async (role, business) => {
  try {
    MenuItem.findOne({ title: "Business" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Business",
          url: "business",
          icon: "home",
          order: 0,
          parentId: null,
        };
        let newMenuItem = new MenuItem(obj);
        newMenuItem.save().then((result) => {
          if (result) {
            let menuRoleObj = {
              menu: result._id,
              roleId: role._id,
              businessId: business,
            };
            let menuRoleMap = new MenuRoleMap(menuRoleObj);
            menuRoleMap.save();
          }
        });
      } else {
        let newObj = {
          menu: res._id,
          roleId: role._id,
          businessId: business,
        };
        let menuRoleMap = new MenuRoleMap(newObj);
        menuRoleMap.save();
      }
    });

    MenuItem.findOne({ title: "Country" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Country",
          url: "country",
          icon: "home",
          order: 1,
          parentId: null,
        };
        let newMenuItem = new MenuItem(obj);
        newMenuItem.save().then((result) => {
          if (result) {
            let menuRoleObj = {
              menu: result._id,
              roleId: role._id,
              businessId: business,
            };
            let menuRoleMap = new MenuRoleMap(menuRoleObj);
            menuRoleMap.save();
          }
        });
      } else {
        let newObj = {
          menu: res._id,
          roleId: role._id,
          businessId: business,
        };
        let menuRoleMap = new MenuRoleMap(newObj);
        menuRoleMap.save();
      }
    });

    MenuItem.findOne({ title: "State" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "State",
          url: "state",
          icon: "home",
          order: 2,
          parentId: null,
        };
        let newMenuItem = new MenuItem(obj);
        newMenuItem.save().then((result) => {
          if (result) {
            let menuRoleObj = {
              menu: result._id,
              roleId: role._id,
              businessId: business,
            };
            let menuRoleMap = new MenuRoleMap(menuRoleObj);
            menuRoleMap.save();
          }
        });
      } else {
        let newObj = {
          menu: res._id,
          roleId: role._id,
          businessId: business,
        };
        let menuRoleMap = new MenuRoleMap(newObj);
        menuRoleMap.save();
      }
    });
  } catch (e) {
    console.error(e);
    console.error("error while adding menu item for super admin");
  }
};
const addPolicyAndMenuItemForSuperAdmin = (role, business) => {
  try {
    addPolicyForSuperAdmin(role);
    addMenuItemForSuperAdmin(role, business);
  } catch (e) {
    console.error(e);
  }
};

exports.addMenuItem = async () => {
  try {
    let order, sales, user, master, crms;
    MenuItem.findOne({ title: "Dashboard" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Dashboard",
          url: "dashboard",
          icon: "home",
          order: 3,
          parentId: null,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    await Promise.all([
      new Promise((resolve, reject) => {
        MenuItem.findOne({ title: "Master" }, (err, res) => {
          if (err) {
            console.error(err);
          }
          if (!res) {
            let obj = {
              title: "Master",
              url: "#",
              icon: "home",
              order: 4,
              parentId: null,
            };
            let menuItem = new MenuItem(obj);
            menuItem.save((err_menu, res_menu) => {
              if (err_menu) {
                reject(err_menu);
              }

              if (res_menu) {
                master = res_menu;
                resolve();
              } else {
                reject("Unable to process");
              }
            });
          } else {
            master = res;
            resolve();
          }
        });
      }),
      new Promise((resolve, reject) => {
        MenuItem.findOne({ title: "Sales" }, (err, res) => {
          if (err) {
            console.error(err);
          }
          if (!res) {
            let obj = {
              title: "Sales",
              url: "#",
              icon: "home",
              order: 5,
              parentId: null,
            };
            let menuItem = new MenuItem(obj);
            menuItem.save((err_menu, res_menu) => {
              if (err_menu) {
                reject(err_menu);
              }

              if (res_menu) {
                sales = res_menu;
                resolve();
              } else {
                reject("Unable to process");
              }
            });
          } else {
            sales = res;
            resolve();
          }
        });
      }),
      new Promise((resolve, reject) => {
        MenuItem.findOne({ title: "Orders and Returns" }, (err, res) => {
          if (err) {
            console.error(err);
          }
          if (!res) {
            let obj = {
              title: "Orders and Returns",
              url: "#",
              icon: "home",
              order: 6,
              parentId: null,
            };
            let menuItem = new MenuItem(obj);
            menuItem.save((err_menu, res_menu) => {
              if (err_menu) {
                reject(err_menu);
              }

              if (res_menu) {
                order = res_menu;
                resolve();
              } else {
                reject("Unable to process");
              }
            });
          } else {
            order = res;
            resolve();
          }
        });
      }),
      new Promise((resolve, reject) => {
        MenuItem.findOne({ title: "User Management" }, (err, res) => {
          if (err) {
            console.error(err);
          }
          if (!res) {
            let obj = {
              title: "User Management",
              url: "#",
              icon: "home",
              order: 7,
              parentId: null,
            };
            let menuItem = new MenuItem(obj);
            menuItem.save((err_menu, res_menu) => {
              if (err_menu) {
                reject(err_menu);
              }

              if (res_menu) {
                user = res_menu;
                resolve();
              } else {
                reject("Unable to process");
              }
            });
          } else {
            user = res;
            resolve();
          }
        });
      }),
      new Promise((resolve, reject) => {
        MenuItem.findOne({ title: "CRMS" }, (err, res) => {
          if (err) {
            console.error(err);
          }
          if (!res) {
            let obj = {
              title: "CRMS",
              url: "#",
              icon: "home",
              order: 8,
              parentId: null,
            };
            let menuItem = new MenuItem(obj);
            menuItem.save((err_menu, res_menu) => {
              if (err_menu) {
                reject(err_menu);
              }

              if (res_menu) {
                crms = res_menu;
                resolve();
              } else {
                reject("Unable to process");
              }
            });
          } else {
            crms = res;
            resolve();
          }
        });
      }),
      new Promise((resolve, reject) => {
        MenuItem.findOne({ title: "Tasks" }, (err, res) => {
          if (err) {
            console.error(err);
          }
          if (!res) {
            let obj = {
              title: "Tasks",
              url: "#",
              icon: "home",
              order: 35,
              parentId: null,
            };
            let menuItem = new MenuItem(obj);
            menuItem.save((err_menu, res_menu) => {
              if (err_menu) {
                reject(err_menu);
              }

              if (res_menu) {
                tasks = res_menu;
                resolve();
              } else {
                reject("Unable to process");
              }
            });
          } else {
            tasks = res;
            resolve();
          }
        });
      }),
    ]);

    MenuItem.findOne({ title: "Manufacturer" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Manufacturer",
          url: "manufacturer",
          icon: "business",
          order: 9,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Category" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Category",
          url: "category",
          icon: "basket",
          order: 10,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Product" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Product",
          url: "product",
          icon: "basket",
          order: 11,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Vehicle" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Vehicle",
          url: "vehicle",
          icon: "bus",
          order: 12,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Brand" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Brand",
          url: "brand",
          icon: "pricetags",
          order: 13,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Beat" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Beat",
          url: "beat",
          icon: "locate",
          order: 14,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Pricelist Group" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Pricelist Group",
          url: "pricelist-group",
          icon: "cash",
          order: 15,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Orders" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Orders",
          url: "orders",
          icon: "folder",
          order: 16,
          parentId: order._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Inventory" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Inventory",
          url: "inventory",
          icon: "business",
          order: 17,
          parentId: null,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Access Policies" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Access Policies",
          url: "policies",
          icon: "clipboard",
          order: 18,
          parentId: user._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Returns" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Returns",
          url: "returns",
          icon: "cube",
          order: 19,
          parentId: order._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Users" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Users",
          url: "users",
          icon: "person",
          order: 21,
          parentId: user._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Schemes" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Schemes",
          url: "schemes",
          icon: "discount",
          order: 22,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Facility" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Facility",
          url: "warehouse",
          icon: "reader",
          order: 23,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Policies" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Policies",
          url: "policies",
          icon: "clipboard",
          order: 24,
          parentId: user._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "HSN" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "HSN",
          url: "hsn",
          icon: "cash-outline",
          order: 25,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Quantity Norm" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Quantity Norm",
          url: "quantity-norm",
          icon: "hammer-outline",
          order: 26,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "POS" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "POS",
          url: "pos",
          icon: "briefcase",
          order: 27,
          parentId: sales._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Role" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Role",
          url: "role",
          icon: "man-outline",
          order: 28,
          parentId: user._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Role" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Role Menu Assign",
          url: "role-menu",
          icon: "man-outline",
          order: 29,
          parentId: user._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Supplier" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Supplier",
          url: "supplier",
          icon: "reader",
          order: 30,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Assign Beat" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Assign Beat",
          url: "assign_beats",
          icon: "basket",
          order: 31,
          parentId: crms._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });
    MenuItem.findOne({ title: "Lead Generate" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Lead Generate",
          url: "lead_generate",
          icon: "basket",
          order: 32,
          parentId: crms._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Tax" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Tax",
          url: "tax",
          icon: "cash",
          order: 33,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Stock Mismatch Reason" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Stock Mismatch Reason",
          url: "stock-mismatch-reason",
          icon: "home",
          order: 34,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "BeatList" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "BeatList",
          url: "beat_list",
          icon: "basket",
          order: 36,
          parentId: tasks._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Coupon" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Coupon",
          url: "coupon",
          icon: "coupon",
          order: 39,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Delivery Order" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Delivery Order",
          url: "delivery-orders",
          icon: "coupon",
          order: 40,
          parentId: crms._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Delivered Orders" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Delivered Orders",
          url: "delivered-orders",
          icon: "coupon",
          order: 41,
          parentId: crms._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Order Feedbacks" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Order Feedbacks",
          url: "order-feedbacks",
          icon: "coupon",
          order: 42,
          parentId: user._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Ecom Landing Page" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Ecom Landing Page",
          url: "landing-page",
          icon: "landing-page",
          order: 43,
          parentId: user._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    MenuItem.findOne({ title: "Static Data" }, (err, res) => {
      if (err) {
        console.error(err);
      }
      if (!res) {
        let obj = {
          title: "Static Data",
          url: "static-data",
          icon: "static-data",
          order: 44,
          parentId: master._id,
        };
        let menuItem = new MenuItem(obj);
        menuItem.save();
      }
    });

    // let obj = {
    //   name: "Product_Count",
    //   query:
    //     'new Promise((resolve, reject) => {\r\n    require("../models/order").aggregate(\r\n      [\r\n        {\r\n          $match: {\r\n            suppliers: require("mongoose").Types.ObjectId(\r\n              "60584183a10e4c2001f90e07"\r\n            ),\r\n          },\r\n        },\r\n        {\r\n          $group: {\r\n            _id: "null",\r\n            count: {\r\n              $sum: "$subTotal",\r\n            },\r\n          },\r\n        },\r\n      ],\r\n      (error, response) => {\r\n        if (error) {\r\n          console.error(error);\r\n          reject(error);\r\n        }\r\n        resolve(response && response[0].count > 20000 ? true : false);\r\n      }\r\n    );\r\n  });',
    //   business: "60510c9951a2374b25bfb31a",
    // };
    // let schemeVariable = new SchemeVariable(obj);
    // schemeVariable.save();

    // let obj1 = {
    //   conditions: [
    //     {
    //       variable: "60630aae6412097a93b92a1b",
    //     },
    //   ],
    //   effects: [mongoose.Types.ObjectId("60587e9e8999e63b38422599")],
    // };
    // let schemeObj = new Scheme(obj1);
    // schemeObj.save();

    // let obj = {
    //   name: "Discount in %",
    //   parameter: {
    //     discountPercent: 10,
    //     maxDiscount: 150,
    //   },
    // };
    // let effectVariable = EffectVariable(obj);
    // effectVariable.save();

    // let obj1 = {
    //   name: "Discount in Flat",
    //   parameter: {
    //     maxDiscount: 150,
    //   },
    // };
    // let effectVariable1 = EffectVariable(obj1);
    // effectVariable1.save();

    // let obj2 = {
    //   name: "Free Product",
    //   parameter: {
    //     product: "60583f3b80e7991f1f21724e",
    //     qty: totalProduct/5,
    //   },
    // };
    // let effectVariable2 = EffectVariable(obj2);
    // effectVariable2.save();
    // let businessRole, businessList;
    // fetchRoleByName("Business")
    //   .then((result) => {
    //     businessRole = result;
    //     return Business.find();
    //   })
    //   .then((result) => {
    //     businessList = result;
    //     return MenuItem.find({
    //       title: { $in: ["Quantity Norm"] },
    //     });
    //   })
    //   .then((result) => {
    //     let items = [];
    //     for (let index = 0; index < result.length; index++) {
    //       const item = result[index];
    //       for (let index1 = 0; index1 < businessList.length; index1++) {
    //         const bl = businessList[index1];
    //         items.push({
    //           menu: item._id,
    //           roleId: businessRole._id,
    //           businessId: bl._id,
    //         });
    //       }
    //     }
    //     MenuRoleMap.insertMany(items);
    //   });
  } catch (e) {
    console.error(e);
  }
};

const updateFacility = async () => {
  Facility.find((error, response) => {
    if (error) {
      console.error(error);
    }
    if (response && response.length > 0) {
      response.forEach((x) => {
        Facility.findByIdAndUpdate(x._id, {
          $set: {
            location: {
              type: "Point",
              coordinates: [
                Number("20.31" + Math.floor(1000 + Math.random() * 9000)),
                Number("85.82" + Math.floor(1000 + Math.random() * 9000)),
              ],
            },
          },
        }).exec();
      });
    }
  });
};

const updateBeat = async () => {
  beat
    .findByIdAndUpdate("60d1bbeeb160c4cd43bd88ee", {
      $set: {
        location: {
          type: "Polygon",
          coordinates: [
            [
              [85.858154296875, 20.179723502765153],
              [85.99822998046875, 20.353640041645722],
              [85.87394714355469, 20.414786445017914],
              [85.73799133300781, 20.386469020191306],
              [85.75103759765625, 20.23707307568839],
              [85.858154296875, 20.179723502765153],
            ],
          ],
        },
      },
    })
    .exec();

  beat
    .findByIdAndUpdate("60d1bbfab160c4cd43bd88ef", {
      $set: {
        location: {
          type: "Polygon",
          coordinates: [
            [
              [85.70297241210938, 20.537649362986016],
              [85.77850341796875, 20.428299743981896],
              [85.93643188476562, 20.41414292499509],
              [86.08612060546875, 20.44374206075362],
              [86.07925415039062, 20.505495805221404],
              [86.1053466796875, 20.558224093635957],
              [85.9408950805664, 20.592616282182746],
              [85.87017059326172, 20.583617205845798],
              [85.81592559814453, 20.551634051708866],
              [85.70297241210938, 20.537649362986016],
            ],
          ],
        },
      },
    })
    .exec();
};

const createScheme = () => {
  try {
    // let obj = {
    //   type: "PRODUCT_DISCOUNT",
    //   effectFrom: new Date(),
    //   effectTill: new Date(2021, 12),
    //   active: true,
    //   autoApplied: true,
    //   business: "60b47fff8829b40a407b3fb2",
    //   condition: {
    //     products: ["60b486c78829b40a407b4061"],
    //   },
    //   effect: {
    //     type: "FLAT_DISCOUNT",
    //     value: 5,
    //   },
    // };
    let obj = {
      type: "COMBO_PRODUCT_DISCOUNT",
      effectFrom: new Date(),
      effectTill: new Date(2021, 12),
      active: true,
      autoApplied: true,
      business: "60b47fff8829b40a407b3fb2",
      product: "60b486c78829b40a407b4061",
      evaluation: [
        {
          qty: 2,
          type: "FLAT_DISCOUNT",
          discount: 10,
        },
        {
          qty: 3,
          type: "PERCENTAGE_DISCOUNT",
          discount: 15,
        },
        {
          qty: 5,
          type: "FREE_PRODUCT",
          freeProduct: "60c1a2561e7b1edf0020e0a2",
          freeQty: 1,
        },
      ],
    };
    // let scheme = new Scheme(obj);
    // scheme.save();
  } catch (e) {
    console.error(e);
  }
};
// Bhubaneswar
// [
//   [
//     [85.858154296875, 20.179723502765153],
//     [85.99822998046875, 20.353640041645722],
//     [85.87394714355469, 20.414786445017914],
//     [85.73799133300781, 20.386469020191306],
//     [85.75103759765625, 20.23707307568839],
//     [85.858154296875, 20.179723502765153],
//   ],
// ]

//Cuttack
// [
//   [
//     [85.70297241210938, 20.537649362986016],
//     [85.77850341796875, 20.428299743981896],
//     [85.93643188476562, 20.41414292499509],
//     [86.08612060546875, 20.44374206075362],
//     [86.07925415039062, 20.505495805221404],
//     [86.1053466796875, 20.558224093635957],
//     [85.9408950805664, 20.592616282182746],
//     [85.87017059326172, 20.583617205845798],
//     [85.81592559814453, 20.551634051708866],
//     [85.70297241210938, 20.537649362986016],
//   ],
// ]

const createLandingPage = async () => {
  try {
    // let obj = new SlideImage({
    //   image:
    //     "https://nextbigwhat.com/wp-content/uploads/2020/08/Parle_G-biscuits.jpeg",
    //   type: "URL",
    //   aspectRatio: {
    //     width: 4,
    //     height: 3,
    //   },
    //   redirectData: {
    //     id: "60b480468829b40a407b403c",
    //     type: "Category",
    //   },
    // });
    // obj.save();
    // let landing = new LandingPage({
    //   type: "Category",
    //   order: 1,
    //   dataQuery: {
    //     type: "Category",
    //     query: {
    //       business: "60d0592edbef2c626c529473",
    //     },
    //   },
    //   business: "60d0592edbef2c626c529473",
    //   active: true,
    // });
    // landing.save();
    // let landing1 = new LandingPage({
    //   type: "Product",
    //   order: 2,
    //   dataQuery: {
    //     type: "Product",
    //     query: {
    //       business: "60d0592edbef2c626c529473",
    //     },
    //   },
    //   business: "60d0592edbef2c626c529473",
    //   active: true,
    // });
    // landing1.save();
    // let landing2 = new LandingPage({
    //   type: "Category",
    //   order: 3,
    //   dataQuery: {
    //     type: "Manufacturer",
    //     query: {
    //       business: "60d0592edbef2c626c529473",
    //     },
    //   },
    //   business: "60d0592edbef2c626c529473",
    //   active: true,
    // });
    // landing2.save();
    // let landing3 = new LandingPage({
    //   type: "Carousel",
    //   order: 4,
    //   business: "60d0592edbef2c626c529473",
    //   active: true,
    //   slideImages: [
    //     mongoose.Types.ObjectId("60d1bce0b160c4cd43bd88f7"),
    //     mongoose.Types.ObjectId("60d1bcf4b160c4cd43bd88f9"),
    //     mongoose.Types.ObjectId("60d1bd08b160c4cd43bd88fb"),
    //     mongoose.Types.ObjectId("60d1bd1cb160c4cd43bd88fd"),
    //   ],
    // });
    // landing3.save();
    // let landing4 = new LandingPage({
    //   type: "Image",
    //   order: 5,
    //   business: "60d0592edbef2c626c529473",
    //   active: true,
    //   slideImages: [mongoose.Types.ObjectId("60d1bd1cb160c4cd43bd88fd")],
    // });
    // landing4.save();
  } catch (e) {
    console.error(e);
  }
};

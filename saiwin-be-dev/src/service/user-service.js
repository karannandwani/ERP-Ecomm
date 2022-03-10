var User = require("../models/user");
var jwt = require("jsonwebtoken");
var config = require("../config/config");
var PassCode = require("../models/pass-code");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const ImageService = require("./image-service");
const MenuRoleMap = require("../models/menu-item-role-map");
const MenuItem = require("../models/menu-item");
const {
  fetchRoleByName,
  fetchRoleById,
  validateRoles,
} = require("./role-service");
const { emailEvent } = require("../utils/event-util");
const {
  bodyToUserFilterObject,
  bodyToUserObject,
  bodyToSalesPersonObject,
  validateUserLoginRequest,
  queryObjForUser,
} = require("../utils/conversion-util");
var mongoose = require("mongoose");
const { findFacilitiesOfUser } = require("./facility-service");
const {
  validateUserRegistrationRequest,
  addAddressValidate,
  sendOtpValidate,
} = require("../utils/validate-request");

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.jwtSecret
  );
}

exports.registerUser = async (req, res) => {
  try {
    validateUserRegistrationRequest(req.body)
      .then(() => ImageService.resizeImage(req.body.image))
      .then((result) =>
        this.create({ ...req.body, ...result, registration: true })
      )
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

exports.create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      validateRoles(obj.businessRoleMap.roles)
        .then((result) => queryObjForUser(obj))
        .then((result) =>
          findOneByQuery({
            query: result,
            populate: [],
          })
        )
        .then((result) => checkBusinessAndUpdate(result, obj))
        .then((result) => resolve(result))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });

const checkBusinessAndUpdate = async (user, obj) =>
  new Promise((resolve, reject) => {
    if (user) {
      let temp = false;
      let newBusinessRoleArray = JSON.parse(
        JSON.stringify(user.businessRoleMap)
      );
      for (let index = 0; index < newBusinessRoleArray.length; index++) {
        const element = newBusinessRoleArray[index];
        if (element.business.toString() === obj.businessRoleMap.business) {
          temp = true;
          let roles = element.roles.map((x) => x.toString());
          roles.push(...obj.businessRoleMap.roles);
          newBusinessRoleArray[index].roles = obj.registration
            ? obj.businessRoleMap.roles
            : [...new Set(roles)];
        }
      }
      if (!temp) {
        newBusinessRoleArray.push({
          business: obj.businessId,
          roles: obj.businessRoleMap.roles,
        });
      }

      let toBeUpdatedObject = { ...obj, businessRoleMap: newBusinessRoleArray };
      delete toBeUpdatedObject["password"];

      resolve(
        queryObjForUser(obj).then((result) =>
          User.findOneAndUpdate(
            result,
            { $set: toBeUpdatedObject },
            { new: true }
          )
            .populate([
              { path: "businessRoleMap.business" },
              { path: "businessRoleMap.roles" },
            ])
            .exec()
        )
      );
    } else {
      createNew(obj)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    }
  });

const update = async (findObj, updateObj) =>
  new Promise((resolve, reject) => {
    User.findOneAndUpdate(findObj, updateObj, { new: true }).then(
      (result) => resolve(result),
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });

const checkPassword = async (user, body) =>
  new Promise((resolve, reject) => {
    try {
      user.comparePassword(body.password, async (_err, isMatch) => {
        if (_err) {
          console.error(_err);
          reject(err);
        }

        if (isMatch) {
          resolve(user);
        } else {
          reject({
            message: "Email and password does not match!!!",
          });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const checkOTP = async (user, body) =>
  new Promise((resolve, reject) => {
    try {
      user.compareOTP(body.otp, async (_err, isMatch) => {
        if (_err) {
          console.error(_err);
          reject(err);
        }

        if (isMatch) {
          let currentDate = new Date();
          currentDate.setMinutes(currentDate.getMinutes() - 3);
          if (currentDate.getTime() > user.otp.createdAt.getTime()) {
            reject({ message: "Invalid otp" });
          } else {
            resolve(user);
          }
        } else {
          reject({
            message: "Mobile and given OTP does not match!!!",
          });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findMenuItem = async (userResponse) =>
  new Promise((resolve, reject) => {
    try {
      let roleList = userResponse.businessRoleMap.reduce(
        (roles, currentValue) => {
          return roles.concat(
            currentValue.roles.map((x) => mongoose.Types.ObjectId(x._id))
          );
        },
        []
      );
      let businessList = userResponse.businessRoleMap.reduce(
        (businessArray, currentValue) => {
          return businessArray.concat(currentValue.business._id);
        },
        []
      );
      MenuRoleMap.aggregate(
        [
          {
            $match: {
              roleId: { $in: roleList },
              businessId: { $in: businessList },
            },
          },
          {
            $lookup: {
              from: "menuitems",
              localField: "menu",
              foreignField: "_id",
              as: "menu",
            },
          },
          {
            $unwind: "$menu",
          },
          {
            $sort: {
              "menu.order": 1,
            },
          },
          {
            $group: {
              _id: "$businessId",
              menuList: {
                $addToSet: "$menu",
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
            resolve(response);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const postLoginSetup = async (user) =>
  new Promise((resolve, reject) => {
    try {
      let userResponse = JSON.parse(JSON.stringify(user));
      userResponse.token = createToken(user);
      findMenuItem(userResponse)
        .then((menuItems) =>
          setMenuItemsAccordingToBusiness(userResponse, menuItems)
        )
        .then((result) => setFacilityOfUserAccordingToBusiness(result))
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const setFacilityOfUserAccordingToBusiness = async (userResponse) =>
  new Promise((resolve, reject) => {
    try {
      delete userResponse["password"];
      findFacilitiesOfUser(mongoose.Types.ObjectId(userResponse._id)).then(
        (result) => {
          if (result && result.length > 0) {
            for (
              let index = 0;
              index < userResponse.businessRoleMap.length;
              index++
            ) {
              const element = userResponse.businessRoleMap[index];
              userResponse.businessRoleMap[index].facilities = result
                .filter((x) => x.facility.business === element.business._id)
                .map((x) => x.facility);
            }
            userResponse.selectedFacility = (
              result.find((x) => x.selected) || result[0]
            ).facility._id;
            resolve(userResponse);
          } else {
            resolve(userResponse);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const setMenuItemsAccordingToBusiness = async (userResponse, menuItems) =>
  new Promise((resolve, reject) => {
    try {
      for (
        let index = 0;
        index < userResponse.businessRoleMap.length;
        index++
      ) {
        const element = userResponse.businessRoleMap[index];
        let menus =
          menuItems && menuItems.find((x) => x._id === element.business._id)
            ? menuItems
                .find((x) => x._id === element.business._id)
                .menuList.sort((a, b) => a.order - b.order)
            : [];
        let obj = menus.filter((t) => t.parentId === null);
        let menuObj = JSON.parse(JSON.stringify(obj));
        menuObj.forEach((t) => {
          t.expanded = false;
          let child = menus.filter((m) => m.parentId === t._id.toString());
          if (child.length > 0) {
            t["child"] = child;
          } else {
            delete menuObj[t];
          }
        });
        menuObj.sort();
        userResponse.businessRoleMap[index].menuItems = menuObj;
      }

      resolve(userResponse);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.loginUser = async (req, res) => {
  try {
    validateUserLoginRequest(req.body)
      .then((result) => queryObjForUser(req.body))
      .then((result) =>
        findOne({
          query: result,
          populate: [
            { path: "businessRoleMap.business" },
            { path: "businessRoleMap.roles" },
          ],
        })
      )
      .then((user) =>
        req.body.password
          ? checkPassword(user, req.body)
          : checkOTP(user, req.body)
      )
      .then((user) => postLoginSetup(user))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.userProfile = async (req, res) => {
  try {
    User.findById(req.user._id, (err, _res) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (_res) {
        let user = JSON.parse(JSON.stringify(_res));
        delete user["password"];
        return res.status(200).json(user);
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.comparePassword = async (req, res) => {
  try {
    let user = req.user;
    user.comparePassword(req.params.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      if (!isMatch) {
        return res.status(200).json({
          match: false,
        });
      }
      if (isMatch && !err) {
        return res.status(200).json({
          match: true,
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.changePassword = async (req, res) => {
  try {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(req.params.password, salt, function (err_, hash) {
        if (err_) {
          console.error(err_);
          return res.status(500).json(err_);
        }

        if (hash) {
          User.findByIdAndUpdate(
            req.user._id,
            {
              $set: {
                password: hash,
              },
            },
            (_err, _pass) => {
              if (_err) {
                console.error(_err);
                return res.status(500).json(_err);
              }

              if (_pass) {
                return res.status(200).json({
                  message: "Password changed!!! ",
                });
              }
            }
          );
        }
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    findOne({
      query: {
        email: req.params.email,
      },
    })
      .then((result) => checkForPassCodeOrCreate(result))
      .then((passcode) => sendMail(passcode, req.params.email))
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const sendMail = async (passcode, email) =>
  new Promise((resolve, reject) => {
    let transport = nodemailer.createTransport({
      host: config.mail_smtp_server,
      port: config.mail_port,
      auth: {
        user: config.mail_from,
        pass: config.mail_password,
      },
    });
    const message = {
      from: config.mail_from,
      to: email,
      subject: "Forgot Password",
      text: `Hey!!!, 
Please use code ${passcode.code} to update your password. Code expires after 3 minutes. `,
    };
    transport.sendMail(message, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      if (response) {
        resolve({ message: "Mail sent to your given mail." });
      }
    });
  });

const checkForPassCodeOrCreate = async (user) =>
  new Promise((resolve, reject) => {
    PassCode.findOneAndUpdate(
      {
        email: user.email,
      },
      {
        $set: {
          email: user.email,
          code: config.user_password,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true },
      (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          resolve(response);
        }
      }
    );
  });

exports.checkEmailCode = async (req, res) => {
  try {
    PassCode.findOne(
      {
        email: req.body.email,
      },
      (_err, _res) => {
        if (_err) {
          console.error(_err);
          return res.status(500).json(_err);
        }

        if (_res) {
          if (_res.code === req.body.code) {
            PassCode.findByIdAndDelete(_res.code);
            return res.status(200).json({
              message: true,
            });
          } else {
            return res.status(200).json({
              message: false,
            });
          }
        } else {
          return res.status(500).json({
            message: "The code entered has already expired. Please try again.",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.setPasswordforForgot = async (req, res) => {
  try {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(req.body.password, salt, async (_err, hash) => {
        if (_err) {
          console.error(_err);
          return res.status(500).json(_err);
        }

        User.findOneAndUpdate(
          {
            email: req.body.email,
          },
          {
            $set: {
              password: hash,
            },
          },
          (_err_usr, _pass) => {
            if (_err_usr) {
              return res.status(500).json(_err_usr);
            }

            if (_pass) {
              return res.status(200).json({
                message: "Password changed!!! ",
              });
            }
          }
        );
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    bodyToUserFilterObject(req.body)
      .then((result) => updateFilterObjectForSalesPerson(result, req.body))
      .then((result) => this.findUsersByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateFilterObjectForSalesPerson = async (obj, body) =>
  new Promise((resolve, reject) => {
    try {
      if (body.salesManager) {
        fetchRoleByName("Sales Person")
          .then((result) => {
            obj["query"]["businessRoleMap.roles"] = result._id;
            resolve(obj);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      } else {
        resolve(obj);
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.findSalesPerson = async (req, res) => {
  try {
    bodyToSalesPersonObject(req.query)
      .then((result) => findSalesPersonByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.findUserById = async (uId, populate) =>
  new Promise((resolve, reject) => {
    try {
      User.findById(uId)
        .populate(populate)
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject({ message: "No user found!" });
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

exports.saveOrUpdateUser = async (userObj) =>
  new Promise((resolve, reject) => {
    if (userObj.email) {
      fetchRoleByName(userObj.role)
        .then((role) => createOrUpdate(userObj, role))
        .then((result) => {
          emailEvent.emit("send", {
            to: result.user.email,
            subject: "Welcome to BiziEdge",
            text: `Hey!!!, \nPlease use "
              ${result.user.email}
              " and "  ${
                result.password ? result.password : "your given password"
              } to view your profile.`,
          });
          resolve(result);
        })
        .catch((err) => reject(err));
    } else {
      resolve();
    }
  });

const createOrUpdate = async (userObj, role) =>
  new Promise((resolve, reject) => {
    try {
      let password,
        temp = false;
      findOneByQuery({ query: { email: userObj.email } }).then((response) => {
        if (response) {
          let newBusinessRoleArray = response.businessRoleMap;
          for (let index = 0; index < newBusinessRoleArray.length; index++) {
            const element = newBusinessRoleArray[index];
            if (element.business.toString() === userObj.businessId.toString()) {
              temp = true;
              let roles = element.roles;
              if (!roles.includes(role._id)) {
                roles.push(role._id);
              }
            }
          }
          if (!temp) {
            newBusinessRoleArray.push({
              business: userObj.businessId,
              roles: [role._id],
            });
          }

          User.findOneAndUpdate(
            { email: userObj.email },
            { $set: { businessRoleMap: newBusinessRoleArray } }
          ).exec();
          resolve({ user: response });
        } else {
          password = config.user_password;
          let obj = {
            name: userObj.name ? userObj.name : userObj.email.split("@")[0],
            email: userObj.email,
            active: true,
            password: password,
            businessRoleMap: [
              {
                business: userObj.businessId,
                roles: [role._id],
              },
            ],
          };
          let user = User(obj);
          user.save();
          resolve({ user: user, password: password });
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.findUsersByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      User.find(queryObj.query, null, queryObj.size)
        .populate(queryObj.populate)
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

const findOne = async (query) =>
  new Promise((resolve, reject) => {
    try {
      findOneByQuery(query)
        .then(
          (user) => {
            if (user) {
              if (user.active !== undefined && !user.active) {
                console.error(
                  "Your account is currently inactive. Please contact admin!!!"
                );
                reject({
                  message:
                    "Your account is currently inactive. Please contact admin!!!",
                });
              } else {
                resolve(user);
              }
            } else {
              console.error("User not found");
              reject({ message: "User not found" });
            }
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        )
        .catch((error) => reject(error));
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findOneByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      User.findOne(queryObj.query)
        .populate(queryObj.populate)
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

const createNew = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      bodyToUserObject(obj).then((result) => {
        let newUser = User(result);
        newUser.save(
          {
            validateBeforeSave: true,
          },
          (error, user) => {
            if (error) {
              reject({
                message: error,
              });
            }

            if (user) {
              User.populate(
                user,
                [
                  { path: "businessRoleMap.business" },
                  { path: "businessRoleMap.roles" },
                ],
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
              reject({
                message: "Error Occured",
              });
            }
          }
        );
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findSalesPersonByQuery = async (findObj) =>
  new Promise((resolve, reject) => {
    try {
      User.aggregate(
        [
          {
            $unwind: "$businessRoleMap",
          },
          {
            $match: findObj,
          },
          {
            $lookup: {
              from: "roles",
              let: {
                roles: "$businessRoleMap.roles",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $in: ["$_id", "$$roles"],
                        },
                        {
                          $eq: ["$name", "Sales Person"],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "roles",
            },
          },
          {
            $unwind: "$roles",
          },
          {
            $group: {
              _id: "$_id",
              name: {
                $first: "$name",
              },
            },
          },
        ],
        (error, resp) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          if (resp) {
            resolve(resp);
          }
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.changeSelectedBusiness = async (req, res) => {
  try {
    let businessRoleMap = JSON.parse(JSON.stringify(req.user.businessRoleMap));
    businessRoleMap.forEach(
      (x) => (x.selected = x.business === req.query.business ? true : false)
    );
    User.findByIdAndUpdate(
      req.user._id,
      { $set: { businessRoleMap: businessRoleMap } },
      { new: true },
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
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.addAddressInUser = async (req, res) => {
  try {
    addAddressValidate(req.body)
      .then((result) => addAddress(req.body))
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
  }
};

const addAddress = async (body) =>
  new Promise((resolve, reject) => {
    try {
      queryObjForUser(body).then((result) =>
        User.findOneAndUpdate(
          result,
          {
            $push: {
              address: body.address,
            },
          },
          { new: true },
          (_err_usr, res_usr) => {
            if (_err_usr) {
              reject(_err_usr);
            }

            if (res_usr) {
              resolve(res_usr);
            }
          }
        )
      );
    } catch (e) {
      reject(e);
    }
  });

exports.sendOtp = async (req, res) => {
  try {
    let otp = "1234"; // Math.floor(1000 + Math.random() * 9000);;
    sendOtpValidate(req.body)
      .then((result) =>
        findOneByQuery({
          query: { phone: req.body.phone },
        })
      )
      .then((result) => {
        if (result) {
          return updateOtpInUser({ ...req.body, otp: otp });
        } else {
          return createNewUserWithMobile({ ...req.body, otp: otp });
        }
      })
      .then((result) => res.status(200).json({ otp: otp }))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
  }
};

const updateOtpInUser = (body) =>
  new Promise((resolve, reject) => {
    generateBcrypt(body.otp)
      .then((result) => {
        let obj = {
          otp: result.hashCode,
          createdAt: new Date(),
        };
        return User.findOneAndUpdate(
          { phone: body.phone },
          { $set: { otp: obj } },
          { new: true }
        ).exec();
      })
      .then((result) => resolve(result))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });

const createNewUserWithMobile = (body) =>
  new Promise((resolve, reject) => {
    try {
      let otpHash;
      generateBcrypt(body.otp)
        .then((result) => {
          otpHash = result.hashCode;
          return fetchRoleByName("User");
        })
        .then((result) => {
          let obj = {
            name: body.phone,
            phone: body.phone,
            password: "1234", // Math.random().toString(36).substring(2, 10).toUpperCase(),
            businessRoleMap: [
              {
                business: body.business,
                roles: [result._id],
                selected: true,
              },
            ],
            otp: {
              otp: otpHash,
              createdAt: new Date(),
            },
            active: true,
          };
          let user = User(obj);
          return user.save();
        })
        .then((result) => resolve(result))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (e) {
      console.error(e);
      return res.status(500).json(e);
    }
  });

const generateBcrypt = async (key) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(key.toString(), salt, (error, hash) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        if (hash) {
          resolve({ hashCode: hash });
        } else {
          reject({ message: "Unable to hash given password" });
        }
      });
    });
  });

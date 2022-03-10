var DeviceToken = require("../models/device-token");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    DeviceToken.findOneAndUpdate(
      {
        user: req.user._id,
        token: req.body.token,
        platform: req.body.platform,
        experienceId: req.body.experienceId,
      },
      {
        $set: {
          user: req.user._id,
          token: req.body.token,
          platform: req.body.platform,
          experienceId: req.body.experienceId,
        },
      },
      { upsert: true, new: true },
      (error, response) => {
        if (error) {
          return error;
        }
        return response;
      }
    );
    // let device = new DeviceToken({
    //   user: req.user._id,
    //   token: req.body.token,
    //   platform: req.body.platform,
    //   experienceId: req.body.experienceId,
    // });
    // device.save((error, response) => {
    //   if (error) {
    //     console.error(error);
    //     return res.status(500).json(error);
    //   }
    //   return res.status(200).json(response);
    // });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.remove = async (req, res) => {
  try {
    DeviceToken.findOneAndDelete(
      { token: req.body.token },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        return res.status(200).json(response);
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.findDeviceTokenByUser = async (user) =>
  new Promise((resolve, reject) => {
    try {
      DeviceToken.findOne(
        { user: mongoose.Types.ObjectId(user) },
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          resolve(response);
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

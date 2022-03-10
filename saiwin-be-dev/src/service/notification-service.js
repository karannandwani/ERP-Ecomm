var admin = require("firebase-admin");
const deviceToken = require("../models/device-token");
const { ecommerceEvent, notificationEvent } = require("../utils/event-util");
const { Expo } = require("expo-server-sdk");
const Notification = require("../models/notification");

exports.notificationInit = async () => {
  notificationEvent.setMaxListeners(0);
};

let expo = new Expo({
  accessToken:
    process.env.EXPO_ACCESS_TOKEN || "9WFSTx2Fz_w0Z5eIGptxAEiImXHnencutZttkBao",
});

exports.sendNotification = async (message, users) => {
  try {
    saveNotification(
      {
        data: {
          operation: message.operation,
          navigation: message.navigation ? message.navigation : "",
          _id: message._id ? message._id : "",
          facility: message.facility ? message.facility : "",
          type: message.type ? message.type : "",
        },
        notification: {
          body: message.message,
          title: message.message,
        },
      },
      users
    );
    deviceToken.find({ user: { $in: users } }, (er, response) => {
      if (er) {
        console.error(er);
      }
      if (response) {
        let notificationForWeb = response
          .filter((x) => x.platform === "web")
          .map((x) => x.token);
        if (notificationForWeb && notificationForWeb.length > 0) {
          sendNotificationForWeb(notificationForWeb, message);
        }
        let notificationForMobile = response.filter((x) => x.platform != "web");
        if (notificationForMobile && notificationForMobile.length > 0) {
          sendNotificationForMobile(notificationForMobile, message);
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const sendNotificationForWeb = async (deviceTokens, message) => {
  try {
    admin
      .messaging()
      .sendToDevice(
        deviceTokens,
        {
          data: {
            operation: message.operation,
            navigation: message.navigation ? message.navigation : "",
            _id: message._id ? message._id : "",
            facility: message.facility ? message.facility : "",
            type: message.type ? message.type : "",
          },
          notification: {
            body: message.message,
            title: message.message,
          },
        },
        {}
      )
      .then(
        (result) => {
          // console.log(result);
          // console.log(result);
        },
        (error) => {
          console.error(error);
        }
      );
  } catch (e) {
    console.error(e);
  }
};

const sendNotificationForMobile = async (deviceTokens, message) => {
  try {
    let messages = deviceTokens.map((x) => ({
      to: x.token,
      body: message.message,
      sound: "default",
      experienceId: x.experienceId,
      data: {
        operation: message.operation,
        navigation: message.navigation ? message.navigation : "",
        _id: message._id ? message._id : "",
        facility: message.facility ? message.facility : "",
        type: message.type,
      },
    }));
    expo.sendPushNotificationsAsync(messages).then(
      (result) => {
        // console.log(result);
      },
      (error) => console.error(error)
    );
  } catch (e) {
    console.error(e);
  }
};

const saveNotification = async (data, users) => {
  let obj = Notification({
    data: data,
    users: users,
    sentToUsers: users,
  });
  obj.save((e, r) => {
    if (r) {
      notificationEvent.emit("raised", r);
    }
  });
};

exports.fetch = async (req, res) => {
  try {
    Notification.find({ users: req.user._id }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      if (response && response.length > 0) {
        Notification.updateMany(
          { _id: { $in: response.map((x) => x._id) } },
          { $pull: { users: req.user._id } }
        ).then(
          (result) => {
            console.log(result);
            return res
              .status(200)
              .json(new Set(response.map((x) => x.data?.data?.operation)));
          },
          (error) => {
            console.error(error);
            return res.status(500).json(error);
          }
        );
      } else {
        const x = setTimeout(() => {
          notificationEvent.removeListener("raised", listener);
          if (!res.writableEnded)
            try {
              res.status(200).json([]);
            } catch (e) {
              // ignore
            }
        }, 30000);
        const listener = (data) => {
          Notification.findOneAndUpdate(
            { _id: data._id },
            { $pull: { users: req.user._id } }
          ).exec();
          clearTimeout(x);
          try {
            return res.status(200).json([data.data.data.operation]);
          } catch (e) {
            // ignore
          }
        };
        notificationEvent.on("raised", listener);
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

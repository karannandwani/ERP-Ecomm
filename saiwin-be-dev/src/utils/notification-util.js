var admin = require("firebase-admin");
var serviceAccount = require("../config/biziedge-firebase-adminsdk.json");
const { findDeviceTokenByUser } = require("../service/device-token-service");

exports.notificationInit = async () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://biziedge-b9a84-default-rtdb.firebaseio.com",
    });
  } catch (e) {
    console.error(e);
  }
};

exports.notify = async (channel, data) => {
  try {
    publishForDevice();
    publishForWeb();
  } catch (e) {
    console.error(e);
  }
};

const publishForWeb = async (channel, data) => {
  try {
    admin
      .messaging()
      .sendToTopic(
        `user-${channel}`,
        {
          data: JSON.stringify(data.response),
          notification: {
            body: data.message,
            title: data.title,
          },
        },
        {}
      )
      .then((result) => {
        console.log(`Notified  to user-${channel}`);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (e) {
    console.error(e);
  }
};

const publishForDevice = async (channel, data) => {
  try {
    findDeviceTokenByUser(channel)
      .then((result) => {
        if (result) {
          admin
            .messaging()
            .sendToDevice(
              result.token,
              {
                data: {
                  title: data.title,
                  message: data.message,
                },
              },
              {}
            )
            .then((response) => {
              console.log(`Notified to device ${result}`);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
};

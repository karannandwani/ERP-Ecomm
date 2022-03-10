import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import firebase from "firebase";

const initialState = null;
const deviceToken = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DEVICE_TOKEN":
      registerForPushNotificationsAsync()
        .then((data) => {
          action.asyncDispatch({
            type: "SAVE_DEVICE_TOKEN",
            payload: {
              request: {
                url: "api/device",
                method: "POST",
                data: data,
              },
            },
          });
          return data;
        })
        .catch((error) => {
          console.error(error);
          return null;
        });
      return state;

    case "SAVE_DEVICE_TOKEN":
      return action.payload.request.data;

    case "LOGOUT":
      action.asyncDispatch({
        type: "REMOVE_DEVICE_TOKEN_BE",
        payload: {
          request: {
            url: "api/device",
            method: "DELETE",
            data: {
              token: state?.token,
            },
          },
        },
      });
      return null;

    default:
      return state;
  }
};

const registerForPushNotificationsAsync = async () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === "web") {
      firebase
        .messaging()
        .getToken({
          vapidKey:
            "BATHHBcMnaIs13C_ufqCGEEpW26UO05YjMQ_0ealVik1qJaBg4JNAuimKtNTbYJtaq_buobkDQL_e90-xZpZDtk",
        })
        .then(
          (result) => {
            resolve({
              platform: Platform.OS,
              token: result,
            });
          },
          (error) => console.error(error)
        );
    } else {
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          reject("Failed to get push token for push notification!");
          return;
        }
        if (Platform.OS === "android") {
          Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        Notifications.addNotificationResponseReceivedListener((event) => {
          // if (event.request.content.data.action)
          // store.dispatch(event.request.content.data.action);
        });
        Notifications.addNotificationsDroppedListener(() => {
          alert("notification Dropped");
        });
        Notifications.getExpoPushTokenAsync({
          experienceId: "@yoctotta/biziedge-ui",
        }).then(
          (result) => {
            resolve({
              platform: Platform.OS,
              token: result.data,
              experienceId: "@yoctotta/biziedge-ui",
            });
          },
          (error) => {
            reject(error);
            console.error(error);
          }
        );
      } else {
        reject("Must use physical device for Push Notifications");
      }
    }
  });

export default deviceToken;

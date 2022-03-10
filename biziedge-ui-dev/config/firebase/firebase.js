import React from "react";
import firebase from "firebase/app";
import "firebase/messaging";
import { useState } from "react";

var firebaseConfig = {
  apiKey: "AIzaSyDzTgI2oC1ml2UC5_c3fuFKfP43hKzCZOM",
  authDomain: "biziedge-b9a84.firebaseapp.com",
  databaseURL: "https://biziedge-b9a84-default-rtdb.firebaseio.com",
  projectId: "biziedge-b9a84",
  storageBucket: "biziedge-b9a84.appspot.com",
  messagingSenderId: "239023915742",
  appId: "1:239023915742:web:9c5e690aca9187e28cf84f",
  measurementId: "G-TNH2WCR33Q",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });

export const getToken = async (setTokenFound) => {
  try {
    const currentToken = await messaging.getToken({
      vapidKey:
        "BATHHBcMnaIs13C_ufqCGEEpW26UO05YjMQ_0ealVik1qJaBg4JNAuimKtNTbYJtaq_buobkDQL_e90-xZpZDtk",
    });
    if (currentToken) {
      // console.log("current token for client: ", currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      setTokenFound(false);
      // shows on the UI that permission is required
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const Firebase = () => {
  const [isTokenFound, setTokenFound] = useState(false);
  // getToken(setTokenFound);
  return <></>;
};

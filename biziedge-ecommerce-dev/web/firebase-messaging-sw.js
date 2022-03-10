importScripts("https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDzTgI2oC1ml2UC5_c3fuFKfP43hKzCZOM",
  authDomain: "biziedge-b9a84.firebaseapp.com",
  projectId: "biziedge-b9a84",
  storageBucket: "biziedge-b9a84.appspot.com",
  messagingSenderId: "239023915742",
  appId: "1:239023915742:web:9c5e690aca9187e28cf84f",
  measurementId: "G-TNH2WCR33Q",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.clients
    .matchAll({
      includeUncontrolled: true,
      type: "window",
    })
    .then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage(payload);
      }
    });

  self.registration.showNotification(notificationTitle, notificationOptions);
});

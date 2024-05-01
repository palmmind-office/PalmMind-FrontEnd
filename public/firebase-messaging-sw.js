
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
// importScripts('/__/firebase/init.js');

  firebase.initializeApp({
    apiKey: "AIzaSyCsbgc_kp3tUFQ4qpDbOTGvmvhRAJEqHSM",
    authDomain: "pushnotification-1e30f.firebaseapp.com",
    databaseURL: "https://pushnotification-1e30f.firebaseio.com",
    projectId: "pushnotification-1e30f",
    storageBucket: "pushnotification-1e30f.appspot.com",
    messagingSenderId: "490919369447",
    appId: "1:490919369447:web:af67d09e63a0263437e042",
    measurementId: "G-34EHE7B982"
  });

const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function (payload) {
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notification = JSON.parse(payload.data.notification);
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: notification.body,
        icon: "images/icons/palmmind.png",
        data:notification.click_action,
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  // console.log("click",event.notification.data);
  clients.openWindow(event.notification.data,"_blank");
}, false);
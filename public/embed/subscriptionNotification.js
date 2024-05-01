import { cookie } from "../js/general/cookie";
import { env } from "../env"
import firebase from 'firebase/app';
import 'firebase/messaging';

if (window.requestIdleCallback) {
  requestIdleCallback(function () {
    fingerprint()
  })
} else {
  setTimeout(function () {
    fingerprint()
  }, 500)
}

let client;
let fingerprints;
let details;
let tokenElement = document.getElementById("token");

function fingerprint() {
  client = new ClientJS();
  fingerprints = client.getFingerprint();
  details = {
    browser: client.getBrowser(),
    os: client.getOS(),
    osVersion: client.getOSVersion(),
    device: client.getDevice(),
    deviceType: client.getDeviceType(),
    deviceVendor: client.getDeviceVendor(),
    cpu: client.getCPU()
  };
}

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

function closeWindow() {
  window.open('', '_parent', '');
  window.close();
}


// Get user registration token
export function getUserToken() {
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
    let messaging = firebase.messaging();

    // Register a service worker to use script with github pages. As firebase required to store serviceWorker only in the root.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("../firebase-messaging-sw.js")
        .then(function (registration) {
          messaging.getToken(messaging, {
            vapidKey: 'BKpTvOreKY6M4vca8Qy1GfLda9seP0BaWFnkFaGvstDRknLfwDuTRHNPS8te28IP1Imm9LvZm0Q3GJwz7NuCDQg',
            serviceWorkerRegistration: registration
          }).then((currentToken) => {
            if (currentToken) {
              sendSubscriptionToServer(currentToken, fingerprints, details);
            } else {
              // Show permission request.
              console.log('No registration token available. Request permission to generate one.');
            }
          }).catch((err) => {
            console.log(err)
            messaging
              .getToken()
              .then(function (refreshedToken) {
                sendSubscriptionToServer(refreshedToken, fingerprints, details)
              })
              .catch(function (err) {
                console.log('An error occurred while retrieving token. ', err);
              });

          });
        })
        .catch(function (err) {
          console.log("Service worker registration failed, error:", err);
        });
    } else {
      messaging
        .getToken()
        .then(function (refreshedToken) {
          sendSubscriptionToServer(refreshedToken, fingerprints, details)
        })
        .catch(function (err) {
          console.log(err, "ajhdfvah dfh")
        });
    }

    messaging.onMessage(function (payload) {
      console.log('Message received. ', payload);
    });


    messaging.onTokenRefresh(function () {
      messaging
        .getToken()
        .then(function (refreshedToken) {
          tokenElement.innerHTML = "Token is " + refreshedToken;
          sendSubscriptionToServer(refreshedToken, fingerprints, details)
        })
        .catch(function (err) {
          errorElement.innerHTML = "Error: " + err;
        });
    });

    function sendSubscriptionToServer(token, fingerprints, details) {
      try {
        let pushedURL = `${env.protocol}://${env.server}:${env.port}${env.basePath}pushnotification/suscribe`
        let visitorId = cookie.getCookie('uniqueID');
        $.ajax({
          url: pushedURL,
          type: "POST",
          data: {
            'token': token,
            'visitor_id': visitorId,
            'fingerprint': fingerprints,
            'details': JSON.stringify(details)
          },
          cache: false
        }).then(async (data) => {
          return data
        }).catch((error) => {
          throw new Error(error)

        });
      } catch (error) {
        console.log(error, "Response push notifications")
      }

    }
  } else {
    console.log('This browser does not support Firebase Messaging');
  }
}


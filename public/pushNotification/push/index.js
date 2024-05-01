import { cookie } from "../../js/general/cookie";
import { renderHtml } from "./html.render";
import { env } from "../../env"

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

$(document).ready(function () {
  let pushnotification = {
    init: function () {
      this.notifyMe();
    },
    prvateoption: function () {
      let section = $('#pushnotification');
      $(`<p style="float:left">Chrome is currently blocking notifications.<br>Please follow these instructions to subscribe:</p>`).appendTo(section);
      let imag = $(`<img src="img/Unblock-Chrome.png">`).appendTo(section);
      let footer = $(` <footer class="footer">
          <button id="unblocked-cancel" class="align-right secondary popup-button">Cancel</button>
          </footer>`).appendTo(section);
      $(`#unblocked-cancel`).click(function () {
        closeWindow();
      })
    },
    renderlayout: async function () {
      let section = $('#pushnotification');
      let sectiondiv = $(`<div class="row"></div>`).appendTo(section);
      renderHtml.allowPushNotifications(sectiondiv)
      await renderHtml.footer(section)
      $(`#unblocked-allow`).click(async function () {
        initFirebaseMessagingRegistration();
      })
      $(`#unblocked-cancel`).click(function () {
        closeWindow();
      })
      $(`#un-suscribe-notifications`).click(async function () {
        await renderHtml.unsuscribe()
        setTimeout(() => {
          window.top.close();
        }, 1000);
      })

    },
    notifyMe: function () {

      if (
        !('Notification' in window &&
            'serviceWorker' in navigator &&
            'localStorage' in window &&
            'fetch' in window &&
            'postMessage' in window)
    ) {
        if (!('Notification' in window)) {
            console.error('Notification not supported');
        } else if (!('serviceWorker' in navigator)) {
            console.error('ServiceWorker not supported');
        } else if (!('localStorage' in window)) {
            console.error('LocalStorage not supported');
        } else if (!('fetch' in window)) {
            console.error('fetch not supported');
        } else if (!('postMessage' in window)) {
            console.error('postMessage not supported');
        }
    
        console.warn('This browser does not support push-notifications.');
        console.log('Is HTTPS', window.location.protocol === 'https:');
        console.log('Support Notification', 'Notification' in window);
        console.log('Support ServiceWorker', 'serviceWorker' in navigator);
        console.log('Support LocalStorage', 'localStorage' in window);
        console.log('Support fetch', 'fetch' in window);
        console.log('Support postMessage', 'postMessage' in window);
    } 
    else {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.renderlayout();
        } else {
          this.prvateoption();
        }
    });
    }
    }
  }
  pushnotification.init();
});



var messaging = firebase.messaging();

function initFirebaseMessagingRegistration() {
  getUserToken()
}


// Get user registration token
function getUserToken() {
  // Register a service worker to use script with github pages. As firebase required to store serviceWorker only in the root.
  if ("serviceWorker" in navigator) {
      navigator.serviceWorker
          .register("../../firebase-messaging-sw.js")
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
  }else{
    messaging
    .getToken()
    .then(function (refreshedToken) {
      sendSubscriptionToServer(refreshedToken, fingerprints, details)
    })
    .catch(function (err) {
     console.log(err,"ajhdfvah dfh")
    });
  }
}

messaging.onMessage(function (payload) {

  console.log('Message received. ', payload);

  // In case if need to show notification even for current focused tab of your page
  // payload.data.data = JSON.parse(JSON.stringify(payload.data));
  // navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {

  //   const notification = JSON.parse(payload.data.notification);
  //   const notificationTitle = notification.title;
  //   const notificationOptions = {
  //       body: notification.body,
  //       icon: "images/icons/palmmind.png",
  //       data:notification.click_action,
  //   };
  //     registration.showNotification(
  //       notificationTitle,
  //       notificationOptions
  //     )
  // });
  // var notificationElement = document.getElementById("notification");
  // // console.log("Message received. ", JSON.stringify(payload)+ 'and' +payload.data.notification);
  // notificationElement.innerHTML = notificationElement.innerHTML + " " + payload.data.notification;
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
  let tokenElement = document.getElementById("token");
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
      tokenElement.innerHTML = `<div class="alert alert-success" role="alert">Thanks for your suscription</div>`;

      await renderHtml.getVistor()
    }).catch((error) => {
      throw new Error(error)

    });
  } catch (error) {
    // console.log(error,"Response push notifications")
    tokenElement.innerHTML = `<div class="alert alert-success" role="alert">Failed to suscribe</div>`;
  } finally {
    setTimeout(() => {
      window.top.close();
    }, 1000);
  }

}
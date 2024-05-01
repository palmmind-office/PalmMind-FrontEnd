import { env, cookieExpire } from "../../env";
import { socketModule } from "../core/socket";
import { cookie } from "../general/cookie";

export const facebookModule = {
  init: function () {
    /**
     * @description facebook login initialization
     */
    window.fbAsyncInit = function () {
      FB.init({
        appId: `${env.facebook_app_id}`,
        cookie: true,
        xfbml: true,
        version: "v15.0",
      });

      /**
       * @description  check user session and refresh it
       */
      FB.getLoginStatus((response) => {
        if (response.status === "connected") {
          FB.api("me?fields=id,name,email", function (response) {
            if (response && !response.error) {
              // console.log(response);
              localStorage.setItem("userName", response.name);
              cookie.setCookie("userName", response.name, cookieExpire);
              socketModule.messageSend("home");
            }
          });
        } else {
          console.log("user not authorized");
        }
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },
  login: function () {
    FB.login(function () {
      FB.getLoginStatus((response) => {
        if (response.status === "connected") {
          FB.api("me?fields=id,name,email", function (response) {
            if (response && !response.error) {
              // console.log(response);
              localStorage.setItem("userName", response.name);
              socketModule.messageSend("home");
            }
          });
        } else {
          console.log("user not authorized");
        }
      }),
      {
        scope: "email,public_profile",
        return_scopes: true,
      };
    });
  },
};

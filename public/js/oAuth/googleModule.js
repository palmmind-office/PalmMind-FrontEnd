import { env, cookieExpire } from "../../env";
import jwt_decode from "jwt-decode";
import { cookie } from "../general/cookie";
import { PostInterest } from "../sharedService/postService";
export const googleModule = {
  init: function () {
    /**
     * @description Google login initialization
     */
    window.onload = () => {
      google.accounts.id.initialize({
        client_id: `${env.google_client_id}`,
        callback: this.handleCredentialResponse, // Using arrow function to retain 'this'
      });
    };
  },
  // decode response from google login
  handleCredentialResponse: async function (response) {
    const { email, name, picture } = jwt_decode(response.credential);
    localStorage.setItem("userName", name);
    cookie.setCookie("userName", name, cookieExpire);
    sessionStorage.setItem("userName", name)
    // socketModule.messageSend("menu");
    window.parent.postMessage({ type: "googleAuth" }, env.parentUrl);
    let visitorId = cookie.getCookie("uniqueID");
    let source = env.botsource;
    let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}user/userInterest`;
    let lead = {
      fullname: name,
      email: email,
      profile_pic:picture,
      visitorId: visitorId,
      source: source,
      interest: "Google Login",
    };
    PostInterest(url, lead);
  },
  signInWithGoogle: function () {
    try{
      const options = {
        prompt: "select_account",
        scope: ['email', 'profile'],
      };
    
      google.accounts.id.prompt(options, (response) => {
        handleCredentialResponse(response);
      });
    }
    catch(error){
      console.log("Google Auth Called.");
    }
    
  },
  renderBtn: function () {
    google.accounts.id.renderButton(document.getElementById("buttonDiv"), {});
  },
  
};



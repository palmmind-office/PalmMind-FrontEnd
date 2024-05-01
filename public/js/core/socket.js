import { cookie } from "../general/cookie";
import { sandBox } from "../sharedService/sandBoxModule";
import { cookieExpire } from "../../env";
import { env } from "../../env";
import { LoadingModule } from "../general/loading";
import { sessionstorage } from "../general/sessionstorage";
import { contentRender } from "../sharedService/content-render";
import {renderPreviousConvo } from "./bootHelperFunctions";
import { decryptData } from "../general/encriptDecriptData";
import { getDeviceInfo } from "../general/getClientInfo";
import { ClientJS } from "clientjs";
import { FadeBackModal as ModalPop } from "../sharedService/modal-render";
import { googleAnalytics } from "../general/googleAnalytics";

export var socketModule = {
  socket: null,
  livechat: false,
  excludeRenderMsg: env.excludeRender,
  visited_link: '',
  visitorDetails: {},
  init: async function (url) {

    this.socket = this.socket || io.connect(url, {
      query: {
        token: env.socket_token,
      },
    });

    this.visited_link = window.location.search;
    let web_link = new URLSearchParams(this.visited_link).get("link");
    let visitorCredentials = new URLSearchParams(this.visited_link).get("visitorCredentials");
    let origin = new URLSearchParams(this.visited_link).get("baseURL");
    env.parentUrl = origin

    if (visitorCredentials && visitorCredentials.length > 0) {
      visitorCredentials = decryptData(visitorCredentials) || '';
      try {
        visitorCredentials = JSON.parse(visitorCredentials) || {}
      } catch (error) {
        visitorCredentials = {}
      }
      this.visitorDetails = visitorCredentials
    }

    if (web_link) {
      web_link = decryptData(web_link)
    }
    this.visitorDetails = { ...this.visitorDetails, origin: origin }
    let uniqueID = this.getUniqueId();
    this.uniqueID = uniqueID;
    this.socket.on("connect", async () => {
      this.socket.emit("user:join", this.uniqueID, "all", "User", env.botsource || 'web', this.visitorDetails, async (value) => {
        if (!value) {
          return null;
        }
        if(value && value.hasOwnProperty('engagedWith')){
          this.livechat=true
          let exitfn = function () {
            renderPreviousConvo(this.uniqueID)
            return
          }
          let continueFN = function () {
            this.livechat = false
            renderPreviousConvo(this.uniqueID)
            this.socket.emit("message:sent", {text:"Greet", payload:"greet"}, { source: env.botsource || 'web'})
            return
          }
          const BODY_TEXT = `Do you want to end this livechat session with ${value.engagedWith}?`;
          ModalPop(continueFN, exitfn, BODY_TEXT, this)
          return
        }
        renderPreviousConvo(this.uniqueID,value)
      
        this.deviceInfo = await getDeviceInfo();
        googleAnalytics.recordUrl({
          'web_link': web_link || env.parentUrl,
        })
        this.socket.emit("user:setData", {
          location: this.deviceInfo.location || null,
          latitude: this.deviceInfo.latitude || null,
          longitude: this.deviceInfo.longitude || null,
          browserInfo: this.deviceInfo.browserInfo || null,
          osInfo: this.deviceInfo.osInfo || null,
          newLink: web_link || env.parentUrl
        })
      });
    });
  },

  getUniqueId: function () {
    if (this.uniqueID) {
      return this.uniqueID
    }
    let visitorId = new URLSearchParams(this.visited_link).get("visitorId");
    visitorId = visitorId ? decryptData(visitorId) : this.getNewCookie();
    if (visitorId) {
      cookie.setCookie("uniqueID", visitorId, cookieExpire);
      return visitorId
    }
    if (cookie.isCookieExists("uniqueID")) {
      if (cookie.getCookie("uniqueID") === visitorId) {
        return cookie.getCookie("uniqueID")
      } else {
        cookie.setCookie("uniqueID", visitorId, cookieExpire);
        return visitorId;
      }
    }
    const uniqueID = visitorId;
    cookie.setCookie("uniqueID", uniqueID, cookieExpire);
    return uniqueID;
  },
  checkconnection: function (message) {
    let status = true;
    if (status) {
      $("#autosuggest").html("");
      if (message === "menu") {
        // ---- here code for show menu
      }
      else {
        sandBox.showModules();
        sandBox.clearAllModules();
      }
      if (!this.livechat) {
        LoadingModule.init("#message-input-module");
      }

      // for socket message send
      if ($.trim(message) == "") {
        return false;
      }

      const title = typeof message === 'string' ? message : (message.text || message.title);
      const payload = message.payload || title;
      const attachment = message.attachment;

      if (payload === "human" && !this.livechat) {
        this.socket.emit("livechat:request");
        LoadingModule.clear();
      } else {
        this.socket.emit("message:sent", { text: title, payload, attachment });
      }
    } else {
      $.notify(env.internetConnection, "warn");
      return false;
    }
  },

  messageSend: function (message, attachment, prev = false) {
    sandBox.clearAllModules()
    if ($(`#botinitialised .detailcontainer`)) {
      $(`#botinitialised .detailcontainer`).remove();
    }
    message = {
      type: "userMessage",
      text: message.text || message.title || message,
      payload: message.payload || message.data,
      attachment
    };
    this.checkconnection(message);
    if (!prev) {
      sessionstorage.concateMessage("previousMessage", message);
    }
    $(".message-input input").val(null);

  },

  renderMessage: function (message) {
    console.log(message, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    const { type, text: title } = typeof message === 'string' ? { text: message } : message;
    if (type === "webProductDetails") {
      $(`<li class="replies" id="repliesID"><img id="repliesImg" src="${env.clientimg}"alt="" /><p id="repliesPara">
            <span><b>${message.title}</b></span><br/>
            <span>${message.brand}</span><br/>
            <span>${message.model}</span><br/>
            <span>${message.price}</span><br/><br />
            <img src="${message.image}" alt="image" style="width: 100%;margin:unset;border-radius:22px;" />
            </p></li>
          `).appendTo($(".message-section ul"));
      LoadingModule.clear();
    } else if (this.excludeRenderMsg.indexOf(message) < 0) {
      const urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.,~#?&//=]*)$/g;
      let text;
      let link = message && message.payload ? message.payload.split(" ").join("%20") : message.split(" ").join("%20");
      switch (type) {
        case "image":
          text = `<a href=${link} target="_blank"><img src=${link} style="width: 100%;margin:unset;border-radius:22px;" /></a>`;
          break;
        // case "video":
        //   text = `<video controls src=${link} style="width: 100%; padding-right:14px;margin:unset;border-radius:22px;" />`;
        //   break;
        case "audio":
          text = `<audio controls src=${link} style="width: 100%;margin:unset;border-radius:22px;" />`;
          break;
        default:
          let messageText = message && message.payload ? message.payload : message;
          text = messageText.split(" ").map(piece => piece.match(urlRegex) ?
            `<a href=${piece} style="word-break:break-all;color:yellow;text-decoration:underline!important;" target="_blank">${piece}</a>` : piece).join(" ")
      }
      $(
        '<li class="replies" id="repliesID"><img id="repliesImg" src=' +
        env.clientimg +
        ` alt="" /><p id="repliesPara" ${message.type === 'audio' ? 'style="width:100% !important;"' : ''}>` +
        text +
        "</p></li>"
      ).appendTo($(".message-section ul"));
      $(".contact.active .preview").html("<span>You: </span>" + text);
    }

    $(".messages").animate(
      {
        scrollTop: $("#message-module")[0].scrollHeight,
      },
      "fast"
    );
  },

  sideEffects(message) {
    const { type } = message;
    switch (type) {
      case 'livechatStarted':
        this.livechat = true;
        break;
      case 'livechatEnded':
        this.livechat = false;
        break;
    }
  },

  onMessageReceived(message, metadata) {
    message.agent_Name =  metadata ? metadata.name : "Agent";
    message.hasOwnProperty('isform') ? $("#context").attr('disabled', 'true') : $("#context").removeAttr('disabled', 'true')
    if (metadata && metadata.sender && metadata.sender.toString() === this.uniqueID.toString()) {
      sandBox.clearAllModules()
      if (message.text && !message.formMessageSection && !message.attachment) {
        console.log("1")
        this.renderMessage(message.text);
      }
      if (message.attachment) {
        console.log("2")
        this.renderMessage(message.attachment);
      }
      return;
    }
    
    try {
      if(message && message.hasOwnProperty('request_live_chat')){
        LoadingModule.clear();
        return this.socket.emit("message:sent",{text:"Live chat Request",payload:"livechat:request:sales" })
      
      }
      if (message.hasOwnProperty("prevUtter")) {
        if (message.prevUtter === false) {
          LoadingModule.clear(true);
        }
        if (message.prevUtter != false) {
          LoadingModule.clear();
        }
      } else {
        LoadingModule.clear();
      }
      this.sideEffects(message)
      contentRender(message);
    } catch (err) {
      console.log(err);
    }
  },

  getNewCookie: function () {
    const client = new ClientJS();
    let uniqueId = client.getFingerprint();
    return uniqueId
  }
};

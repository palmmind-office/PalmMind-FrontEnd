import { cookie } from "../js/general/cookie";
const uuidv1 = require("uuid/v1");
import { env, cookieExpire } from "../env";
import { decryptData, encryptData } from "../js/general/encriptDecriptData";
import { playSound } from "./notification";

class Visitor {
  constructor($palmBot, $baseUrl, $appendButtonWebpage, embed) {
    this.assetURL = env.protocol + "://" + env.server + ":" + env.port;
    this.getUniqueId();
    this.baseUrl = $baseUrl;
    this.botEventUrl = $baseUrl;
    this.palmBot = $palmBot;
    this.showBot = false;
    this.botLoaded = false;
    this.notificationCount = 0;
    this.getEventFromBot();
    this.removeParamsFromURL = ["keys", "query", "botIframe", "removeByTag", "removeByClassName", "removeById"];
    (this.appendButtonWebpage = $appendButtonWebpage), (this.embed = embed);
  }

  sendEventToBot(iframeprop, roundBtn) {
    this.iframeprop = iframeprop;
    this.roundBtn = roundBtn;
  }

  resetNotification() {
    this.notificationCount = 0;
    if ($("#d1box .badge")) {
      $("#d1box .badge").remove();
      $("#d1box .notificationEmbed").remove();
    }
  }

  getEventFromBot() {
    window.addEventListener("message", async (event) => {
      if (event.origin === this.botEventUrl) {
        let message = event.data;
        if (!this.showBot) {
          this.notificationCount = !this.showBot && message.isCount ? this.notificationCount + 1 : 0;
          this.activeAgent = event.data.type !== "activeAgents" ? "" : event.data.data;
          if (this.activeAgent.length > 0) {
            $("#activeAgentContainer") && $("#activeAgentContainer").remove();
            this.activeAgentContainer = $(
              `<div id="activeAgentContainer"><p>Our agents are active now. Let's get connected <i style="font-size:24px" class="fa" id="connectBtn">&#xf0a9;</i></p></div>`
            ).appendTo(this.roundBtn);
            $("#crossBtn") && $("#crossBtn").remove();
            this.crossButton = $(`<i class="fa" id="crossBtn">&#xf00d;</i>`).appendTo(this.activeAgentContainer);
            this.crossButton.on("click", (event) => {
              event.stopPropagation();
              $("#crossBtn").remove();
              $("#activeAgentContainer").remove();
            });
            this.activeAgentContainer.on("click", () => {
              let requestAccept = {
                title: "Talk to Live Agent",
                payload: "livechat:request:all",
                type: "activeAgents",
              };
              this.iframeprop.contentWindow.postMessage(requestAccept, this.botEventUrl);
            });
          }
          if (this.notificationCount > 0) {
            playSound("get");
            let text =
              event.data.type !== "livechatIncomingRequest"
                ? ""
                : event.data.data.message
                ? event.data.data.message
                : event.data.data.text;
            let message =
              event.data.data.type !== "agentMessage"
                ? ""
                : event.data.data.attachment
                ? `${event.data.data.agent_Name ? event.data.data.agent_Name : "Live Agent"} sent you an attachment`
                : event.data.data.text;
            let intervene =
              event.data.data.type !== "livechatStarted"
                ? ""
                : event.data.data.message
                ? event.data.data.message
                : event.data.data.text;
            let agentName = event.data.type !== "livechatIncomingRequest" ? "" : event.data.data.agentName;
            if (
              event.data.type === "livechatIncomingRequest" ||
              event.data.data.type === "agentMessage" ||
              event.data.type === "livechatStarted"
            ) {
              $("#d1box .badge").remove();
              $("#d1box .notificationEmbed").remove();
              this.notificationMessage = $(`<div class="notificationEmbed"> 
          <div class="notificationEmbedMessage"> 
          <p class="embedPara">${text || message || intervene}</p>
          </div>
          <div id="buttonDivConvo"><button type="button" id="buttonConversation">${
            text ? `Talk to ${agentName}` : message || intervene ? `Go to Conversation` : ""
          }</button></div>
          <div id="notificationReply">
          <div id="inputReply"><input type="text" placeholder="Reply..." /><span class="embedSend"><i class="fa fa-paper-plane"></i></span></div>
          </div>
          </div>`);
              this.notificationMessage.appendTo(this.roundBtn);
            }

            this.Notification = $(`<span class="badge">${this.notificationCount}</span>`);
            this.Notification.appendTo(this.roundBtn);
          }
          if ($(".notificationEmbed").length > 0) {
            $("#crossBtn").remove();
            $("#activeAgentContainer").remove();
          }
        }

        // clear notification embed in case of livechat reject, start or livechat end for all concurrent bot running at once
        if (this.showBot || event.data.type === "livechatRejected" || event.data.type === "livechatExpired") {
          $("#d1box .badge").remove();
          $("#d1box .notificationEmbed").remove();
        }

        if (event.data.type == "googleAnalitics") {
          let obj = event.data.data;
          gtag("event", `${obj.eventAction.title || obj.eventAction || "default_event"}`, {
            event_category: obj.eventCategory || "bot",
            event_label: obj.eventLabel || null,
            event_action: obj.eventAction.title || obj.eventAction || null,
          });
        }

        let payload = event.data.type !== "livechatIncomingRequest" ? "" : event.data.data.buttons[0].payload;
        let title = event.data.type !== "livechatIncomingRequest" ? "" : event.data.data.buttons[0].title;
        if (title && payload) {
          // check if it contains payload for any event
          $(".notificationEmbed").on("click", () => {
            let requestAccept = {
              title: title,
              payload: payload,
              type: "livechatRequestAccept",
            };
            this.iframeprop.contentWindow.postMessage(requestAccept, this.botEventUrl);
          });
        }
      }
    });
  }

  webAppendButtoClicked() {
    let link = location.href;
    let requestAccept = {
      title: "Live chat request(Web Page)",
      payload: "livechat:request:all",
      type: "live-chat-request",
      visitor: this.getUniqueId(),
      link,
    };
    this.iframeprop.contentWindow.postMessage(requestAccept, this.botEventUrl);
  }

  loadBot() {
    let iframe = this.palmBot.getElementsByTagName("iframe")[0];
    const encryptedVisitorId = encryptData(this.getUniqueId());
    const encryptedLink = encryptData(this.getLinkHistory());

    let search = window.location.search;
    let urlp = new URLSearchParams(search);
    let visitorCredentials = urlp.get("keys") || "";
    if (!iframe.src) {
      this.baseUrl = `${this.baseUrl}?visitorId=${encryptedVisitorId}&link=${encryptedLink}&baseURL=${window.location.origin}`;
      if (visitorCredentials && visitorCredentials.length > 0) {
        this.baseUrl = this.baseUrl + `&visitorCredentials=${urlp.get("keys")}`;
      }
      iframe.setAttribute("src", this.baseUrl);
    }
    this.gethistory();
  }

  getLinkHistory() {
    this.visitedUrl = window.location.href;
    let url = new URL(this.visitedUrl);
    for (let param of this.removeParamsFromURL) {
      url.searchParams.delete(param);
    }
    let newUrl = url.toString();
    this.visitedUrl = newUrl;
    return this.visitedUrl;
  }

  gethistory() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.onUrlChange();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  onUrlChange() {
    let link = location.href;
    if (this.iframeprop && this.botEventUrl) {
      let timeFrame = setTimeout(
        function () {
          this.appendButtonWebpage();
          clearTimeout(timeFrame);
        }.bind(this.embed),
        2000
      );
      let url = new URL(link);
      for (let param of this.removeParamsFromURL) {
        url.searchParams.delete(param);
      }
      link = url.toString();
      this.iframeprop.contentWindow.postMessage({ link: link }, this.botEventUrl);
    }
  }

  getUniqueId() {
    const client = new ClientJS();
    let isCookie = client.isCookie();
    if (isCookie && cookie.isCookieExists("webUniqueID")) {
      return cookie.getCookie("webUniqueID");
    }
    if (this.uniqueID) {
      return this.uniqueID;
    }
    this.uniqueID = client.getFingerprint() || uuidv1();

    if (isCookie) {
      cookie.setCookie("webUniqueID", this.uniqueID, cookieExpire);
    }

    return this.uniqueID;
  }
}

export { Visitor };

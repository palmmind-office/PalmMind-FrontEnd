import { loading } from "./assets/loading";
import { env } from "../../env";
import { userList } from "./userList";
import { socketModule } from "./socket.module";
import MessageElement from "./MessageElement";
var moment = require("moment");

/**
 * data: store chat history of a user.
 * userId: used to store id of the particular user.
 *
 */
export var chatHistory = {
  data: [],
  pagination: {
    limit: 1,
    start: 1,
  },
  userId: "",
  id: "",
  resetPagination: function () {
    this.pagination.limit = 1;
    this.pagination.start = 1;
  },
  init: function (id, userId) {
    this.id = id;
    this.userId = userId;
    this.resetPagination();
    this.getChatHistory();
  },
  getChatHistory: function () {
    loading.init("#message-container");
    this.fetchChatHistory()
      .then((data) => {
        this.data = data.data.data.data;
        // console.log("fetched data", this.data);
        this.cacheDOM();
        this.render();
        // this.addReplyClick();
        loading.clear();
      })
      .catch((error) => {
        console.log(error);
        this.data = {};
        loading.clear();
      });
  },
  cacheDOM: function () {
    this.$messageContainer = $("#message-container");
    this.$header = $("#frame .contact-profile p");
  },
  render: function () {
    // $(this.$header[0]).text(`Visitor ${this.userId}`);
    const user = userList.data.find((user) => user.user_id === this.userId);
    let name = user.name;
    if (!name) {
      name = (user.first_name || "") + " " + (user.last_name || "");
    }
    $(this.$header[0]).children().remove();
    $(this.$header[0]).append(
      $(
        `<span>${name.length > 1 ? name : "Visitor"}</span> <span style="${
          name.length > 1 ? "font-size:10px; opacity:0.8" : ""
        }">${user.user_id}</span>`
      )
    );
    this.$messageContainer.find("ul").empty();

    this.data.sort((a,b)=>moment(a.createdDate).diff(b.createdDate)).forEach((element) => {
      const type =
        element.usertype === "human" ? "userMessage" : element.usertype === "bot" ? "botMessage" : "agentMessage";
      const message = { type, text: element.text };
      const metadata = {
        sender: element.senderId || element.userType || "user",
        receipent: socketModule.uniqueID,
        ...(element.metadata ? JSON.parse(element.metadata) : {}),
      };
      metadata.time = element.createdAt || metadata.time;
      MessageElement.render(message, metadata);
    });
    this.initReplyLink();
  },
  initReplyLink: function () {
    // Array.from(document.querySelectorAll("#frame .content .messages ul li span.replied-message")).forEach(
    //   element=>element.removeEventListener("click", eventHandler)
    // );
    $("#frame .content .messages ul li span.replied-message").on("click", (event) => eventHandler(event), {
      once: true,
    });
    const eventHandler = async (event) => {
      const mid = event.target.id;
      if ($(event.target).text() === "hide message") {
        $(event.target).text("see message");
        return $(event.target.parentElement).find(`div#reply___${mid}`).remove();
      }

      const url = `${env.protocol}://${env.server}:${env.port}${env.basePath}chat/messageByMid?mid=${mid}`;
      const response = await fetch(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const { data } = await response.json();
      const messageElement = `<div style='color: gray' id='reply___${mid}'>
                                ${data.count ? data.data[0].text : "message not found"}
                                <span style='font-size: small; display: block; text-align: right; font-weight: bold'>
                                  ${data.count ? data.data[0].senderId : ""}
                                  ${data.count ? moment(data.data[0].createdDate).format("hh:mm, MMM D") : ""}
                                </span>
                              </div>`;
      $(messageElement).appendTo($(event.target.parentElement));
      $(event.target).text("hide message");
    };
  },
  scrollContainer: function () {
    $(".messages").scrollTop(Math.round($(window).height() / 4));
  },
  fetchChatHistory: function () {
    let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}chat/messages?user_id=${this.id}&start=${this.pagination.start}`;
    // console.log("start to fetching chathistory");
    return axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
  },
  scrollChat: function () {
    // console.log("CHAT 117 getChatHistory");
    let id = "#message-container";
    let fetchNext = true;

    //one register event only once.
    let mouseWheelEvent = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
    $(id)
      .off(mouseWheelEvent)
      .on(mouseWheelEvent, (event) => {
        let height = $(id).scrollTop();
        if (height < 1 && fetchNext) {
          fetchNext = false;
          this.pagination.start += this.pagination.limit;
          loading.init("#message-container");
          this.fetchChatHistory()
            .then((data) => {
              // console.log("fetching chathistory", data.data.data.data);
              fetchNext = true;
              this.data = this.data.concat(data.data.data.data);
              loading.clear();
              this.cacheDOM();
              this.render();
              if (data.data.data.data.length) {
                this.scrollContainer();
              }
            })
            .catch((error) => {
              console.log("fell fetching chathistory", error);
              fetchNext = true;
              // loading.clear();
            });
        }
      });
  },
  clear: function () {},
};

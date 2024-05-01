import { chatHistory } from "./chat";
import { env } from "../../env";
import { socketModule } from "./socket.module";
import { loading } from "./assets/loading";
import { LocalStorage } from "./assets/localstorage";
import { sandbox } from "./sandBoxModule";

export var userList = {
  data: [],
  userList: {},
  userId: "",
  source: "web",
  pagination: {
    limit: 1,
    start: 1,
  },
  resetPagination: function () {
    this.pagination.limit = 1;
    this.pagination.start = 1;
  },
  init: async function (source) {
    this.source = source;
    this.resetPagination();
    await this.getUserList();
    this.updateActiveStatus();
    this.scrollUserList();
    chatHistory.scrollChat();
    /*this.bindEvents();*/
    // this.clickRefreshIcon();

    //checked if there is any pending notification.
    sandbox.notify(this.source);
  },
  updateActiveStatus: function () {
    socketModule.socket.emit("livechat:users");
  },
  LogOut: function () {
    let url = `${env.protocol}://${env.dashboardServer}:${env.dashboardPort}${
      env.basePath
    }Users/logout?access_token=${localStorage.getItem("token")}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("chatBotWebVisitor");
        localStorage.removeItem("chatBotFbVisitor");
        window.location.href = `${env.protocol}://${env.server}:${env.port}/chat`;
      })
      .catch((err) => {
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("chatBotWebVisitor");
        localStorage.removeItem("chatBotFbVisitor");
        window.location.href = `${env.protocol}://${env.server}:${env.port}/chat`;
      });
  },
  bindEvents: function () {
    var $userName = $(`<a class="dropdown-item" href="#">${localStorage.getItem("userName")}</a>`);
    var $logout = $(`<a class="dropdown-item" href="#">Logout</a>`);
    $("#header .dropdown-menu").empty();
    $("#header .dropdown-menu").append($userName);
    $("#header .dropdown-menu").append($logout);

    $logout.click(
      function (event) {
        this.LogOut();
      }.bind(this)
    );
  },
  getUserList: async function () {
    loading.init("#contacts");
    const data = await this.fetchUserList();
    try {
      // if (data.statusText !== "OK") {
      //   return null;
      // }
      this.data = data.data.data.data.map((data) => ({ ...data.clientDetails, ...data }));
      delete this.data.clientDetails;
      this.removeUserListDOM();
      this.cacheDOM();
      this.render();
      loading.clear();
    } catch (err) {
      console.log(err);
      if (data.status === 403 || data.status === 401) {
        msg = "Error in user authentication.";
        window.location.href = `${env.protocol}://${env.server}:${env.port}/chat`;
      }
      loading.clear();
    }
  },
  fetchUserList: function () {
    let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}chat/visitors?start=${
      this.pagination.start
    }&source=${this.source}&duration=today&accessToken=${localStorage.getItem("token")}`;
    return axios.get(url);
  },
  cacheDOM: function () {
    if (!this.$container) {
      this.$container = $("#contacts");
    }
    if (!this.$header) {
      this.$header = $("#header");
    }
  },
  render: function (users) {
    // console.log(119,activeUsers,waitingList,active,active.map(x=>waitingList[x.user_id]))
    const statusStyle = { active: "bg-success", passive: "bg-danger" };

    const getUserName = (element) => {
      const name =
        element.name ||
        (element.first_name && element.last_name ? element.first_name + " " + element.last_name || "" : "");

      const displayName = name
        ? `${name} <i style="font-size: 10px; opacity: 0.75;">${element.user_id}</i>`
        : `Visitor ${element.user_id}`;

      return `
      <div class="meta">
        <p class="name" style="display: flex; flex-direction: column; gap:0">${displayName}</p>
      </div>
      <div class="user_status rounded-circle ${statusStyle[element.status]}" style="width:12px; height:12px; margin-bottom:${
        name ? 14 : 0
      }px"></div>
      `;
    };

    const getUserProfile = (element) => {
      return element.profile_pic || "./img/visitor.png";
    };

    const getAgentElement = ({requester, engagedWith}) =>
      `<div class="user_requested" style="width:16px; height:14px; display:flex; margin: 4px;">${
        requester
          ? '<i class="fa fa-clock-o text-danger"></i>'
          : engagedWith
          ? '<i class="fa fa-clock-o text-primary"></i>'
          : ""
      }</div>`;

    const activeUserIds = users ? users.map((user) => user.userId) : [];
    this.data
      .sort((a, b) => activeUserIds.includes(b.user_id) - activeUserIds.includes(a.user_id))
      .forEach((element) => {
        const data = users ? users.find((user) => user.userId === element.user_id) || {} : {};
        element.status = Object.keys(data).length ? "active" : "passive";
        element.engagedWith = data.engagedWith;
        element.requester = data.requester;
        const $li = $(`<li class="contact" id=${element.user_id}>
                <div class="wrap">
                    <img src=${getUserProfile(element)} alt="" />
                    ${getUserName(element)}
                    ${getAgentElement(data)}
                </div>
            </li>`);

        $li.on("click", () => {
          $("#contacts>ul>li").removeClass("active");
          $li.addClass("active");

          const messageInput = $("#message-input-container > div.wrap > input");
          const sendBtn = $("#message-input-container > div.wrap > button.submit");
          const requestBtn = $("#message-input-container > div.wrap > button#request-livechat-button");
          const transferBtn = $("#header-info-container > button#transfer-livechat-button")

          if (element.engagedWith!==socketModule.uniqueID) {
            messageInput.hide();
            sendBtn.attr("disabled", "true");
            transferBtn.attr("disabled", "true");
            requestBtn.show();
          } else {
            messageInput.show();
            sendBtn.removeAttr("disabled");
            transferBtn.removeAttr("disabled");
            requestBtn.hide();
          }

          //remove bell icon once clicked.
          $li.find("#notification").remove();

          const id = `chatBot${this.source[0].toUpperCase() + this.source.slice(1)}Visitor`;

          LocalStorage.removeItem(id, element.user_id);
          sandbox.notify(this.source);

          this.userId = element.user_id;
          chatHistory.init(element.id, element.user_id);
          // socketModule.socket.emit("agent_join", element.user_id);
          if (innerWidth < 426) {
            // to show messages in mobile view
            $("#frame #sidepanel").hide();
            $("#frame .content").show();
          }
        });

        $li.appendTo(this.$container.find("ul")[0]);
      });

    const visId = this.userId;
    // console.log(visId, this.data.map(x=>x.user_id))
    if (this.data.map((x) => x.user_id).includes(visId)) {
      $(`.contact#${visId}`).click();
    } else {
      $(".contact").first().click();
    }
  },

  scrollUserList: function () {
    let id = "#contacts";
    let fetchNext = true;

    //one register event only once.
    let mouseWheelEvent = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";

    $(document).ready(() => {
      $(id)
        .off(mouseWheelEvent)
        .on(mouseWheelEvent, (event) => {
          let elem = $(event.currentTarget);
          if (elem[0].scrollHeight === elem.scrollTop() + elem.outerHeight() && fetchNext) {
            fetchNext = false;
            this.pagination.start += this.pagination.limit;
            loading.init("#contacts");
            this.fetchUserList()
              .then((data) => {
                fetchNext = true;
                loading.clear();
                if (data.data.header.status) {
                  this.data = data.data.data;
                  this.cacheDOM();
                  this.render();
                } else {
                }
              })
              .catch((error) => {
                fetchNext = true;
              });
          }
        });
    });
  },
  clear: function () {
    this.data = {};
    this.resetPagination();
    this.removeUserListDOM();
  },
  removeUserListDOM: function () {
    $("#contacts ul").empty();
  },

  /**
   * add
   * @param {*} message
   */
  addNotificationIcon: function (message) {
    let p = $("#contacts ul li");
    for (let li of p) {
      let text = $(li).find("p").text().trim();
      text = text.split(" ");
      text = text[text.length - 1];

      if (typeof message === "string" && message.trim() === text) {
        let mark = $('<img id="notification" src="./img/notification.png" alt="notification">');
        mark.css({ "z-index": "100" });
        li = $(li);
        li.find(".wrap").prepend(mark);
      }
    }
  },

  /**
     *
     * @param {*} message text message of type string.
     * @param {*} dom jquery dom
     * @return {*} {
            element: '',
            found: false
        }
     */
  getvisitorElement: function (message, dom) {
    let filteredElement = {
      element: [],
      found: false,
    };

    for (let li of dom) {
      let text = $(li).find("p").text().trim();
      text = text.split(" ");
      text = text[text.length - 1];

      if (typeof message === "string" && message.trim() === text) {
        filteredElement.element.push($(li));
        filteredElement.found = true;
        break;
      } else if (typeof message === "object" && Array.isArray(message)) {
        if (message.indexOf(text) > -1) {
          filteredElement.element.push($(li));
          filteredElement.found = true;
        }
      }
    }

    return filteredElement;
  },

  /**
   * Called when user click refresh icon on left panel.
   */
  // clickRefreshIcon: function() {
  //   let $notification = $("#profile .wrap .notification");
  //   $notification.unbind().click(function(event) {
  //     sandbox.notifyVisitor();
  //   }.bind(this));
  // }
};

import { userList } from "./userList";
import { toaster } from "./toasterModule";
import { socketModule } from "./socket.module";
import { env } from "../../env";
import { sandbox } from "./sandBoxModule";
import { updateStatus } from "../updateStatus";
import MessageElement from "./MessageElement";

function boot() {
  getAgentDetails();
  fetchOrganizationDetail();
  if (!localStorage.getItem("token")) {
    window.location.href = `${env.protocol}://${env.server}:${env.port}/chat`;
  }
  //connecting socket with socket server running this port 9009
  let socketUrl = `${env.protocol}://${env.server}:${env.port}`;
  socketModule.init(socketUrl);

  function isUserEngaged(userId) {
    const user = userList.data.find((element) => element.user_id === userId);
    return user && user.engagedWith === socketModule.uniqueID;
  }

  function newMessage() {
    // console.log("main 25 new message")
    let namespace = userList.userId;
    let message = $(".message-input input").val();

    if (!isUserEngaged(namespace)) {
      return toaster.init("User is not engaged with you", "message-input-container", 1000, true);
    }

    //send message to bot (emit)
    socketModule.messageSend(message, null, namespace);
  }

  function getAgentDetails() {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    fetch(`${env.protocol}://${env.server}:${env.port}/rest/v1/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        const $name = $(`<span class="OrgName">${data.firstname} ${data.lastname}</span>`);
        localStorage.setItem("category", data.role);
        $("#logout").append($name);
        $("#toggle-event").bootstrapToggle(data.availability ? "On" : "Off");
      });
  }

  function fetchOrganizationDetail() {
    fetch(`${env.protocol}://${env.server}:${env.port}/rest/v1/Organization`)
      .then((res) => res.json())
      .then((data) => {
        let $OrganizationName = $(`<h3>Last 24 Hours<span class="badge badge-secondary">${data.data.name}</span></h3>`);
        $("#OrganizationName").append($OrganizationName);
      });
  }

  function highLightBtn(dom) {
    $("#source-container button").removeClass("active");
    $(dom).addClass("active");
  }

  $(".submit").on("click", function () {
    newMessage();
  });

  async function onHumanExit() {
    socketModule.socket.emit("livechat:end");
  }

  $("#humanExit").on("click", async function () {
    const visId = userList.userId;
    isUserEngaged(visId) ? await onHumanExit(visId) : toaster.init("User is not active", "header", 1000);
  });

  $(async function () {
    await updateStatus(true);
    socketModule.socket.emit("user:setStatus", "active");
    $("#toggle-event").on("change", async function () {
      const newStatus = $(this).prop("checked");
      await updateStatus(newStatus);
      if (!newStatus) {
        const visId = userList.userId;
        isUserEngaged(visId) && (await onHumanExit(visId));
      }
    });
    $(".toggle-sidebar").on("click", function () {
      $("#frame #sidepanel").toggle();
      $("#frame .content").toggle();
    });
    $("#message-input-container > div.wrap > button#request-livechat-button").on("click", function () {
      const visId = userList.userId;
      const currentUser = userList.data.find((element) => element.user_id === visId);
      if (!currentUser || currentUser.status !== "active") {
        return toaster.init("User is not connected", "header", 3000);
      }
      if (currentUser.requester) {
        return toaster.init(`Already requested`, "header", 3000);
      }
      if (!$("#toggle-event").prop("checked")) {
        return toaster.init(`Availability is Off`, "header", 3000);
      }
      socketModule.socket.emit("livechat:request", visId);
    });
    $("#header-info-container > button#transfer-livechat-button").on("click", function () {
      const visId = userList.userId;
      if (!isUserEngaged(visId)) {
        return toaster.init("User is not engaged with you", "header", 3000);
      }
      bootbox.prompt("Agent Username to Trasnfer", function (username) {
        if (!username) {
          toaster.init("Username is required", "header", 1000);
        }
        return socketModule.socket.emit("livechat:transfer", visId, username);
      });
    });
  });

  $("#PowerOff").on("click", async () => {
    bootbox.confirm("Do You want to LogOut ?", async function (result) {
      if (result == true) {
        userList.LogOut();
        updateStatus(false);
        const visId = userList.userId;
        isUserEngaged(visId) && (await onHumanExit(visId));
      }
    });
  });

  $("#source-container button").on("click", async function () {
    const type = this.id;
    userList.clear();
    await userList.init(type);
    highLightBtn(this);
    sandbox.notifyVisitor(`chatBot${type[0].toUpperCase() + type.slice(1)}Visitor`);
    $(this).find(".badge").text("");
  });

  $(window).on("keydown", function (e) {
    if (e.which == 13) {
      newMessage();
      return false;
    }
  });
  //get form bot(listion)
  socketModule.socket.on(
    "message:received",
    function ({ type, text, payload, ...rest }, { sender, source, time, receipent, mid }) {
      console.log("MESSAGE RECEIVED");
      console.table({ type, text, payload, ...rest });
      console.table({ sender, source, time, receipent });
      MessageElement.render({ type, text, ...rest }, { sender, source, time, receipent, mid });
      userList.userId === sender &&
        $(".messages").animate({ scrollTop: $("#message-container ul")[0].scrollHeight }, "fast");
    }
  );
  let booted = false;
  socketModule.socket.on("livechat:users", (users) => {
    userList.removeUserListDOM();
    const connectedUsers = users.filter((user) => user.role === "User");
    userList.render(users);
    if (!booted && connectedUsers.length) {
      toaster.init(`There are ${connectedUsers.length} connected users.`, "header", 3000);
      booted = true;
    }
  });
  socketModule.socket.on("disconnect", async function () {
    console.log("DISCONNECTED");
    // bootbox.confirm("Connection lost. Refresh?", (result) => {
    //   result && window.location.reload();
    // });
  });
}

(async function () {
  boot();
  await userList.init("web");
  $("#source-container button").removeClass("active");
  $("#source-container .web").addClass("active");
})();

import { userList } from "./userList";
import { toaster } from "./toasterModule";
import { socketModule } from "./socket.module";
import moment from "moment";

export default {
  data: {
    agentMessage: {
      avatar: "./img/boy.png",
      styles: "background: #4588d0; color: white",
    },
    userMessage: {
      avatar: "./img/visitor.png",
      styles: "background: white; color: black",
    },
    userMessageLive: {
      avatar: "./img/visitor.png",
      styles: "background: #60935D",
    },
    botMessage: {
      avatar: "./img/robot.jpg",
      styles: "background: #435F7A",
    },
  },

  sourceName: {
    fb: "Facebook",
    instagram: "Instagram",
    web: "Web",
  },

  render({ type, text, ...rest }, { sender, source, time, receipent, mid }) {
    source = source || "web";
    switch (type) {
      case "userMessage":
        this.userMessage(text, sender, receipent, source, time, mid);
        break;
      case "agentMessage":
        this.agentMessage(text, sender, receipent, source, time);
        break;
      case "botMessage":
        this.botMessage(text, sender, receipent, time);
        break;
      case "livechatIncomingRequest":
        bootbox.confirm(text, (result) => {
          socketModule.socket.emit("message:sent", rest.buttons[result ? 0 : 1]);
        });
        break;
      default:
        console.log(text);
        toaster.init(text, "header", 5000);
    }
  },

  renderNewMessage(content, sender, mid = "", time = Date.now(), type = "agentMessage") {
    const dateStr = moment(time).format("hh:mm, MMM D");
    const { avatar, styles } = this.data[type];
    const senderName = sender === socketModule.uniqueID ? "You" : sender;
    const className = type === "agentMessage" ? "replies" : "sent";
    $(
      ` <li class="${className}" id="${mid}">
            <img src="${avatar}" alt="${type}"/>
            <p style="${styles}"><strong>${senderName}</strong><span> ${dateStr}</span><br>${content}</p>
        </li>`
    ).appendTo($(".messages ul"));
    $(".message-input input").val(null);
    $(".contact.active .preview").html("<span>You: </span>" + content);
  },

  userMessage(text, sender, receipent, source, time, mid) {
    if (userList.userId === sender) {
      const type = receipent === socketModule.uniqueID ? "userMessageLive" : "userMessage";
      this.renderNewMessage(text, sender, mid || "", time, type);
    } else if (userList.source === source) {
      userList.addNotificationIcon(sender);
    } else {
      const message = `User ${sender} in ${this.sourceName[source] || "Unknown"} channel sent a message`;
      toaster.init(message, "header", 3000);
    }
  },

  agentMessage(text, sender, receipent, source, time) {
    if (userList.userId === receipent) {
      this.renderNewMessage(text, sender, "", time);
    } else if (userList.source === source) {
      userList.addNotificationIcon(receipent);
    } else {
      const channel = this.sourceName[source] || "Unknown";
      const message = `Agent ${sender} sent a message to User ${receipent} in ${channel} channel`;
      toaster.init(message, "header", 3000);
    }
  },

  botMessage(text, sender, receipent, time) {
    if (userList.userId === receipent) {
      this.renderNewMessage(text, sender, "", time, "botMessage");
    }
  },
};

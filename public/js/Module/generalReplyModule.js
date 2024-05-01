import { socketModule } from "../core/socket";
import { env } from "../../env";
import moment from "moment";

export var generalReplyModule = {
  data: "",
  init: function (data) {
    if (typeof data === "object" && data !== null) {
      this.data = data.message || data.text || data.title ||  "";
      this.attachment = data.attachment || {}
    } else {
      this.data = data;
    }

    this.cacheDOM();
    this.render(data);
  },
  cacheDOM: function () {
    // this.$parentElem = $('#message-module .message-section ul');
    this.$parentElem = $("#message-module .message-section ul:first");
  },
  scrollBottom: function () {
    $(".messages").animate(
      {
        scrollTop: $("#message-module")[0].scrollHeight,
      },
      "fast"
    );
  },
  render: function (data) {
    // let splitedMessage = this.data.split(" ")
    // const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    // let regex = new RegExp(expression);
    const urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;

    // let text=''
    // for (let element of splitedMessage) {
    // let match = element.match(regex); 
    // if(match){
    //   text += ` <a href="${element}" ;
    // }else{
    //        text += ' '+element;
    //   }

    // }
    console.log(this.data, ">>>>>>")
    const text = this.data && this.data.split(" ").map(piece => piece.match(urlRegex) ?
      `<a href=${piece} style="word-break:break-all;color:blue;text-decoration:underline!important;" target="_blank">${piece}</a>` : piece).join(" ")

    this.renderElem = $(
      `<li class="sent"><img id="utterImage" src=${env.Orgimg} alt="" />`
    );
    if (text) {
      $(`<p id="utterPara"><span style="color: ${data.type==="agentMessage" ? "#1C77BB":"#1C77BB"};font-weight: 800;">${data.type==="agentMessage" ? `${data.agent_Name}` : `${env.botName}`}</span> ${text}<span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p></li>`).appendTo(this.renderElem);
    } else {
      $(`</li>`).appendTo(this.renderElem);
    }

    this.attachElem = null;

    if (this.attachment && this.attachment.type === 'file') {
      this.attachElem = $(`<p id="utterPara" style="margin-top:unset;"><span style="color: ${data.type==="agentMessage" ? "#1C77BB":"#1C77BB"};font-weight: 800;">${data.type==="agentMessage" ? `${data.agent_Name}` : `${env.botName}`}</span><a href="${this.attachment.payload}" target="_blank">${this.attachment.payload.split("/").at(-1).split("-").at(-1)}</a><span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p>`); 
    } 
    else if (this.attachment && this.attachment.type === 'audio') {
      this.attachElem = $(`<p id="utterPara" style="margin-top:unset;width:100%;"><span style="color: ${data.type === "agentMessage" ? "#1C77BB" : "#1C77BB"};font-weight: 800;">${data.type === "agentMessage" ? `${data.agent_Name}` : `${env.botName}`}</span><audio controls src=${this.attachment.payload} style="width: 100%; padding-right:14px;margin:unset;border-radius:22px;" /><span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p>`);
    }
    else if (this.attachment && this.attachment.type === 'video') {
      this.attachElem = $(`<p id="utterPara" style="margin-top:unset;"><span style="color: ${data.type === "agentMessage" ? "#1C77BB" : "#1C77BB"};font-weight: 800;">${data.type === "agentMessage" ? `${data.agent_Name}` : `${env.botName}`}</span><video controls src=${this.attachment.payload} style="width: 100%; padding-right:14px;margin:unset;border-radius:22px;" /><span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p>`);
    }
    else if (this.attachment && this.attachment.type && this.attachment.type.length) {
      this.attachElem = this.attachment.type === 'image' ? $(`<p id="utterPara" style="margin-top:unset;"><span style="color: ${data.type==="agentMessage" ? "#1C77BB":"#1C77BB"};font-weight: 800;">${data.type==="agentMessage" ? `${data.agent_Name}` : `${env.botName}`}</span><a href="${this.attachment.payload}" target="_blank"><img src="${this.attachment.payload}" style="width:100%;height:100%;border-radius: 10px;" /></a><span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p>`):this.attachment.type;
    }

    if (this.attachElem) {
      this.renderElem.append(this.attachElem)
    }

    this.renderElem.appendTo(this.$parentElem);
    this.scrollBottom();
    $(".contact.active .preview").html("<span>You: </span>" + this.data);
    // socketModule.socket.emit('message', this.data);
  },
};

export var generalReplywithBackButton = {
  data: "",
  init: function (data) {
    if (typeof data === "object" && data !== null) {
      this.data = data.message || "";
    } else {
      this.data = data;
    }

    this.cacheDOM();
    this.render();
  },
  cacheDOM: function () {
    this.$parentElem = $("#message-module .message-section ul");
  },
  scrollBottom: function () {
    $(".messages").animate(
      {
        scrollTop: $("#message-module")[0].scrollHeight,
      },
      "fast"
    );
  },
  render: function () {
    $("#error_button").remove();
    this.renderElem = $('<li class="sent"><img src=' + env.Orgimg + ' alt="" /><p>' + this.data + "</p></li>");
    this.renderElem.appendTo(this.$parentElem);
    this.scrollBottom();
    $(".contact.active .preview").html("<span>You: </span>" + this.data);
    socketModule.socket.emit("message", this.data);
    setTimeout(function () {
      socketModule.messageSend("menu");
    }, 3000);
  },
  clear: function () {
    if (this.buttonElem) {
      this.buttonElem.remove();
    }
  },
};

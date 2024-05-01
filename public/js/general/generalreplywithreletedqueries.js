import { socketModule } from "../core/socket";
import { env } from "../../env";

export var generalreplywithreletedqueries = {
  data: "",
  init: function (data) {
    this.data = data;
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
    this.renderElem = $(
      '<li class="sent"><img src=' + env.Orgimg + ' alt="" /></li>'
    );
    let ptag = $(`<p style="display: flow-root;"></p>`).appendTo(
      this.renderElem
    );
    let div = $(`<div class="general_reply"></div>`).appendTo(ptag);
    this.data.title.forEach((element) => {
      let title = $(
        `<span style="margin:0">${this.data.title}</span>`
      ).appendTo(div);
    });

    if (this.data.hasOwnProperty("link")) {
      this.data.link.forEach((ele) => {
        let link =
          $(`<span style="margin:0;display: block;overflow: hidden; color: #0069D9;font-size: 11px;text-decoration: underline;">
                 ${ele.title}</span>`).appendTo(div);
        link.click(
          function () {
            const payload = ele.payload;
            let payloads = { title: ele.title, payload: payload };
            if (payload === undefined) {
              window.open(ele.link, "_blank");
            } else {
              socketModule.messageSend(payloads);
            }
          }.bind(this)
        );
      });
    }

    if (this.data.hasOwnProperty("button")) {
      let btn = $(`<div class=btn></div>`).appendTo(div);
      this.data.button.forEach((ele) => {
        let button = $(`<button>
                 ${ele.title}</button>`).appendTo(btn);
        button.click(
          function () {
            let payload = ele.payload;
            let payloads = { title: ele.title, payload: payload };
            let link = ele.link;
            if (payload === undefined) {
              window.open(ele.link, "_blank");
            } else {
              socketModule.messageSend(payloads);
            }
          }.bind(this)
        );
      });
    }

    if (this.data.hasOwnProperty("reletedqueries")) {
      let ul = $("<ol/>");
      ul.css({ padding: "0", margin: "20px 0px" });
      let subtitle = $(
        `<h6 class="animated flipInY">${this.data.reletedqueries.title}</h6>`
      ).appendTo(ul);
      this.data.reletedqueries.queries.forEach((element) => {
        let li = $("<li/>").appendTo(ul);
        li.css({ margin: "5px 0 0 0 " });
        let a = $("<div/>").appendTo(li);
        let b = $(`<div class="ico" style="display:flex"></div>`).appendTo(a);
        let ico = $(
          `<i class="fa fa-search" style="font-size:11px"></i>`
        ).appendTo(b);
        let text = $(`<span>${element.title}</span>`).appendTo(b);
        // li.hover(function() {
        //     $(this).css({"color":"aqua","cursor":"pointer"})
        //   })
        li.click(() => {
          let payload = element.payload;
          if (payload) {
            socketModule.messageSend(payload);
          }
        }).bind(this);
      });
      this.scrollBottom();
      ul.appendTo(div);
    }

    this.renderElem.appendTo(this.$parentElem);
    this.scrollBottom();
    $(".contact.active .preview").html("<span>You: </span>" + this.data);
    socketModule.socket.emit("message", this.data);
  },
};

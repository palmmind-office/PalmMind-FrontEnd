import { socketModule } from "../core/socket";
// import { formLeadModule } from "../Module/formLeadModule";
import { genericTable } from "./genericTableModule";
import { googleAnalytics } from "../general/googleAnalytics";
import { catagoriesContext } from "../Module/catagoriesContext";
import { renderPreviousButton } from "../sharedService/renderPrevButton";
import { env } from "../../env";
import moment from "moment";

/**
 * Module to Support multiple title.
 */
export var multipleTitle = {
  init: function (data) {
    this.data = data;
    console.log("here is the data", data);
    this.cacheDOM();
    this.render();

  },
  cacheDOM: function () {
    this.$message = $("#message-module");
    this.$parentElem = this.$message.find(".message-section").find("ul");
  },
  scrollBottom: function () {
    $(".messages").animate(
      {
        scrollTop: $("#message-module")[0].scrollHeight,
      },
      "fast"
    );
  },
  generateDOM: function (tag, attribute, css, text) {
    let $dom = $(tag);
    attribute && $dom.attr(attribute);
    css && $dom.css(css);
    text && $dom.html(text);
    return $dom;
  },
  render: function () {
    let textData = Array.isArray(this.data.title)
      ? {
        type: "array",
        data: this.data.title,
      }
      : {
        type: "string",
        data: this.data.title,
      };

    if (textData.type === "string") {
      let node = $(
        `<li class="sent sending"><img id="utterImage" src="${env.Orgimg}" alt=""><p id="utterPara" style="margin-bottom:5px;">${textData.data}</p></li>`
      );
      node.css({
        padding: "10px 0",
      });
      node.appendTo(this.$parentElem);
    }

    if (textData.type === "array") {
      let counter = 0;
      let intervalId = setInterval(() => {
        if (counter >= textData.data.length) {
          clearInterval(intervalId);
          this.renderButton();
          return;
        }
        let text = textData.data[counter];
        if (typeof text === "string") {
          let node = $(
            `<li class="sent sending"><img id="utterImage" src="${env.Orgimg}" alt=""><p id="utterPara" style="margin-bottom:5px;"><span style="text-decoration: none; margin-left: 0; color: #1C77BB; font-weight: 800; pointer-events: none;">${env.botName}</span> ${text}<span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p></li>`
          );
          node.appendTo(this.$parentElem);
        } else if (typeof text === "object") {
          let node = $(
            `<li class="sent sending" style="margin-bottom: -10px;"><img id="utterImage" src="${env.Orgimg}" alt="" style="margin-top: -1px;"></li>`
          );
          let $div = $("<div></div>");
          $div.css({
            "display":"grid",
            "overflow": "hidden",
            "margin-bottom": "20px",
            "position": "relative",
            "background": "#9e9e9e24",
            "max-width": "42vh",
            "color": "#000",
            "font-size": "13px",
            "border-radius": "22px",
            "font-family": "'Lato', sans-serif",
            "animation": "opactyblinkleft",
            "animation-duration": "1s"
          });
          $div.appendTo(node);
          text.title.forEach((title) => {
            let $li = $(`<li><span style="text-decoration: none; margin-left: 0; color: #1C77BB; font-weight: 800; pointer-events: none;">${env.botName}</span>${title}<span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></li>`);
            $li.css({
              "word-spacing": "unset"
            })
            $li.appendTo($div);
            if (text.hasOwnProperty("listItem")) {
              let ul = $("<div/>");
              text.listItem.forEach((element) => {
                let li = $(
                  `<li><i class="fa fa-chevron-circle-right" style="font-size: 15px;"></i></li>`
                ).appendTo(ul);
                let a = $(
                  `<a href="#" class="Litem">${element.title}</a>`
                ).appendTo(li);
                // console.log("element.title",element.title)
                let ico = $(``).appendTo(a);
                if (element.type === "payload") {
                  a.addClass("listitempayload");
                }
                if (element.type === "link") {
                  a.addClass("listitemlink");
                }
                li.click(() => {
                  let payload1 = {
                    title: element.title,
                    payload: element.payload,
                  };
                  // console.log("payload1",payload1)
                  let link = element.link;
                  if (link) {
                    window.open(link, "_blank");
                  } else if (payload1) {
                    // console.log("0203 multiple", payload1);
                    socketModule.messageSend(payload1);
                  } else {
                    return false;
                  }
                });
                li.css({
                  float: "left",
                  display: "block",
                  "font-size": "15px",
                  margin: "2px",
                });
              });
              ul.appendTo($li);
              ul.css({
                float: "left",
                display: "contents",
              });
            }
            if (text.hasOwnProperty("link")) {
              $li.addClass("link");
              let link1 = text.link;
              let link = $(`<i class="fa fa-arrow-right"></i>`).appendTo($div);
              link.css({
                position: "absolute",
                top: "9px",
                bottom: "0",
                right: "0",
                cursor: "pointer",
                "font-size": "13px",
              });
              $li.click(function () {
                window.open(link1, "_blank");
              });
            }
          });
          node.appendTo(this.$parentElem);
        }
        $(".message-section li.sending span").click(function () {
          window.open($(this).text(), "_blank");
        });
        this.scrollBottom();
        counter++;
      }, 1000);
    }

  },

  // for submenu
  renderButton: function () {

    if (this.$container) {
      this.$container.remove();

    }
    if (this.data.hasOwnProperty("submenu")) {
      let contents = [];
      if (Array.isArray(this.data.submenu)) {
        contents = this.data.submenu;
      } else if (Array.isArray(this.data.submenu.contents)) {
        contents = this.data.submenu.contents;
      }
      if (contents && contents.length) {
        this.$frameContainer = $("#message-module");
        this.$container = $(`<div class="menu" style="display:flex;justify-content:center;"></div>`);
        this.$container.appendTo(this.$frameContainer);
        this.$menuContainer = $(
          `<div class="submenu-container-c"></div>`
        );
        contents.forEach((element, index) => {
          let $c = $(`<div class="submenu container"></div>`);
          let $d = $(
            `<div><img src="${element.icon}" alt="Image not found"><span style="margin: auto; class="text" value="${element.title}">${element.title}</span></div>`
          );
          $d.appendTo($c);
          $c.appendTo(this.$menuContainer);

          $c.on(
            "click",
            function (event) {
              let payload01 = {
                title: element.title,
                payload: element.payload,
              };
              if (payload01) {
                socketModule.messageSend(payload01);
                this.clear();
              }
              if (element.payload == undefined) {
                let link = element.link;
                // window.open(link, '_blank');
                window.open(link);
              }
              console.log("GA4 happened")
              googleAnalytics.recordEvent({
                eventCategory: Element.title,
                eventAction: payload01,
              });
            }.bind(this)
          );
        });

        this.$menuContainer.appendTo(this.$container);
        this.$container.appendTo(this.$message);
        renderPreviousButton.init();
      }
      this.scrollBottom();
      // this.clear();

    }
    if (this.data.hasOwnProperty("iconbutton")) {
      let contents = [];
      if (Array.isArray(this.data.iconbutton)) {
        contents = this.data.iconbutton;
      } else if (Array.isArray(this.data.iconbutton.contents)) {
        contents = this.data.iconbutton.contents;
      }

      if (contents && contents.length) {
        // console.log("contents", contents);
        this.$container = $(`<div id="quick_reply" style="margin-top:5px;"></div>`);
        let $ul = $("<ul/>");
        contents.forEach((element) => {
          let $li = $("<li/>").appendTo($ul);
          let a = $(
            '<p class="bot" style="font-size:12px;padding:8px;">'
          ).appendTo($li);
          let b = $('<div class="ico">').text(element.title).appendTo(a);
          let ico = $(element.icon).appendTo(b);
          let payloads = { title: element.title, payload: element.payload };
          // console.log("this is payloads",payloads);
          $li.on(
            "click",
            function (event) {
              console.log("GA4 happened")
              googleAnalytics.recordEvent({
                eventCategory: element.title,
                eventAction: payloads,
              });
              socketModule.messageSend(payloads);
              this.clear();
            }.bind(this)
          );
        });
        $ul.appendTo(this.$container);
        this.$container.appendTo(this.$message);
        renderPreviousButton.init();
      }
      this.scrollBottom();
    }
    // for form
    if (this.data.hasOwnProperty("formModule")) {
      //  formLeadModule.init(this.data.formModule);
      this.scrollBottom();
    }

    if (this.data.hasOwnProperty("catagoriesContext")) {
      catagoriesContext.init(this.data.catagoriesContext);
      this.scrollBottom();
    }

    if (this.data.hasOwnProperty("innercontenttab")) {
      let contents = [];
      if (Array.isArray(this.data.innercontenttab)) {
        contents = this.data.innercontenttab;
      } else if (Array.isArray(this.data.innercontenttab.contents)) {
        contents = this.data.innercontenttab.contents;
      }

      if (contents && contents.length) {
        this.$container = $(`<div id="innercontenttab"></div>`);
        let $ul = $("<ul/>");
        contents.forEach((element) => {
          let $li = $("<li/>").appendTo($ul);
          $("<a/>").text(element.title).appendTo($li);

          let payloade = { title: element.title, payload: element.payload };
          // console.log("this is payloade",payloade);
          $li.on(
            "click",
            function (event) {
              console.log("GA4 happened")
              googleAnalytics.recordEvent({
                eventCategory: element.title,
                eventAction: payloade,
              });
              socketModule.messageSend(payloade);
              this.clear();
            }.bind(this)
          );
        });
        $ul.appendTo(this.$container);
        this.$container.appendTo(this.$message);
      }
      this.scrollBottom();
    }

    if (this.data.hasOwnProperty("table")) {
      genericTable.init(this.data.table);
      this.scrollBottom();
    }
    //    for button
    if (this.data.hasOwnProperty("button")) {
      let contents = [];
      if (Array.isArray(this.data.button)) {
        contents = this.data.button;
      } else if (Array.isArray(this.data.button.contents)) {
        contents = this.data.button.contents;
      }

      if (contents && contents.length) {
        this.$container = $(
          `<div id="quick_reply" style="margin:12px 0px ;"></div>`
        );
        let $ul = $("<ul/>");
        contents.forEach((element) => {
          let $li = $("<li/>").appendTo($ul);
          $li.addClass("mb-5");
          $("<a/>").text(element.title).appendTo($li);

          let payloadd = { title: element.title, payload: element.payload };
          // console.log("this is payloadd",payloadd);
          let link = element.link;
          $li.on(
            "click",
            function (event) {
              console.log("GA4 happened")
              googleAnalytics.recordEvent({
                eventCategory: element.title,
                eventAction: payloadd,
              });
              if (element.payload === undefined) {
                window.open(element.link, "_blank");
              } else {
                socketModule.messageSend(payloadd);
              }
            }.bind(this)
          );
        });
        $ul.appendTo(this.$container);
        this.$container.appendTo(this.$message);
        this.scrollBottom();
        renderPreviousButton.init();
      }
    }
  },
  clear: function () {
    if (this.$container) {
      this.$container.remove();
    }

  },
  hideContainer: function () {
    if ($container) {
      this.$container.hide();
    }
  },
};

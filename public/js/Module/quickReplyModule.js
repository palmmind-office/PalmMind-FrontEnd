import { socketModule } from "../core/socket";
import { googleAnalytics } from "../general/googleAnalytics";
import { env } from "../../env";
import moment from "moment";


class QuickReplyModule1 {
    constructor() {
        this.data = {};
        this.init = function (data) {
            this.data = data;
            // console.log(this.data, "QuickReplyModule1");
            if (this.data.fallback == "exist") {
                // console.log("fallback exist");
                socketModule.messageSend("human4Live");
            }
            let type = data.catagoriesContext;
            this.cacheDOM();
            this.render();
            this.bindEvents();
            this.related(type);
        };
        this.cacheDOM = function () {
            this.$message = $("#message-module");
        };
        this.scrollBottom = function () {
            $(".messages").animate(
                {
                    scrollTop: $("#message-module")[0].scrollHeight,
                },
                "fast"
            );
        };
        this.render = function () {
            // console.log(parent.document, ">>>>>>>>>>>>>>>>>>")
            // $("#palmbot", parent.document).css({
            //     width: "100%",
            //   });
            if (this.$container) {
                this.$container.remove();
            }
            this.$container = $(`<div id="quick_reply" style="margin-top: 20px"></div>`);
            let renderTextNode = Array.isArray(this.data.title)
                ? this.data.title.length > 0
                : this.data.title;
            if (renderTextNode) {
                const urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
                let parentElem = this.$message
                    .find(".message-section")
                    .find("ul")
                const textURL = this.data.title.split(" ").map(piece => piece.match(urlRegex) ?
                    `<a href=${piece} style="word-break:break-all;color:blue;text-decoration:underline!important;" target="_blank">${piece}</a>` : piece).join(" ")
                let text = Array.isArray(this.data.title)
                    ? this.data.title.join("<br>")
                    : this.data.title;
                let li = $(`<img id="sentImage" src="${env.Orgimg}" alt=""><p id="utterPara" style="margin-bottom:5px;"><span style="color: #1C77BB;font-weight: 800;">${env.botName}</span>${textURL ? textURL : text} <span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p>`)
                this.node = $(
                    `<li class="sent"></li>`
                );
                li.appendTo(this.node)
               
                this.node.appendTo(parentElem);
            }
            if (this.data.type === 'audio') {
                let parentElem = this.$message.find(".message-section").find("ul");
                let img = $(`<img id="sentImage" src="${env.Orgimg}" alt="">`);
                let audio = $(`<audio controls src="${this.data.path}" style="width: 100%; margin: unset; border-radius: 22px;"></audio>`); 
                let p = $(`<p style="width:100%;" id="utterPara"></p>`);
                this.node = $(`<li class="sent"></li>`);
                img.appendTo(this.node);
                audio.appendTo(p);
                p.appendTo(this.node);
                this.node.appendTo(parentElem);
            }

            if (!renderTextNode) {
                this.node = $(
                    `<li class="sent"></li>`
                );
                let parentElem = this.$message
                    .find(".message-section")
                    .find("ul");
                this.node.appendTo(parentElem);
            }

            if (this.data.hasOwnProperty('data') && this.data.data.length) {

                this.ul = $("<ul/>");

                this.data.data.forEach(element => {
                    if (element.hasOwnProperty('iframe')) {
                        this.li = $("<li/>").appendTo(this.ul);
                        if (element.hasOwnProperty('icon')) {
                            let a = $('<p class="bot" style="font-size:12px;padding:10px;">').appendTo(this.li);
                            let b = $('<div class="ico">').text(element.title).appendTo(a)
                            if (element.icon && element.icon !== null) {
                                $(`<img src="${element.icon}"/>`).appendTo(b);
                            }

                        } else {
                            this.a = $(`<a data-toggle=modal data-target=#${element.iframe.targetId}></a>`).text(element.title).appendTo(this.li);
                        }

                    } else {
                        this.li = $("<li/>").appendTo(this.ul);
                        this.a = $("<a/>").text(element.title).appendTo(this.li);
                    }
                });
                this.ul.appendTo(this.$container);
            }

            if (renderTextNode || this.data) {
                this.$container.appendTo(this.node);
            }
            this.scrollBottom();
        };
        this.related = function (data) {
            if (data) {
                this.container = $(
                    `<div  id="related_container" class=" ml-2 border border-1 p-1"></div>`
                );
                this.container.css({
                    borderRadius: "15px",
                    backgroundColor: "#D8F7FE",
                });
                let related_Data = $(`<h6 class="pl-3">${data.subtitle}</h6>`);
                related_Data.appendTo(this.container);
                this.ul = $(`<ul class="fa-ul"></ul>`).appendTo(this.container);
                data.data.forEach(element => {
                    this.li = $(
                        `<li class="m-0 pl-1 pb-2 h1 text-mute"><span class="fa-li"><i class="p-1 fa fa-search"></i></span>${element.title}</li>`
                    );
                    this.li.css({
                        fontSize: "13px",
                        color: "#000",
                        cursor: "pointer",
                        margin: "0 0 1px 0 !important",
                    });
                    this.li.appendTo(this.ul);
                    
                    this.li.on("click", function (e) {
                        let $item1 = $(e.target).closest("li");
                        // console.log("this is item",$item1)
                        let index1 = $(".h1").index($item1);
                        // console.log("index",index1)
                        let payload2 = {
                            title: data.data[index1].title,
                            payload: data.data[index1].payload,
                        };
                           console.log("payload",payload2)
                        
                        socketModule.messageSend(payload2);
                    });
                });

                this.container.appendTo(this.$message);
                this.scrollBottom();
            }
        };

        this.clear = function () {
            // this.data = {
            //     title: "",
            //     data: [],
            // };
            // this.render();
            // $("#related_container").remove();
            if (this.$container) {
                this.$container.remove()
            }

        };

        this.bindEvents = function () {
            if (!this.$container) {
                return;
            }
            this.$container.find("ul li").on("click", this.btnClick.bind(this));
            //  this.container.find('ul li').on('click', this.li_click.bind(this))
        };

        this.btnClick = function (event) {
            let $item = $(event.target).closest("li");
            let index = this.$container.find("ul li").index($item);
            if (this.data.data[index].hasOwnProperty('iframe')) {
                //modelBox creating
                let win = $("#frame");
                let detailcontainer = $(`<div class="detailcontainer"></div>`);
                if ($("#botinitialised .detailcontainer")) {
                    $("#botinitialised .detailcontainer").remove();

                    // here starting the code for remove detail container after clicking prev and next button
                    $(".owl-nav .owl-next").on("click", function () {
                        // $('.owl-nav .owl-next').addClass('disabled');
                        detailcontainer.remove();
                    });
                    $(".owl-nav .owl-prev").on("click", function () {
                        // $('.owl-nav .owl-prev').addClass('disabled');
                        detailcontainer.remove();
                    });
                } else {
                    return;
                }
                detailcontainer.appendTo(win);
                let detailheader = $(`<div class="header"></div>`).appendTo(
                    detailcontainer
                );
                let headercon = $(
                    `<h6 class="title">${this.data.data[index].iframe.title}</h6>`
                ).appendTo(detailheader);
                let closeicon = $(
                    `<div><img src="images/menu/minimize.png" style="width:20px;height:20px;margin-top:-14px;cursor:pointer;"/></div>`
                ).appendTo(detailheader);
                closeicon.click(() => {
                    detailcontainer.remove();
                });
                let detailbody = $(` <div class="bodysec"></div>`).appendTo(
                    detailcontainer
                );
                detailbody.css({
                    "height": "100%",
                    "width": "100%"
                })
                if (this.data.data[index].iframe.hasOwnProperty("subtitle")) {
                    $(
                        `<h4 class="subtitle">${this.data.data[index].iframe.subtitle}</h4>`
                    ).appendTo(detailbody);
                }
                if (this.data.data[index].iframe.hasOwnProperty("paragraph")) {
                    let bodycont = $(
                        `<p style="color:#333;">${this.data.data[index].iframe.paragraph}</p>`
                    ).appendTo(detailbody);

                }

                if (this.data.data[index].iframe.hasOwnProperty('link')) {
                    let frameDIv = $(`<div style="height:100%"></div>`)
                    frameDIv.appendTo(detailbody)
                    let frame = $(`<iframe src="${this.data.data[index].iframe.link}" style="width:100%; height:100%; border:none;margin-top:-20px;" title="Iframe Example"></iframe>`);
                    frame.appendTo(frameDIv)
                    socketModule.socket.emit("message:sent", {
                        isLink: true,
                        payload: this.data.data[index].iframe.link,
                        text: this.data.data[index].iframe.title
                    })
                }

            } else {
                let payload1 = {
                    title: this.data.data[index].title,
                    payload: this.data.data[index].payload,
                };
                console.log("payload1>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<", payload1)
                googleAnalytics.recordEvent({
                    eventLabel: this.data.data[index].title,
                    eventAction: "Click",
                    eventCategory: this.data.type,
                });
                if (this.data.hasOwnProperty("fulltimePosition")) {
                    sessionStorage.setItem("positionApplied", "Full time position for " + this.data.data[index].title);
                }
                if (this.data.hasOwnProperty("internPosition")) {
                    sessionStorage.setItem("positionApplied", "Internship for " + this.data.data[index].title);
                }
                //   let payload1=this.data.data[index].payload
                let value = this.data.data[index];
                if (value.payload) {
                    socketModule.messageSend(payload1);
                } else {
                    //window open link
                    let url = value.link;
                    window.open(url, "__blank");
                    socketModule.socket.emit("message:sent", {
                        isLink: true,
                        payload: url,
                        text: this.data.data[index].title
                    })
                    // const a = document.createElement("a");
                    // a.href = url;
                    // a.target = "_blank";
                    // a.download = url.split("/").pop();
                    // document.body.appendChild(a);
                    // a.click();
                    // document.body.removeChild(a);
                }
            }
        };
    }
}

export let quickReplyModule = new QuickReplyModule1();
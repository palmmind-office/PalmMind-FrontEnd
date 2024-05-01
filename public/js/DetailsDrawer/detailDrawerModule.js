import { socketModule } from "../core/socket";
import { shairModule } from "../Services/shairModule";
import { sliderModule } from "../Module/sliderModule";
import { env } from "../../env";
import { PostInterest } from "../sharedService/postService";
import { cookie } from "../general/cookie";
import moment from "moment";
export var Detaildrawer = {
  data: {},
  currentSlide: 0,
  User_data: {},
  formdata: [],
  init: sliderModule.init,
  cacheDOM: sliderModule.cacheDOM,
  scrollBottom: sliderModule.scrollBottom,

  render: function () {
    // $("#palmbot", parent.document).css({
    //   width: "100%",
    // });

    if (this.$container) {
      this.$container.remove();
    }

    let renderTextNode = Array.isArray(this.data.title)
      ? this.data.title.length > 0
      : this.data.title;
    if (renderTextNode) {
      let parentElem = this.$message.find(".message-section").find("ul");
      let text = Array.isArray(this.data.title)
        ? this.data.title.join("<br>")
        : this.data.title;
      let node = $(
        `<li class="sent"><img id="sentImage" src="${env.Orgimg}" alt=""><p id="utterPara" style="margin-bottom:5px;"><span style="color: #1C77BB;font-weight: 800;">${env.botName}</span> ${text} <span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p></li>`
      );
      node.appendTo(parentElem);
    }

    if (this.data.data) {
      this.$frameContainer = $(".message-section");
      this.$container = $(`<div id="detailDrawer"></div>`);
      this.$container.css("font-size", "14px");
      let $owlCarousel = $(`<div class="owl-carousel owl-theme"></div>`);
      this.data.data.forEach((element, index) => {
        //main section
        let $slideContainer = $(`<div class="slide-container"></div>`);
        if (element.hasOwnProperty("img")) {
          let $image = shairModule.generateDOM("<img/>", {
            src: element.img,
            alt: "Loading...",
            class: "slider-image",
          });
          $image.appendTo($slideContainer);
        }



        if (element.hasOwnProperty("title")) {
          let text = Array.isArray(element.title)
            ? element.title.join("<br>")
            : element.title;
          let $h3 = shairModule.generateDOM("<h3/>", {}, {}, text);
          $h3.appendTo($slideContainer);
        }

        if (element.hasOwnProperty("apiData")) {
          let mainDescDiv = $(`<div class="apiDataMain" ></div>`)

          let topHighlight = $(`<div style="display: flex; flex-wrap:wrap;justify-content:space-around;"></div>`)
          let secondRP = $(`<p style="padding:0px;color:#000"><b>NRs. ${element.apiData.price}</b></p>`)
          let textAvailability = $(`<p style="padding:0px;color:#000"><span style="color:green;">●</span> <b>In Stock</b></p>`)

          let Desc = $(`<div style="display: flex; flex-wrap:wrap;justify-content:space-around;margin: 10px 0px 10px 0px;"></div>`)
          let firstLP = $(`<p style="padding:0px;padding-bottom: 10px;"><b style="background:gray; border-radius:20px;padding:5px 10px; color:#fff;font-size:10px;">Model: ${element.apiData.model_number}</b></p>`)
          let secondLP = $(`<p style="padding:0px;padding-bottom: 10px;"><b style="background:gray; border-radius:20px;padding:5px 10px; color:#fff;font-size:10px;">Quantity: ${element.apiData.quantity}</b></p>`)
          let firstRP = $(`<p style="padding:0px;padding-bottom: 10px;"><b style="background:gray; border-radius:20px;padding:5px 10px; color:#fff;font-size:10px;">Brand: ${element.apiData.brand}</b></p>`)

          firstLP.appendTo(Desc)
          firstRP.appendTo(Desc)

          secondLP.appendTo(Desc)
          textAvailability.appendTo(topHighlight)
          secondRP.appendTo(topHighlight)
          topHighlight.appendTo(mainDescDiv)


          Desc.appendTo(mainDescDiv)
          // rightDesc.appendTo(mainDescDiv)
          mainDescDiv.appendTo($slideContainer);

        }

        if (element.hasOwnProperty("subtitle")) {
          let text = Array.isArray(element.subtitle)
            ? element.subtitle.join("<br>")
            : element.subtitle;
          if (text) {
            let $p = shairModule.generateDOM(
              "<p/>",
              { class: "block-with-text" },
              {},
              text
            );
            $p.appendTo($slideContainer);
          }
        }


        if (element.hasOwnProperty("button")) {
          let $btnContainer = shairModule.generateDOM("<div></div>", {
            class: "button-container",
          });
          $btnContainer.css({ "padding-bottom": "10px" });
          element.button.contents.forEach((content, btnIndex) => {
            let target = content.id + "123";

            //modelBox creating
            let $popContainer = $(
              `<div class="popDetailsContainer modal fade" id=${target} aria-hidden="true"></div>`
            );
            let $popdialog = $(
              `<div class="modal-dialog" role="document"></div>`
            ).appendTo($popContainer);
            let $popContent = $(`<div class="modal-content"></div>`).appendTo(
              $popdialog
            );
            let $popheader = $(`<div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span>
                            </button>
                            <h5 class="modal-title" id="exampleModalLongTitle">${content.Details.title}</h5></div>`).appendTo(
              $popContent
            );
            let $modelbody = $(`<div class="modal-body"></div>`).appendTo(
              $popContent
            );
            $(
              `<h3 class="subtitle">${content.Details.subtitle ? content.Details.subtitle : ""
              }</h3>`
            ).appendTo($modelbody);

            let text = $(
              `<p>${content.Details.paragraph ? content.Details.paragraph : ""
              }</p>`
            ).appendTo($modelbody);


            //for subtitle in side modelBody
            if (content.Details.hasOwnProperty("imgtitle")) {
              $(`<h6>${content.Details.imgtitle}</h6>`).appendTo($modelbody);
            }
            //for model body inside
            if (content.Details.hasOwnProperty("img")) {
              content.Details.img.forEach((element1) => {
                let $image1 = shairModule.generateDOM("<img/>", {
                  src: element1.img,
                  alt: "Loading...",
                  class: "slider-image",
                });
                $image1.appendTo($modelbody);
                if (element1.hasOwnProperty("subtitle")) {
                  let imageText = $(`<p>${element1.subtitle}</p>`).appendTo(
                    $modelbody
                  );
                }
              });
            }
            if (content.Details.hasOwnProperty("InputForm")) {
              this.User_data = content.Details.InputForm;
            }

            if (content.Details.hasOwnProperty("interest")) {
              let User_Interest = content.Details.interest;
              let Source = env.botsource;
              this.formdata.push(
                {
                  data: User_Interest,
                  value: "interest",
                },
                {
                  data: Source,
                  value: "source",
                }
              );
            }
            //for model button inside body
            if (content.Details.hasOwnProperty("button")) {
              let $btn1container = $(`<div class="popDetailsButton"></div>`);
              content.Details.button.contents.forEach((element2) => {
                let $btn1 = $(
                  `<button type="button" class="btn btn-primary" data-dismiss="modal">${element2.title}</button>`
                ).appendTo($btn1container);
                $btn1
                  .click(() => {
                    let payload1 = {
                      title: element2.title,
                      payload: element2.payload,
                    };
                    socketModule.messageSend(payload1);
                    $(".popDetailsContainer").attr("data-dismiss", "modal");
                  })
                  .bind(this);
                $btn1container.appendTo($modelbody);
              });
            }
            let $modelfooter =
              $(`<div class="modal-footer" style="display:block;">
                            <button type="button" class="btn btn-secondary" style="float:left" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-secondary" style="float:right">Save changes</button>
                        </div>`).appendTo($popContent);
            // $popContainer.appendTo(this.$frameContainer);
            let $btn = shairModule.generateDOM(
              '<button data-toggle="modal"></button>',
              { class: "button" },
              {},
              content.title
            );
            $btn.attr("data-target", "#" + target);

            // for new tab purposed
            $btn
              .click(() => {
                let win = $("#botinitialised");


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
                  `<h6 class="title">${content.Details.title}</h6>`
                ).appendTo(detailheader);
                let closeicon = $(
                  `<i class="fa fa-times close" style="color: #1C77BB;opacity: 1;position:relative;left:11px;"></i>`
                ).appendTo(detailheader);
                closeicon.click(() => {
                  detailcontainer.remove();
                });
                let detailbody = $(` <div class="bodysec"></div>`).appendTo(
                  detailcontainer
                );
                if (element.hasOwnProperty("link")) {
                  let link = element.link;
                  window.open(link, "_blank");

                }

                if (element.hasOwnProperty("iframe")) {
                  let iframe = $(`<iframe title="detailiframe" src="${element.iframe}"></iframe>`)
                  iframe.css({
                    "width": "100%",
                    "height": "100%",
                    "border": "none",
                    "margin-top": "-20px"
                  })
                  iframe.appendTo(detailbody);

                }
                else {
                  if (content.Details.hasOwnProperty("subtitle")) {
                    $(
                      `<h4 class="subtitle">${content.Details.subtitle}</h4>`
                    ).appendTo(detailbody);
                  }
                  if (content.Details.hasOwnProperty("paragraph") && content.Details.paragraph) {
                    let bodycont = $(
                      `<p style="color:#333;">${content.Details.paragraph}</p>`
                    ).appendTo(detailbody);
                  }
                  if (content.Details.hasOwnProperty("subtitle1")) {
                    content.Details.subtitle1.forEach((element) => {
                      let bodycont = $(
                        `<h4 style="color:#333">${element.title}</h4>`
                      ).appendTo(detailbody);
                      if (element.hasOwnProperty("subtitle")) {
                        $(`<p>${element.subtitle}</p>`).appendTo(detailbody);
                      }
                      // for detail drawer list
                      if (element.hasOwnProperty("detailList")) {
                        // here staring of the detail drawer list item
                        this.list_wrapper = $(
                          '<div class="backGround_list"></div>'
                        );

                        this.content_list = $(
                          '<div class="row col d-flex"></div>'
                        );

                        this.list_item = $(
                          '<div class="w-100"><div class="row"></div>'
                        );
                        this.offset_div = $(
                          '<div class="col-md-offset-3 col-md-6"></div>'
                        ).appendTo(this.list_item);
                        this.offset_div.css({
                          "padding-right": "0px",
                        });
                        this.panel_group = $(
                          '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true"></div>'
                        ).appendTo(this.offset_div);
                        this.panel_group.css({
                          "margin-top": "1rem",
                        });
                        element.detailList.map((e) => {
                          this.panel = $(
                            '<div class="panel panel-default"></div>'
                          ).appendTo(this.panel_group);
                          this.panel_head = $(
                            `<div class="panel-heading" role="tab" id=${e.id}></div>`
                          ).appendTo(this.panel);
                          this.panel_title = $(
                            '<p class="panel-title"></p>'
                          ).appendTo(this.panel_head);
                          this.first = $(
                            `<a class="first" role="button" data-toggle="collapse" data-parent="#accordion" href='#${e.subId}' aria-expanded="false" aria-controls=${e.subId}>${e.title}</a>`
                          ).appendTo(this.panel_title);
                          this.panel_collapse = $(
                            `<div id=${e.subId} class="panel-collapse collapse in" role="tabpanel" aria-labelledby=${e.subId}></div>`
                          ).appendTo(this.first);
                          this.panel_body = $(
                            '<div class="panel-body"></div>'
                          ).appendTo(this.panel_collapse);
                          this.ul = $("<ul></ul>");
                          this.ul.css({
                            "margin-top": "3px",
                          });
                          e.subdata.forEach((el) => {
                            this.li = $(`<li>${el.title}</li>`);
                            this.li.appendTo(this.ul);
                          });
                          this.ul.appendTo(this.panel_body);
                        });

                        this.list_item.appendTo(this.content_list);

                        this.content_list.appendTo(this.list_wrapper);
                        this.list_wrapper.appendTo(detailbody);
                      }
                      if (element.hasOwnProperty("listitem")) {
                        if (element.listitem[0].paragraph) {
                          // console.log("here is hit")
                          let ul = $("<ul></ul>").appendTo(detailbody);
                          element.listitem.forEach((element) => {
                            let li = $(`<li>${element.text}</li>`).appendTo(ul);
                            li.css({ cursor: "pointer" });
                            // console.log("this is hit", element.text)
                            let listul = $("<ul></ul>").appendTo(li);
                            let lists = $(
                              `<li class="pt-3">${element.paragraph}</li>`
                            ).appendTo(listul);
                            lists.css({
                              "list-style": "none",
                            });
                            listul.hide();
                            li.click(function () {
                              listul.toggle();
                            });
                          });
                        } else {
                          let ul = $("<ul></ul>").appendTo(detailbody);
                          element.listitem.forEach((el) => {
                            console.log("hfg", el.text);
                            let li = $(`<li>${el.text}</li>`).appendTo(ul);
                            li.css({ cursor: "pointer" });
                            if (el.hasOwnProperty("lists")) {
                              let listul = $("<ul></ul>").appendTo(li);
                              listul.css({
                                "margin-top": "5px",
                              });

                              el.lists.forEach((em) => {
                                let lists = $(`<li>${em.text}</li>`).appendTo(
                                  listul
                                );
                                lists.hide();
                                li.click(function () {
                                  lists.toggle();
                                });
                              });
                            }
                          });
                        }
                      }
                    });
                  }
                  if (content.Details.hasOwnProperty("img")) {
                    content.Details.img.forEach((element1) => {
                      let $image2 = shairModule.generateDOM("<img/>", {
                        src: element1.img,
                        alt: "Loading...",
                        class: "slider-image",
                      });
                      $image2.appendTo(detailbody);
                      if (element1.hasOwnProperty("subtitle")) {
                        let imageText1 = $(
                          `<p style="color:#333" class="detailimgtext">${element1.subtitle}</p>`
                        ).appendTo(detailbody);
                      }
                    });
                  }

                  if (content.Details.hasOwnProperty("button")) {
                    let $btn2container = $(
                      `<div class="popDetailsButton mb-2" id="btn_div"></div>`
                    ).appendTo(detailbody);
                    content.Details.button.contents.forEach((element3) => {
                      let $btn2 = $(
                        `<button type="button" class="btn btn-primary">${element3.title}</button>`
                      );
                      $btn2.appendTo($btn2container);
                      this.toggleInputform(this.User_data);
                      $btn2.click(() => {
                        let payload = element3.payload;
                        if (payload) {
                          if (element3.type) {
                            $("#user_inputform").toggle("slow");
                          } else {
                            socketModule.messageSend(element3.payload);
                            detailcontainer.remove();
                          }
                        } else if (payload == undefined) {
                          let link = element3.link;
                          window.open(link, "_blank");
                        }
                      });
                    });
                  }
                }


              })
              .bind(this);
            $btn.appendTo($btnContainer);
            // back button
            if (content.hasOwnProperty("Back_icon")) {
              console.log("backicon", content.Back_icon.title);
              let $btn_back = shairModule.generateDOM(
                '<button data-toggle="modal"></button>',
                { class: "button" },
                {},
                content.Back_icon.title
              );
              $btn_back.css({
                float: "right",
                "margin-right": "12px",
              });
              $btn_back.click(function () {
                let interest = content.Details.interest;
                sessionStorage.setItem("interest", interest);
                let payload = {
                  title: content.Back_icon.title,
                  payload: content.Back_icon.payload,
                };
                socketModule.messageSend(payload);
              });
              $btn_back.appendTo($btnContainer);
            }
          });
          $btnContainer.appendTo($slideContainer);
        }
        $slideContainer.appendTo($owlCarousel);
      });
      $owlCarousel.appendTo(this.$container);
      this.$container.appendTo(this.$message);
      this.scrollBottom();

      $(document).ready(() => {
        var owl = $(".owl-carousel");
        owl.owlCarousel({
          lazyLoad: true,
          loop: false,
          rewind: false,
          dots: false,
          margin: 15,
          smartSpeed: 800,
          nav: true,
          items: 1,
        });
        owl.on(
          "changed.owl.carousel",
          function (property) {
            this.currentSlide = property.page.index;
          }.bind(this)
        );
        this.scrollBottom();
      });
      $("#context").on("click", function () {
        $(".detailcontainer").remove();
      });
    }
  },

  poptastic: function (url) {
    let frame = $(`<div id="detailIframe"></div>`);
    let icon = $(
      ` <i style="float: right; margin: 14px;" class="fa fa-times detailsclosed"></i>`
    ).appendTo(frame);
    let iframe = $(
      `<iframe title="detailiframe" src="${url}" id="iframe_a"></iframe>`
    ).appendTo(frame);
    icon.click(() => {
      frame.remove();
    });
    frame.insertBefore(this.$frameContainer);
  },
  toggleInputform: function (data) {
    if (this.$formContainer) {
      this.$formContainer.remove();
    }
    this.togglecontainer = $(".detailcontainer");
    this.$formContainer = $(
      '<div id="user_inputform" class="p-3 w-75 m-auto collapse" aria-labelledby="headingOne" data-parent="#btn_div"></div>'
    );
    $(`<h5 class="text-center">${data.title}</h5>`).appendTo(
      this.$formContainer
    );
    let user_form = $("<form></form>").appendTo(this.$formContainer);
    let formData = data.data;
    if (data.data) {
      data.data.forEach((element) => {
        let parent_div = $('<div class="form-group"></div>').appendTo(
          user_form
        );
        $(
          `<label for=${element.id} class="form-label pl-3">${element.label}</label>`
        ).appendTo(parent_div);
        this.input = $(
          `<input id=${element.id} type=${element.type} class="form-control">`
        ).appendTo(parent_div);
      });
    }
    let post_url = data.action;
    this.interest_btnDIv = $(
      '<div class="d-flex justify-content-center"></div>'
    ).appendTo(user_form);
    if (data.button) {
      data.button.forEach((el) => {
        let user_btn = $(
          `<button class="btn text-light text_size">${el.value}</button>`
        ).appendTo(this.interest_btnDIv);
        if (el.type === "submit") {
          user_btn.addClass("ml-5");
        }
        user_btn.click((e) => {
          e.preventDefault();
          if (el.type === "submit") {
            this.leadCapture(formData, post_url);
          }
          if (el.type === "cancel") {
            this.$formContainer.hide();
          }
        });
      });
    }
    this.$formContainer.appendTo(this.togglecontainer);
  },
  leadCapture: function (el, url) {
    let vals = "";
    let error = false;
    el.forEach((e) => {
      vals = $("#" + e.id).val();
      $(`#${e.id}`).focus((ell) => {
        $(`#${e.id}`).parent().children().remove(".error");
        // $(`#${element.id}`).next().remove();
      });
      if (!vals) {
        error = true;
        let parent = $("#" + e.id).parent();
        parent.children().remove(".error");
        $(`<p class="error">${e.label} is required.</p>`).appendTo(parent);
      }
      if (vals) {
        if (e.id === "fullname") {
          this.formdata.push({
            data: vals,
            value: e.id,
          });
        }
        if (e.id === "mobile_email") {
          let regex = /^(?:\d{10}|\w+@\w+\.\w{2,3})$/;
          let mail = vals.match(regex);
          if (!mail) {
            error = true;
            let parents = $("#" + e.id).parent();
            parents.children().remove(".error");
            $(`<p class="error">Innvalid ${e.label} !!!.</p>`).appendTo(
              parents
            );
          }
          this.formdata.push({
            data: vals,
            value: e.id,
          });
        }
      }
    });
    if (vals) {
      if (error === false) {
        this.postservice(url, this.formdata);
      }
    }
  },
  postservice: async function (url, val) {
    let visitor = cookie.getCookie("uniqueID");
    this.formdata.push({
      data: visitor,
      value: "visitorId",
    });
    let leadcaptureData = val;
    const convertArrayToObject = (array, key) => {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item.data,
        };
      }, initialValue);
    };
    let forms = convertArrayToObject(leadcaptureData, "value");
    let res = await PostInterest(url, forms);
    if (res.status === "success") {
      $("#user_inputform").remove();
      this.toastMessage(res);
    }
  },
  toastMessage: function (res) {
    let toggleParent = $(".detailcontainer");
    let toastDiv = $(
      '<div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center" id="Toast_messageCOntainer"></div>'
    ).appendTo(toggleParent);
    toastDiv.css({ "min-height": "100px" });

    let toastClass = $(
      '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"></div>'
    ).appendTo(toastDiv);
    toastClass.css({ opacity: "1" });
    $(`<div class="toast-body">${res.for}</div>`).appendTo(toastClass);
    setTimeout(() => {
      $("#Toast_messageCOntainer").remove();
    }, 1000);
  },
  clear: sliderModule.clear,
};

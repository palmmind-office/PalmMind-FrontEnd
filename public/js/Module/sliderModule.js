import { socketModule } from "../core/socket";
import { googleAnalytics } from "../general/googleAnalytics";
import { shairModule } from "../Services/shairModule";
import { env } from "../../env";
export var sliderModule = {
  data: {},
  currentSlide: 0,
  res: "",
  init: async function (data) {
    this.data = data;
    this.cacheDOM();
    this.render();
  },

  cacheDOM: shairModule.cacheDOM,

  generateDOM: shairModule.generateDOM,
  scrollBottom: shairModule.scrollBottom,
  getIcon: function (key) {
    key = key.toLowerCase();
    let icon = "";
    switch (key) {
      case "Address":
        icon = "fas fa-map-marker-alt";
        break;
      case "address":
        icon = "fas fa-map-marker-alt";
        break;
      case "Phone":
        icon = "fas fa-phone-volume";
        break;
      case "phone":
        icon = "fas fa-phone-volume";
        break;
      case "email":
        icon = "fas fa-envelope";
        break;
      case "Email":
        icon = "";
        break;
      case "facebook":
        icon = "fab fa-facebook";
        break;
      case "viber":
        icon = "fab fa-viber";
        break;
      case "mobile":
        icon = "fas fa-mobile";
        break;
      default:
        icon = "";
    }

    return icon;
  },
  render: function () {
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
      // let node = $(`<li class="sent"><img src="${env.Orgimg}" alt=""><p style="margin-bottom:5px;">${text}</p></li>`);
      // node.appendTo(parentElem);

      let li = $(
        `<img id="sentImage" src="${env.Orgimg}" alt=""><p class="quickReplyPara" style="margin-bottom:5px;">${text}</p>`
      );
      this.node = $(`<li class="sent"></li>`);
      li.appendTo(this.node);
      this.node.appendTo(parentElem);
    }

    if (this.data.data.length) {
      this.$container = $(`<div id="slider"></div>`);
      this.$container.css("font-size", "14px");
      let $owlCarousel = $(`<div class="owl-carousel owl-theme"></div>`);
      this.data.data.forEach((element, index) => {
        let $slideContainer = $(`<div class="slide-container"></div>`);
        if (element.hasOwnProperty("img")) {
          let $image = this.generateDOM("<img/>", {
            src: element.img,
            alt: "Loading...",
            class: "slider-image",
          });
          $image.appendTo($slideContainer);
        }

        if (element.hasOwnProperty("contents")) {
          let leftrightcontent = $(
            `<div class="leftrightcontent"></div>`
          ).appendTo($slideContainer);
          let leftcontent = $(
            `<p class="leftcontent">${element.contents.leftrightcontent.leftcontent}</p>`
          ).appendTo(leftrightcontent);
          let rightcontent = $(
            `<p class="rightcontent">${element.contents.leftrightcontent.righcontent}</p>`
          ).appendTo(leftrightcontent);
          let iconcontainer = $(`<div class="iconcontainer"></div>`).appendTo(
            $slideContainer
          );
          let ratting = $(
            `<div class="rating" style="cursor:pointer"></div>`
          ).appendTo($slideContainer);
          if (element.contents.hasOwnProperty("rating")) {
            let k = 0;
            ratting.click(() => {
              let linkrating = element.contents.rating.link;
              if (linkrating) {
                window.open(linkrating, "__blank");
              } else {
                return false;
              }
            });
            for (k == 0; k < element.contents.rating.value; k++) {
              $(`<span class="fa fa-star checked"></span>`).appendTo(ratting);
            }
            let badge = $(
              `<span class="badge badge-light">review: ${element.contents.rating.review}</span>`
            ).appendTo(ratting);
          }
          if (element.contents.hasOwnProperty("icon")) {
            element.contents.icon.forEach((icons) => {
              let icon = $(
                `<a style="cursor: pointer;"><img src="${icons.icon}"><span class="badge badge-light">${icons.value}</span></a>`
              ).appendTo(iconcontainer);
              icon.click(() => {
                let link = icons.link;
                if (link) {
                  window.open(link, "__blank");
                } else {
                  return false;
                }
              });
            });
          }
        }

        if (element.hasOwnProperty("map")) {
          let $mapContainer = $(
            `<iframe src="https://maps.google.com/maps?q=${element.map.latitude},${element.map.longitude}&hl=es;z=19&amp;output=embed" width="100%" frameborder="0" style="border:0" allowfullscreen></iframe>`
          );
          $mapContainer.css({
            border: "1px solid #ccc",
          });
          $mapContainer.appendTo($slideContainer);
        }
        if (element.hasOwnProperty("title")) {
          let text = Array.isArray(element.title)
            ? element.title.join("<br>")
            : element.title;
          let $h3 = this.generateDOM("<h3/>", {}, {}, text);
          $h3.appendTo($slideContainer);
        }
        if (element.hasOwnProperty("subtitle")) {
          let text = Array.isArray(element.subtitle)
            ? element.subtitle.join("<br>")
            : element.subtitle;
          if (text) {
            let $p = this.generateDOM(
              "<p/>",
              { class: "block-with-text" },
              {},
              text
            );
            $p.appendTo($slideContainer);
          }
        }
        if (element.hasOwnProperty("people")) {
          let people = $(
            `<p class="peoplerole border-0"><i class="fa fa-user"></i>  ${element.people.role}</p>`
          ).appendTo($slideContainer);
        }
        if (element.hasOwnProperty("features")) {
          for (let key of Object.keys(element.features)) {
            if (element.features[key]) {
              let text = Array.isArray(element.features[key])
                ? `${key} : ${element.features[key].join(
                    "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                  )}`
                : `${key} : ${element.features[key]}`;
              if (text) {
                let $p = this.generateDOM(
                  "<p/>",
                  {},
                  { padding: "0px 7px", "margin-bottom": "0px" }
                );
                let $icon = this.generateDOM(
                  "<i/>",
                  { class: this.getIcon(key) },
                  { margin: "5px" }
                );
                $icon.appendTo($p);
                $p.append(text);
                $p.appendTo($slideContainer);
              }
            }
          }
        }
        if (element.hasOwnProperty("button")) {
          let $btnContainer = this.generateDOM("<div></div>", {
            class: "button-container",
          });
          element.button.contents.forEach((content, btnIndex) => {
            let $btn = this.generateDOM(
              "<button></button>",
              { class: "button" },
              {},
              content.title
            );
            $btn.click(() => {
              googleAnalytics.recordEvent({
                eventCategory: content.title,
                eventAction: content.link || content.payload,
              });
            });
            $btn.appendTo($btnContainer);
          });
          $btnContainer.appendTo($slideContainer);
        }

        if (element.hasOwnProperty("buttonWithOutBackground")) {
          let $verticlebtn = this.generateDOM("<div></div>", {
            class: "verticale-button-container",
          });
          element.buttonWithOutBackground.contents.forEach((btn) => {
            let verticlebtn = this.generateDOM(
              "<button></button>",
              { class: "button-verticle" },
              {},
              btn.title
            );
            verticlebtn.appendTo($verticlebtn);
            verticlebtn.click(() => {
              googleAnalytics.recordEvent({
                eventCategory: btn.title,
                eventAction: btn.link || btn.payload,
              });
              if (btn.link) {
                window.open(btn.link, "__blank");
              }
              if (btn.payload) {
                socketModule.messageSend(btn.payload);
              }
            });
          });
          $verticlebtn.appendTo($slideContainer);
        }

        if (element.hasOwnProperty("buttonhorizental")) {
          let $horizentalbtn = this.generateDOM("<div></div>", {
            class: "horizental-button-container",
          });
          element.buttonhorizental.contents.forEach((btn) => {
            let horizentalbtns = this.generateDOM(
              "<button></button>",
              { class: "button-horizental" },
              {},
              btn.title
            );
            horizentalbtns.appendTo($horizentalbtn);
            horizentalbtns.click(() => {
              googleAnalytics.recordEvent({
                eventCategory: btn.title,
                eventAction: btn.link || btn.payload,
              });
              if (btn.link) {
                window.open(btn.link, "__blank");
              }
              if (btn.payload) {
                socketModule.messageSend(btn.payload);
              }
            });
          });
          $horizentalbtn.appendTo($slideContainer);
        }
        $slideContainer.appendTo($owlCarousel);
      });

      $owlCarousel.appendTo(this.$container);
      this.$container.appendTo(this.node);
      this.scrollBottom();

      $(document).ready(() => {
        var owl = $(".owl-carousel");
        owl.owlCarousel({
          lazyLoad: true,
          loop: false,
          rewind: false,
          dots: true,
          margin: 15,
          responsiveClass: true,
          autoHeight: true,
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

        owl.on(
          "click",
          ".button",
          function (event) {
            let btnIndex = $(event.currentTarget).index();
            if (btnIndex > -1) {
              let link = this.data.data[this.currentSlide].button.contents[
                btnIndex
              ].hasOwnProperty("link")
                ? this.data.data[this.currentSlide].button.contents[btnIndex]
                    .link
                : "";
              if (link) {
                window.open(link, "__blank");
              }

              let payload =
                this.data.data[this.currentSlide].button.contents[btnIndex]
                  .payload;
              if (payload) {
                socketModule.messageSend(payload);
                this.clear();
              }
            }
          }.bind(this)
        );
        this.scrollBottom();
      });
    }
  },

  clear: function () {
    this.currentSlide = 0;
    this.data = {
      data: [],
    };
    if (this.$container) {
      this.$container.remove();
      $(".detailcontainer").hide();
    }
  },
};

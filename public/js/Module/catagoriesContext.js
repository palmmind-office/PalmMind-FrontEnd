import { socketModule } from "../core/socket";
import { googleAnalytics } from "../general/googleAnalytics";
import { env } from "../../env";
import { shairModule } from "../Services/shairModule";

export var catagoriesContext = {
  data: {},
  init: function (data) {
    this.data = data;
    // console.log("this is catagoriesContext",data);
    this.cacheDOM();
    this.render();
    // this.bindEvents();
  },
  cacheDOM: shairModule.cacheDOM,
  scrollBottom: shairModule.scrollBottom,
  render: function () {
    if (this.$maincontainer) {
      this.$maincontainer.remove();
    }
    this.$container = $(`<div id="catagoriesContext"></div>`);
    this.$maincontainer = $(`<div class="catagories"></div>`);
    let renderTextNode = Array.isArray(this.data.title)
      ? this.data.title.length > 0
      : this.data.title;
    if (renderTextNode) {
      //     let a= $("ul li.replies").last().html();
      //    let p=$(a +"p").text();
      //    console.log(a,p);
      let parentElem = this.$message.find(".message-section").find("ul");
      let text = Array.isArray(this.data.title)
        ? this.data.title.join("<br>")
        : this.data.title;
      let node = $(
        `<li class="sent"><img src="${env.Orgimg}" alt=""><p style="margin-bottom:5px;">${text}</p><li></li></li>`
      );
      node.appendTo(parentElem);
    }

    if (this.data.data.length) {
      let ul = $("<ul/>");
      // ul.css({'margin-top': '-38px'});
      let subtitle = $(
        `<h6 class="animated flipInY">${this.data.subtitle}</h6>`
      ).appendTo(this.$container);
      this.data.data.forEach((element) => {
        let li = $("<li/>").appendTo(ul);
        li.css({ "margin-left": "-12px" });
        let b = $(`<div class="ico"></div>`).appendTo(li);
        let text = $(
          `<p class="p-0"><span class="fa-li"><i class="fa fa-search"></i></span>${element.title}</p>`
        ).appendTo(b);

        li.click(() => {
          let payload = { title: element.title, payload: element.payload };
          let link = element.link;

          if (payload) {
            //    console.log("payload",payload);
            googleAnalytics.recordEvent({
              eventCategory: element.title,
              eventAction: payload,
            });
            this.clear();
            socketModule.messageSend(payload);
          } else if (link) {
            // console.log("this is link")
            const a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            a.download = link.split("/").pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }).bind(this);
      });
      ul.appendTo(this.$container);
      this.scrollBottom();
    }

    if (renderTextNode || this.data.data.length) {
      this.$container.appendTo(this.$message);
      this.$maincontainer.appendTo(this.$message);

      // this.$container.appendTo(this.$hideinput);
    }
    this.scrollBottom();
  },
  clear: function () {
    if (this.$container) {
      this.$container.remove();
      this.$maincontainer.remove();
    }
    this.data = {
      title: "",
      data: [],
    };
    // this.render();
  },
  bindEvents: function () {
    if (!this.$container) {
      return;
    }
  },
};

// {   title:"",
//     type: "catagoriesContext",
//     data: [
//       {
//         title: 'button dagjjdaf dshgjf hgsad gdhas ?',
//         payload: 'hjadgahs sadhggas sadhfsad ?'
//       },
//       {
//         title: 'button dagjjdaf dshgjf asdhs gdhas 2 ?',
//         payload: 'hjadgahs sadhggas sadhfsad ?'
//       } ,
//       {
//         title: 'button dagjjdaf dshgjf sadsgd gdhas 3 ?',
//         payload: 'hjadgahs sadhggas sadhfsad ?'
//       }
//     ]
//   }

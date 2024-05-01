import { socketModule } from "../core/socket";
import { sessionstorage } from "../general/sessionstorage";
export let renderPreviousButton = {
  payload: "",
  init: function () {
    let previousUtterance = sessionstorage.get("previousMessage");
    if (previousUtterance && !socketModule.livechat) {
      let dom = $("#message-module");
      let button = $(
        `<button type="button" class="btn btn-primary" id="previousButton"> <span><</span> Go Back</button>`
      );
      this.clear();
      // button.click(
      //   function () {
      //     this.payload = sessionstorage.findPreviousMessage("previousMessage");
      //     socketModule.messageSend(this.payload, true);

      //     let shownImage = $("#context img").attr("src");
      //     if (
      //       shownImage === "images/embed/home.png" &&
      //       this.payload.payload === "menu"
      //     ) {
      //       let minus = "images/banner/cancel.png";
      //       $("#context img").attr("src", minus);
      //     }
      //   }.bind(this)
      // );
      // button.appendTo(dom);
      this.scrollBottom();
    }
  },

  scrollBottom: function () {
    $(".messages").animate(
      {
        scrollTop: $("#message-module")[0].scrollHeight,
      },
      "fast"
    );
  },

  clear: function () {
    if ($("#previousButton").length > 0) {
      $("#previousButton").remove();
    }
  },
};

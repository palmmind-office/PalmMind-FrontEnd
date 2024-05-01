import { socketModule } from "./socket";
import { LoadingModule } from "../general/loading";
import { googleAnalytics } from "../general/googleAnalytics";
import { SpeechRecognitionrun } from "./speechReecognizer";
import { env } from "../../env";
import { sandBox } from "../sharedService/sandBoxModule";
import { facebookModule } from "../oAuth/facebookModule";
import { googleModule } from "../oAuth/googleModule";
import { cookie } from "../general/cookie";
import { fileUpload } from "../Module/fileUploadModule";
import { cookieExpire } from "../../env";
import { fetchUserHistory, renderMessage } from "./bootHelperFunctions";

import { FadeBackModal as ModalPop } from "../sharedService/modal-render";
import { audioUpload } from "../Module/audioMessage";
export class Boot {
  constructor() {}

  async ChatbotBooter() {
    let socketUrl = `${env.protocol}://${env.server}:${env.port}`;
    await socketModule.init(socketUrl);
    let nav = true;
    if (nav) {
      $("#context").click(function () {
        let continueFN = function () {
          sandBox.clearAllModules();
          $("#autosuggest").html("");
          var plus = "images/embed/menu.png";
          var minus = "images/embed/menu.png";
          $(".wrap").css("display", "flex");
          $("#buttonUpSlider").hide();
          $(".fa-keyboard").remove();
          $("#error_button").remove();
          if ($("#context img").attr("src") === minus) {
            $("#context img").attr("src", plus);
            socketModule.messageSend("menu");
          } else {
            sandBox.clearAllModules();
            $("#context img").attr("src", minus);
            $(".initialForm").css("visibility", "visible");
            $(".LiveFormBtn").css("visibility", "visible");
          }
        };
        let exitfn = function () {
          return;
        };
        if (socketModule.livechat) {
          try {
            const BODY_TEXT = "Do you want to end this livechat session?";
            ModalPop(continueFN, exitfn, BODY_TEXT, this);
          } catch (error) {
            continueFN();
            console.log(error, "error from boothelper");
          }
        } else {
          continueFN();
        }
      });

      $("#menuAgent").click(function (){
        let payload = {
          title: "Talk to Live Agent",
          payload: "livechat:request:all"
        }
        socketModule.messageSend(payload)
      });
      
      $("#menuBook").click(function (){
        let payload = {
          title: "Book a Demo",
          payload: "Book a Demo"
        }
        socketModule.messageSend(payload)
      });

      $("#menuJob").click(function (){
        let payload = {
          title: "Jobs",
          payload: "Jobs"
        }
        socketModule.messageSend(payload)
      });

      $("#menuContact").click(function (){
        let payload = {
          title: "Contact Us",
          payload: "Contact Us"
        }
        socketModule.messageSend(payload)
      });

      //for google Analytics purposed binding this element to head when loaded bot
      $(document).ready(function () {
        googleModule.init();
        facebookModule.init();

        $("head").append(`<script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', "${env.analyticsId}", 'auto');
        ga('send', 'pageview');
        </script>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=${env.measurementId}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', "${env.analyticsId}", { 'groups': 'palmMindOld'});
          gtag('config', "${env.measurementId}", { 'groups': 'palmMindOld'});
        </script>

    
        //new google Analytics
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CTPDMT0KJ2"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-CTPDMT0KJ2', {'groups': 'palmMindNew');
        </script>
        
        `);
      });

      $("#outerDiv .modal #livechatproceed").on("click", function () {
        socketModule.messageSend("human");
        $("#outerDiv .modal #livechatproceed").attr("data-dismiss", "modal");
      });

      $("#palmmind_web").click(function () {
        let link = "http://palmmind.com/";
        window.open(link, "__blank");
      });

      //   read text file
      window.addEventListener("message", async (event) => {
        console.log(event, "child boo");
        if (event.origin === env.parentUrl) {
          if (event.data.type === "activeAgents") {
            let modalPopUpRemove = document.querySelector(".modal.fade.show");
            modalPopUpRemove.classList.remove("show");
            modalPopUpRemove&& modalPopUpRemove.remove()
            sandBox.clearAllModules();
            let payload = {
              title: event.data.title,
              payload: event.data.payload,
            };
            return socketModule.socket.emit("message:sent", payload);
          }
          // for live chat request accept from notification
          if (event.data.type === "livechatRequestAccept") {
            sandBox.clearAllModules();
            let payload = {
              title: event.data.title,
              payload: event.data.payload,
            };
            return socketModule.socket.emit("message:sent", payload);
          }

          if (event.data.type === "live-chat-request") {
            LoadingModule.init("#message-input-module");
            sandBox.clearAllModules();
            let payload = {
              text: event.data.title,
              payload: event.data.payload,
            };
            if (socketModule.livechat) {
              return;
            }
            $("#rememberVisitor").remove();

            let fetchChatHistory = await fetchUserHistory(event.data.visitor);
            //if found chathistory/visitors
            if (fetchChatHistory && fetchChatHistory.clientDetails && Object.keys(fetchChatHistory.clientDetails) > 0) {
              let clientDetails = {};
              clientDetails["name"] = fetchChatHistory.clientDetails.name || null;
              clientDetails["mobileNumber"] =
                fetchChatHistory.clientDetails.mobileNumber || fetchChatHistory.clientDetails.mobile || null;
              return socketModule.socket.emit(
                "message:sent",
                { ...payload },
                { ...clientDetails, source: "web", request_livechat: true }
              );
            }
            return socketModule.socket.emit("message:sent", { ...payload }, { source: "web", request_livechat: true });
          }
          const link = event.data;
          if (link) {
            // Process the message received from the iframe (chatbot)
            // TODO: CHECK IF LINK MATCHES URL REGEX
            const urlRegex =
              /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.,~#?&//=]*)$/g;
            if (typeof link === "string" && urlRegex.test(link)) {
              // fire GA4 event for parent website url hit
              $(document).ready(function () {
                googleAnalytics.recordEvent({
                  eventCategory: event.source.location.pathname,
                  eventAction: { title: event.source.location.pathname || event.source.location.origin },
                });
              });
              socketModule.socket.emit("user:setData", {
                newLink: link,
              });
            }
            return;
          }

          console.log("Message from parent website:", link);
        }
      });

      $(document).ready(function () {
        console.log("hhhhhhh");
        fileUpload.init();
        audioUpload.init();

        $.ajaxSetup({
          cache: false,
        });
        // $("#search1").keyup(function () {
        //   $("#autosuggest").html("");
        //   $("#state").val("");
        //   var searchField = $("#search1").val();
        //   var expression = new RegExp(searchField, "i");
        //   fetch("../../../assets/autosuggest.txt")
        //     .then((data) => data.text())
        //     .then((data) => {
        //       const ResultArray = data.split("\n");
        //       $.each(ResultArray, function (key, value) {
        //         if (value.search(expression) != -1 || value.search(expression) != -1) {
        //           let li = $(
        //             `<li class="list-group-item link-class" value=${value}><i class="fa fa-search"></i>${value}</li>`
        //           );
        //           $("#autosuggest").append(li);
        //           li.click(function () {
        //             let payload = value;
        //             var click_text = payload;

        //             $("#search1").val(click_text);
        //             socketModule.messageSend(click_text);
        //             $("#autosuggest").html("");
        //           });
        //         }
        //         if ($("#search1").val().length == 0) {
        //           $("#autosuggest").html("");
        //         }
        //         if ($("#autosuggest li").length == 1) {
        //           $("#search1").text(value);
        //           $("#search1").attr("value", value);
        //         }
        //       });
        //     });
        // });
        // timer Poppup module
        // timerPopUp.Timer()
      });
      //for input validation purposed
      $(".message-input input#search").keypress(function (e) {
        var keyCode = e.keyCode || e.which;
        $("#errorinputtext").css("display", "none");
        var regex = "";
        var isValid = regex.test(String.fromCharCode(keyCode));
        if (!isValid) {
          document.getElementById("errorinputtext").style.display = "inline";
        }
        if (e.which == 13) {
          document.getElementById("errorinputtext").style.display = "none";
        }
        return isValid;
      });

      async function checkconnection() {
        // timerPopUp.Timer()
        $("#errorinputtext").css("display", "none !important");
        var status = navigator.onLine;
        // let status = true;
        if (status) {
          $("#context img").attr("src", "images/embed/menu.png");
          var numbers = "";
          let message = $(".message-input input").val();
          let attachment = await fileUpload.getAttachment();
          console.log(attachment, "attch");
          // if (message === "" && !(attachment && (Array.isArray(attachment) ? attachment.length > 0 : attachment))) {
          if (message === "" && !(attachment && attachment.length > 0)) {
            console.log("false");
            return false;
          }

          // console.log("message is ", message);
          if (!message || message.match(numbers)) {
            if (message === "clear") {
              $("#message-module ul li").remove();
              $("#previousButton").remove();
              sandBox.clearAllModules();
            } else if (attachment) {
              console.log("next");
              Array.isArray(attachment) &&
                attachment.forEach((inner_attachment) => {
                  socketModule.messageSend(message, inner_attachment);
                });
              console.log(message, attachment, "*******");
              // socketModule.messageSend(message, attachment);

              document.getElementById("errorinputtext").style.display = "none";
            } 
            else {
              socketModule.messageSend(message);
            }
          }
          if (!message.match(numbers)) {
            document.getElementById("errorinputtext").style.display = "inline";
          }
          if (attachment) {
            console.log('GA4 attachded')
            googleAnalytics.recordEvent({
              eventCategory: "Attachment",
              eventAction: attachment.type,
            });
          }
        } else {
          $.notify(env.internetConnection, "warn");
          LoadingModule.clear();
        }
      }

      //for checking livechat availabele or not
      function getorganization() {
        fetchdata().then((data) => {
          let $btn = $(`<button type="submit" class="btn btn-success" data-dismiss="modal">Close</button>`);
          $btn.css({
            position: "absolute",
            bottom: "7px",
            left: "40%",
            padding: "6px 15px",
            "font-size": "13px",
            background: "#007bff",
          });
          if (data.data.availability == false) {
            // console.log(data.data.liveChat_availability);
            let $tag = '"We are sorry, we are not available now , Try again later"';
            $("#LiveChatForm .modal-title").text($tag);
            $("#LiveChatForm .btncont .btn-primary").css("visibility", "hidden");
            $("#LiveChatForm .btncont").append($btn);
          }
          if (data.data.availability == true) {
            let $tag = "Do you want to proceed live-chat ?";
            $("#LiveChatForm .modal-title").text($tag);
            $("#LiveChatForm .btncont .btn-primary").css("visibility", "visible");
            $btn.css("visibility", "hidden");
            $("#LiveChatForm .btncont .btn-success").css("visibility", "hidden");
          }
        });
      }

      $(".LiveFormBtn").click(() => {
        getorganization();
      });

      $(`#getSpeech`).on("click", function (e) {
        e.preventDefault();
        SpeechRecognitionrun.init();
      });

      $("#offerID").on("click", () => {
        socketModule.messageSend("Offer");
      });

      $(".submit").click(async function () {
        await checkconnection();
        $("#generalslider").remove();
        $("#result").html("");
        $("#context img").attr("src", "images/embed/menu.png");
      });

      $(".initialForm").click(() => {
        socketModule.messageSend("info");
      });

      // push notification
      // $('#pushNotification').click(() => {
      //   googleAnalytics.recordEvent({
      //     eventCategory: "Subscriber Notification",
      //     eventAction: "Subscriber Notification",
      //     // eventLabel: this.data.type,
      //   });
      //   poptastic(`${env.protocol}://${env.server}:${env.port}/pushNotification`);
      // });

      // function poptastic(url) {
      //   let newwindow = window.open(url, '__blank', 'height=500,width=500, top=80, left=150,resizable=yes,scrollbars=no,toolbar=yes,status=yes');
      //   if (window.focus) { newwindow.focus() };
      // }
      //end of post notification

      $("#toggle").click(function () {
        socketModule.messageSend("menu");
      });

      $(window).on("keydown", async function (e) {
        if (e.which == 13) {
          await checkconnection();
          $("#generalslider").remove();
          $("#result").html("");
        }
      });

      socketModule.socket.on("livechat:agents", async function (agents) {
        let activeAgent = agents.filter((agent) => agent.status === "active");
        window.parent.postMessage(
          {
            type: "activeAgents",
            data: activeAgent,
          },
          env.parentUrl
        );
        $("#active_agents_display") && $("#active_agents_display").empty();

        let activeAgentsContainer = $("#active_agents_display");
        let div = $("<div id='active_agent_container'></div>");
        div.css("display", "none");

        if (activeAgent.length > 0) {
          //Agent Details list
          let salesDiv = $(
            `<div><p style="margin-bottom: 0; text-align: center; color: #005aab;"><b>Active Agents</b><span>(${
              activeAgent.length || 0
            })</span><hr style="background-color: #005aab; margin-top: 2px;"></hr></p><p style="margin-bottom: 0; display: flex; color: #005aab; justify-content: space-between; text-transform: uppercase; font-weight: bold; text-decoration: underline;"><span>Agent Name</span><span>Department</span></p></div>`
          );
          let salesDetails = $(`<div id="salesDetails"></div>`);
          activeAgent
            .filter((agent) => agent.status === "active")
            .forEach((agent) => {
              let nameDepartmentSales = $(
                `<p style='margin-bottom: 0;display: flex; justify-content: space-between;'><span><span id="agent_online"></span>${agent.name}</span><span>${agent.category}</span></p>`
              );
              nameDepartmentSales.appendTo(salesDetails);
            });
          salesDetails.appendTo(salesDiv);
          salesDiv.appendTo(div);
        } else {
          $("<p style='margin-bottom: 0; text-align: center;'>No Agents active at the moment.</p>").appendTo(div);
        }

        div.appendTo(activeAgentsContainer);

        $("#active_agents").on("click", () => {
          div.toggle();
        });
      });

      socketModule.socket.on("message:received", async function (message, metadata) {
        // hide auto-suggest while filling the rasa form
        if (message.hasOwnProperty("isform") && message.isform === true) {
          console.log("i am in");
          $("#autosuggest").css({
            display: "none",
          });
        } else {
          console.log("i am out");
          $("#autosuggest").css({
            display: "unset",
          });
        }

        // hide auto-suggest while livechat is active and message type is userMessage and agentMessage
        if (socketModule.livechat === true) {
          if (message.type === "userMessage") {
            console.log("i am in");
            $("#autosuggest").css({
              display: "none",
            });
          } else {
            console.log("i am out");
            $("#autosuggest").css({
              display: "unset",
            });
          }
        }
        if (message.type === "agentMessage") {
          console.log("i am in");
          $("#autosuggest").css({
            display: "none",
          });
        }
        if (message.type === "livechatNewMessage") {
          console.log("has entered");
          return;
        }
        console.log("message", message, metadata);

        // console.log("MESSAGE RECEIVED boot.js 299");
        // console.table(message);
        // console.table(metadata);
        socketModule.onMessageReceived(message, metadata);
      });

      socketModule.socket.on("disconnect", async function () {
        console.log("DISCONNECTED");
        // if (confirm("Connection lost. Refresh?")) {
        //   window.location.reload();
        // }
      });

      // clear all modules if case of livechat start
      socketModule.socket.on("livechat:started", () => {
        $("#autosuggest").css({
          display: "none",
        });
        socketModule.livechat = true;
        fileUpload.toggleDisable(true);
        sandBox.clearAllModules();
      });

      // clear popup if livechat rejected
      socketModule.socket.on("livechat:reject", () => {
        sandBox.clearAllModules();
      });

      // clear popup if livecehat request has been sent
      socketModule.socket.on("livechatRequest:sent", () => {
        sandBox.clearAllModules();
      });

      socketModule.socket.on("livechat:ended", () => {
        $("#autosuggest").css({
          display: "block",
        });
        socketModule.livechat = false;
        fileUpload.toggleDisable(false);
      });

      socketModule.socket.on("user:alreadyJoined", async (visitor) => {
        $("#rememberVisitor").remove();
        let conversationHistory = await fetchUserHistory(visitor);
        if (conversationHistory && conversationHistory.messages.length > 0) {
          await renderMessage(conversationHistory);
        } else {
          socketModule.messageSend("/dummy_welcome");
        }
      });

      socketModule.socket.on("agent_received", function (message) {
        LoadingModule.clear();
      });

      socketModule.socket.on("agent_alert", function (message) {
        LoadingModule.clear();
      });

      socketModule.socket.on("agent_send", function (message) {
        LoadingModule.clear();
      });
    }
  }
  // if chatbot needed any module initialised during the time of loading
  initalisedOfChatbotModule() {
    $(`.InsideMessageLoading`).remove();
  }
}

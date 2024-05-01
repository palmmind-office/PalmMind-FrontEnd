import { Visitor } from "./visitorIdGenerator";
import { env } from "../env"
import { playSound } from "./notificationGreet";
import { getUserToken } from "./subscriptionNotification";
import { cookie } from "../js/general/cookie";
import { googleModule } from "../js/oAuth/googleModule";
import { sessionstorage } from "../js/general/sessionstorage";

class BotEmbeded {

    constructor() {
        this.showBot = false;
        this.botLoaded = false;
        this.baseUrl = env.protocol == 'https' ? `${env.protocol}://${env.server}` : `${env.protocol}://${env.server}:${env.port}`;
        (this.isMobileDevice = function () {
            return /(iphone|ipod|ipad|android|blackberry|windows phone)/i.test(
                navigator.userAgent
            );
        }),
            Element.prototype.setAttributesiframe = function (attrs) {
                for (var idx in attrs) {
                    if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
                        for (var prop in attrs[idx]) {
                            this.style[prop] = attrs[idx][prop];
                        }
                    } else if (idx === 'html') {
                        this.innerHTML = attrs[idx];
                    } else {
                        this.setAttribute(idx, attrs[idx]);
                    }
                }
            };

    };
    init(botStyle) {
        googleModule.init();
        if (!this.hideWebContent()) {
            let greetSound = sessionstorage.get("greetSound");
            if (!greetSound) {
                sessionstorage.set("greetSound", "Activated");
                playSound("get");
            }
            // $("#round-btn .text_paragraph").css({
            //     "visibility": "unset !important"
            // })
            this.bindIframe(botStyle);
            this.cacheDOM();
            this.visitor = new Visitor(this.$palmBot, this.baseUrl, this.appendButtonWebpage, this)
            this.visitor.loadBot();
            this.render();
            this.visitor.sendEventToBot(this.iframeprop, this.$d1);
            let search = window.location.search;
            let urlp = new URLSearchParams(search)
            let query = urlp.get('keys') || '';
            // if (query && query.length > 0) {
            //     this.roundBtnClicked()
            // }
            setTimeout(function () {
                this.appendButtonWebpage()
            }.bind(this), 2000)
            this.appendButtonWebpage()
            // if (!this.isMobileDevice()) {
            //     this.roundBtnClicked()
            // }
            // this.roundBtnClicked()
            // this.dragBot()
        };
    };
    //click event from website and execute bot with livechat
    //click event from website and execute bot with livechat
  appendButtonWebpage() {
    $("#webButton").remove();
    // let button = document.getElementsByClassName("addcart-action")[0];
    let button = document.getElementsByClassName("elementor-button-wrapper")[4] || document.getElementsByClassName("elementor-button-wrapper")[3];
    // let body = document.querySelector("body");
    let addButton = $(
      `<button id="webButton" class="elementor-button elementor-button-link elementor-size-lg" style="border:unset;"><span class="elementor-button-content-wrapper"><span class="elementor-button-text">Talk to Live Agent</span></div></button>`
    );
    // addButton.appendTo(button);
    addButton.appendTo(button);

    // if ($(".auto-type").length > 0) {
    //   var typed = new Typed(".auto-type", {
    //     strings: ["", "Talk To Live Agent"],
    //     typeSpeed: 150,
    //     backSpeed: 150,
    //     loop: true,
    //   });
    // }

    if (!this.showBot) {
      $("#webButton").on(
        "click",
        async function (event) {
          try {
            let visitorId = cookie.getCookie('webUniqueID') || cookie.getCookie('uniqueID');
            let URL = `${env.protocol}://${env.server}:${env.port}${env.basePath}pushnotification/getVisitors/suscribed`;

            const response = await fetch(URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                visitor_id: visitorId
              })
            });

            const visitor = await response.json();
            const visitorData = visitor.data.clientDetails || {};
            if (Object.keys(visitorData).length<1) {
              googleModule.signInWithGoogle()
              window.addEventListener('message', async (event) => {
                let googleAuthLogin = event.data.type === "googleAuth";
                if (googleAuthLogin) {
                  this.roundBtnClicked(event, "webButtonClicked");
                }
              })
            }else{
              this.roundBtnClicked(event, "webButtonClicked");
            }
          } catch (error) {
            // Handle errors here
            console.error(error);
            this.roundBtnClicked(event, "webButtonClicked");
          }
          if (this.showBot) {
            $("#webButton").attr("disabled", true);
            return;
          }

        }.bind(this)
      );
      $("#webButton").removeAttr("disabled");
      return;
    }
    $("#webButton").attr("disabled", true);

  }
    // dragBot() {
    //     const draggable = document.getElementById('palmbot');
    //     const dragHandle = document.getElementById('dragDiv');

    //     let isDragging = false;

    //     dragHandle.addEventListener('mousedown', (e) => {
    //         isDragging = true;
    //         // x and y position of mouse pointer along with horizontal and vertical coordinate of the element relative to viewport
    //         const offsetX = e.clientX - draggable.getBoundingClientRect().left;
    //         const offsetY = e.clientY - draggable.getBoundingClientRect().top;

    //         document.addEventListener('mousemove', onMouseMove);
    //         document.addEventListener('mouseup', onMouseUp);

    //         function onMouseMove(e) {
    //             if (!isDragging) return;

    //             // gives new horizontal and vertical position of the draggable element
    //             const x = e.clientX - offsetX;
    //             const y = e.clientY - offsetY;

    //             // ensure draggable div doesn't overflow the screen
    //             const maxX = window.innerWidth - draggable.offsetWidth;     // max horizontal position for a draggable element 
    //             const maxY = window.innerHeight - draggable.offsetHeight;
    //             const clampedX = Math.min(Math.max(0, x), maxX);    //to ensure the draggable element doesnot exceed boundaries
    //             const clampedY = Math.min(Math.max(0, y), maxY);

    //             draggable.style.left = clampedX + 'px';
    //             draggable.style.top = clampedY + 'px';
    //         }

    //         function onMouseUp() {
    //             isDragging = false;
    //             document.removeEventListener('mousemove', onMouseMove);
    //             document.removeEventListener('mouseup', onMouseUp);
    //         }
    //     });
    // }



    hideWebContent() {
        let search = window.location.search;

        if (search && search.length > 0) {
            let urlp = new URLSearchParams(search)
            let isFrame = urlp.get('botIframe') || '';
            let tagRemove = urlp.get('removeByTag') ? urlp.get('removeByTag').split(",") : '';
            let IdRemove = urlp.get('removeById') ? urlp.get('removeById').split(",") : '';
            let ClassRemove = urlp.get('removeByClassName') ? urlp.get('removeByClassName').split(",") : '';
            if (isFrame || isFrame == true) {
                for (let ar of ClassRemove) {
                    document.getElementsByClassName(ar)[0] ? document.getElementsByClassName(ar)[0].style.display = 'none' : ''
                }
                for (let ar of tagRemove) {
                    document.getElementsByTagName(ar)[0] ? document.getElementsByTagName(ar)[0].style.display = 'none' : ''
                }
                for (let ar of IdRemove) {
                    document.getElementsById(ar)[0] ? document.getElementsByTagId(ar)[0].style.display = 'none' : ''
                }
                return true;
            }
            return false
        }
    };

    bindIframe(botStyle) {
        var webBody = document.getElementsByTagName("BODY")[0];
        let iframediv = document.createElement("div");
        this.iframeprop = document.createElement("iframe");
        this.iframeprop.setAttribute("id", "palmind");
        iframediv.appendChild(this.iframeprop);
        webBody.appendChild(iframediv);
        iframediv.setAttribute("id", botStyle.bot_id);
        iframediv.setAttributesiframe(botStyle.style);
        this.iframeprop.setAttributesiframe(botStyle.allow);
        this.iframeprop.setAttribute("title", "Palmbot");
    };
    getBasePath() {
        return document.getElementById("palmbot").getElementsByTagName("iframe")[0].src;
    };

    cacheDOM() {
        this.$palmBot = document.getElementById("palmbot");
        this.$crossBtn = document.createElement("button");
        this.$roundBtn = document.createElement("div");
        // this.$drag = document.createElement("div")
        this.$d1 = document.createElement("div");
        this.$d1.setAttribute("id", "d1box");
        this.$roundBtnImg = document.createElement("img");
        this.$roundBtnImgDiv = document.createElement("div");
        this.$d2 = document.createElement("div");
        this.$para = document.createElement("img");
    };

    render() {
        this.$roundBtn.id = "round-btn";
        document.body.appendChild(this.$roundBtn);

        //popup for close bot
        this.$popUpMainDiv = document.createElement("div");
        this.$popUpMainDiv.classList.add("popUpMainDiv");

        this.$popUpDiv = document.createElement("div");
        this.$popUpDiv.classList.add("popupDiv");
        this.$popUpDiv.setAttribute("id", "popUp");

        this.$popUpMessage = document.createElement("div");
        this.$popUpMessage.innerHTML =
            "Do you really want to close or continue ?";
        this.$popUpMessage.classList.add("popUpMessage");

        this.buttondiv = document.createElement('div');
        this.buttondiv.classList.add('buttonDiv');

        this.$continueBtn = document.createElement("button");
        this.$continueBtn.innerHTML = "continue";
        this.$continueBtn.classList.add("continuebtn");

        this.$closeBtn = document.createElement("button");
        this.$closeBtn.classList.add("closebtn");
        this.$closeBtn.innerHTML = "close";

        this.buttondiv.appendChild(this.$continueBtn)
        this.buttondiv.appendChild(this.$closeBtn);

        this.$popUpMainDiv.appendChild(this.$popUpDiv);
        this.$popUpDiv.appendChild(this.$popUpMessage);
        // this.$popUpDiv.appendChild(this.$continueBtn);
        // this.$popUpDiv.appendChild(this.$closeBtn);
        this.$popUpDiv.appendChild(this.buttondiv)

        this.$palmBot.appendChild(this.$popUpMainDiv);
        this.$roundBtnImgDiv.classList.add("roud-btn-img-div");
        this.$roundBtnImg.classList.add("round-btn-img");
        this.$roundBtnImg.setAttribute(
            "src",
            `${this.baseUrl}/images/menu/mascot.gif`
        );
        // this.$drag.setAttribute('id', 'dragDiv');
        this.$roundBtnImgDiv.appendChild(this.$roundBtnImg);
        this.$d1.classList.add("round-btn-div");
        this.$d2.classList.add("round-box-div");
        this.$d1.appendChild(this.$d2)
        this.$d1.appendChild(this.$roundBtnImgDiv);
        // this.$palmBot.appendChild(this.$drag)
        // $('#dragDiv').css("visibility", "hidden");
        this.$roundBtn.appendChild(this.$d1);
        this.$d1.addEventListener("click", this.roundBtnClicked.bind(this));
        this.$crossBtn.addEventListener("click", this.crossBtnClicked.bind(this));
        this.$closeBtn.addEventListener("click", this.closeBtnClicked.bind(this));
        this.$continueBtn.addEventListener("click", this.continueBtnClicked.bind(this));
        this.$d2.appendChild(this.$para)
        this.$para.setAttribute(
            "src",
            `${this.baseUrl}/images/menu/greeting-logo.png`
        )
        this.$para.setAttribute("class", "blink")
        this.$para.classList.add("text_paragraph");
        this.$crossBtn.classList.add("cross-btn");
        this.$crossBtn.setAttribute("id", "hideCrossBtn");
        let $del = document.createElement('i')
        $del.setAttribute("class", "fa");
        $del.setAttribute('id', 'cross-icon')
        $del.innerHTML = "&#xf00d;"
        this.$crossBtn.appendChild($del);
        this.$palmBot.appendChild(this.$crossBtn);
    };

    roundBtnClicked(event, type = null) {

        $('.popUpMainDiv').css("visibility", "hidden");

        
        // Start of Subscription user for push notification
        async function subcribePushNotifications() {
            try {
                let visitorId = cookie.getCookie('uniqueID');
                let URL = `${env.protocol}://${env.server}:${env.port}${env.basePath}pushnotification/getVisitors/suscribed`;

                const response = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        visitor_id: visitorId
                    })
                });

                const visitor = await response.json();

                if (!visitor.is_register) {
                    getUserToken();
                }
            } catch (error) {
                // Handle errors here
                console.error(error);
            }
        }
        // End of Subscription user for push notification

        async function checkNotificationPermission() {
            if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        await subcribePushNotifications();
                    } else if (permission === 'denied') {
                        console.log('Permission for notifications was denied');
                    } else if (permission === 'default') {
                        console.log('Permission request was dismissed');
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log('This browser does not support notifications and firebase');
            }
        }

        checkNotificationPermission();

        if (event) {
            event.stopPropagation();
        }
        // this.$popMessage.remove();
        this.visitor.showBot = !this.showBot
        this.showBot = !this.showBot;
        $('#hideCrossBtn').css("visibility", "visible");
        this.$palmBot.classList.remove("closed");
        this.$palmBot.classList.add("opened");


        this.toggleBot();
        if (!this.botLoaded) {
            try {
                $("#round-btn .popup-banner").append(
                    `<img src="${this.baseUrl}/images/embed/loading.gif" class="loading" alt="Loading..."  width="60" height="60" style="position: absolute; top: 40px; left:50px;">`
                );
                $("#palmbot iframe").on('load', this.initToggle.bind(this));
                this.visitor.botLoaded = true
                this.botLoaded = true;
                this.visitor.resetNotification()


            } catch (err) {
                console.error(err.message);
            }
        } else {
            this.toggleBot();
        }
        if (type) {
            this.visitor.webAppendButtoClicked()
        }



    };
    initToggle() {
        this.toggleBot();
    };
    toggleBot() {
        if (this.showBot) {
            this.$palmBot.classList.add("toggle");
            this.$roundBtn.classList.add("toggle");
            document.getElementById("round-btn").style.visibility = "hidden";
        } else {
            this.$palmBot.classList.remove("toggle");
            this.$roundBtn.classList.remove("toggle");
            this.$roundBtnImg.setAttribute(
                "src",
                `${this.baseUrl}/images/menu/mascot.gif`
            );
            document.getElementById("round-btn").style.visibility = "visible";
        }
        this.appendButtonWebpage()
    };
    crossBtnClicked(event) {
        $(".popupDiv").css("visibility", "visible");
        $("#popDiv").css("visibility", "visible");
        $('.popUpMainDiv').css("visibility", "visible");

        if (event) {
            event.stopPropagation();
        }
        try {
            let $img = $("#round-btn .loading");
            if ($img.length) {
                $img.remove();
            }
        } catch (err) {
            console.log(err.message);
        }
        $("#popUp").show();
    };
    closeBtnClicked(event) {

        if (event) {
            event.stopPropagation();
        }
        try {
            let $img = $("#round-btn .loading");
            if ($img.length) {
                $img.remove();
            }
        } catch (err) {
            console.log(err.message);
        }

        this.showBot = false;
        this.visitor.showBot = false
        this.visitor.resetNotification()
        this.toggleBot();
        $("#popUp").hide();
        $('#hideCrossBtn').css("visibility", "hidden");
        this.$palmBot.classList.add("closed");
        this.$palmBot.classList.remove("opened");


    };

    continueBtnClicked() {
        $(".popupDiv").css("visibility", "hidden");
        $("#popDiv").css("visibility", "hidden");
        $('.popUpMainDiv').css("visibility", "hidden");

        this.toggleBot();
    };
}


let ObjEmbeded = new BotEmbeded();


function googleAnalyticsSetter() {
    $("head").append(`

    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', "${env.analyticsId}", 'auto');
    ga('send', 'pageview');
    </script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${env.analyticsId}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', "${env.analyticsId}", { 'groups': 'palmMindOld'});
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
}
function Botfunction(id, height, width, allow) {

    let clientConfig = {
        bot_id: id,
        style: {
            "max-height": height,
            "width": width,
        },
        allow: {
            'allow': allow,
        }
    }
    document.addEventListener("DOMContentLoaded", function () {
        ObjEmbeded.init(clientConfig);
        googleAnalyticsSetter()
    });

}



Botfunction('palmbot', '92vh', '100%', ['microphone']);


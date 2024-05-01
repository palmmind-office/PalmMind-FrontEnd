import { socketModule } from "../core/socket";

export var liveChatRequestPopup = {
    data: {},
    init: function (data) {
        this.data = data;
        console.log(data)
        this.cacheDOM();
        this.render();
    },
    cacheDOM: function () {
        this.$frame = $('#frame');
    },
    render: function () {

        //*************popUpMessage On live chat request************
        this.$container = $(`<div class="popUpContainer" id="popUpRequest"></div>`);
        this.$container.css({
            "position": "absolute",
            "background-color": "rgb(0 0 0 / 38%)",
            "height": "100%",
            "width": "100%",
            "z-index": "99999999999",
            "border-radius": "20px"
        })
        this.$popUpMainDiv = $(`<div class="popUpMainDiv"></div>`)
        this.$popUpMainDiv.css({
            "position": "absolute",
            "display": "flex",
            "flex-direction": "column",
            "background": "#fff",
            "padding": "25px",
            "margin": "30px",
            "border-radius": "20px",
            "border": "2px solid #0171bb",
            "text-align": "center",
            "justify-content": "center",
            "top": "25%"
        })
        this.$popDiv = $(`<div id="popDiv"></div>`)
        this.$popUpDiv = $(`<div id="popUp" class="popupDiv"></div>`)
        this.$popUpMessage = $(`<div class="popUpMessage">${this.data.text}</div>`)
        console.log(this.data.message,"dsakjfbsdhjfhjsda j")
        this.$agentMessage=$(`<div><p style="font-size: 13px;"> 💬 <b style="text-transform: uppercase;font-size: 14px;">${this.data.agentName}:</b> ${this.data.message}<span></span></p></div>`);

        this.$popUpMessage.css({
            "color": "#0171bb",
            "font-weight": "bold",
            "margin-bottom": "10px",
        })
        this.$popUpMessage.appendTo(this.$popUpDiv);
        this.data.message &&    this.$agentMessage.appendTo(this.$popUpDiv)
     
        this.$BtnDiv = $(`<div></div>`);
        this.$BtnDiv.css({
            "display": "flex",
            "flex-direction": "row",
            "gap": "2rem"
        })
        this.data.buttons.forEach(element => {
            this.$Btn = $(`<button class="btn btn-primary">${element.title}</button>`);
            this.$Btn.on("click", () => {
                let payload = {
                    title: element.title,
                    payload: element.payload
                }
                socketModule.messageSend(payload)
                this.$container.remove();
            })

            if(element.title === "Reject"){
                this.$Btn.css({
                    "background": "#bf1c1c",
                    "border": "unset"
                })
            }
            this.$Btn.appendTo(this.$BtnDiv);
        })
        this.$BtnDiv.appendTo(this.$popUpDiv);
        this.$popUpDiv.appendTo(this.$popDiv);
        this.$popDiv.appendTo(this.$popUpMainDiv);
        this.$popUpMainDiv.appendTo(this.$container);
        this.$container.appendTo(this.$frame);
        setTimeout(function(){
            this.$container.remove();
        }.bind(this),180000)

    },

    clear: function() {
        if (this.$container){
            this.$container.remove();
        }
    }
}















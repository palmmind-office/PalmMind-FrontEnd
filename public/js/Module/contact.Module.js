import { socketModule } from '../core/socket';
import { env } from '../../env';

export var contactmodule = {
    data: {},
    init: function (data) {
        this.data = data;
        this.cacheDOM();
        this.render();
    },
    cacheDOM: function () {
        this.$message = $('#message-module');
    },
    scrollBottom: function () {
        $(".messages").animate({
            scrollTop: $('#message-module')[0].scrollHeight
        }, "fast");
    },
    render: function () {
        if (this.$container) {
            this.$container.remove();
        }
        this.$container = $(`<div id="contactmodule"></div>`);
        let renderTextNode = Array.isArray(this.data.title) ? (this.data.title.length > 0) : this.data.title;
        if (renderTextNode) {
            let parentElem = this.$message.find('.message-section').find('ul');
            let text = Array.isArray(this.data.title) ? this.data.title.join('<br>') : this.data.title;
            // let node = $(`<li class="sent"><img src="${env.Orgimg}" alt=""><p style="margin-bottom:5px;">${text}</p></li>`);
            // node.appendTo(parentElem);

            let li = $(`<img id="sentImage" src="${env.Orgimg}" alt=""><p class="quickReplyPara" style="margin-bottom:5px;">${text}</p>`)
            this.node = $(
                `<li class="sent"></li>`
            );
            li.appendTo(this.node)
            this.node.appendTo(parentElem);
        }


        if (this.data.data) {
            // console.log(this.data, "contact module")
            let container = $(`<div class="contactcard"></div>`);
            container.css({
                'position': 'relative',
                'top': '6px'
            })
            container.appendTo(this.$container);
            let name = $(`<h6 class="font-weight-bold text-center">${this.data.data.Name}</h6>`)
            name.css({ 'color': '#1C77BB' })
            // this.cancelbutton = $(`<img src='images/close.png'></img>`)
            this.cancelbutton = $(`<i class="fa" id="cross-btn">&#xf00d;</i>`)
            this.cancelbutton.css({ "width": "13px", "margin-top": "4px", "float": "right", "position": "relative", "left": "10px", "color": "red", "margin-top": "-2px", "cursor": "pointer" })
            this.cancelbutton.appendTo(container);
            if (this.data.backIcon) {
                let payloads = { title: this.data.backIcon.title, payload: this.data.backIcon.payload }
                this.cancelbutton.click(() => {
                    // socketModule.messageSend(payloads);
                    this.clear();
                })
            }
            name.appendTo(container)
            let subtitle = $(`<p class="text-center">${this.data.data.subtitle}</p>`);
            subtitle.css({ "border-bottom": "2px solid #1C77BB", 'padding-bottom': '10px', 'font-size': '12px', 'font-weight': '500', 'line-height': '14px' });
            subtitle.appendTo(container);
            const listinfo = $(`<div class="contactlist"></div>`).appendTo(container);
            const ul = $(`<ul></ul>`).appendTo(listinfo);
            this.data.data.info.forEach(element => {
                if (element.key === 'Email') {
                    const list = $(`<li style="display:flex"><span style="font-size: 13px;
                    font-weight: 700;">${element.title}:</span> <span style="font-size: 13px;
                    padding: 0px 6px;"><a href="mailto:${element.value}?subject=Contact US" id="tel_phone">${element.value}</a></span></li>`);
                    list.appendTo(ul)
                }
                if (element.key === 'Phone') {
                    let phonenumber = element.value.split('/')
                    let num1 = phonenumber[0]
                    let num2 = phonenumber[1]
                    // console.log(num1)
                    // console.log(phonenumber, "phonenumber")
                    const list = $(`<li style="display:flex"><span style="font-size: 13px;
                    font-weight: 700;">${element.title}:</span> <span style="font-size: 13px;
                    padding: 0px 6px;"><a href="tel:${num1}" id="tel_phone">${num1}</a></span></li>`);
                    list.appendTo(ul)
                }
                if (element.key === 'toll-free') {
                    // let phonenumber = element.value.split('/')
                    // let num1=phonenumber[0]
                    // let num2=phonenumber[1]
                    // console.log(num1)
                    // console.log(phonenumber, "phonenumber")
                    const list = $(`<li style="display:flex"><span style="font-size: 13px;
                    font-weight: 700;">${element.title}:</span> <span style="font-size: 13px;
                    padding: 0px 6px;"><a href="tel:${element.value}" id="tel_phone">${element.value}</a></span></li>`);
                    list.appendTo(ul)
                }
                if (element.key === 'Fax') {
                    const list = $(`<li style="display:flex"><span style="font-size: 13px;
                        font-weight: 700;">${element.title}:</span> <span style="font-size: 13px;
                        padding: 0px 6px;">${element.value}</span></li>`);
                    list.appendTo(ul)
                }
            });
            if (this.data.data.hasOwnProperty("button")) {
                const btn = $(`<button class="btn">${this.data.data.button.title}</button>`);
                btn.css({ "background-color": '#1C77BB' })
                btn.appendTo(container);
                btn.click(em => {
                    em.preventDefault();
                    const payload = this.data.data.button.payload
                    let payload1 = { title: this.data.data.button.title, payload: this.data.data.button.payload }
                    if (payload) {
                        socketModule.messageSend(payload1);
                    }
                    if (payload === undefined) {
                        let link = this.data.data.button.link;
                        window.open(link, '_blank');
                    }
                })
            }

            // for social media link <a target="_blank" href=fab fa-facebook-f  aria-hidden="true" ></a>
            this.social_div = $('<div class="d-flex justify-content-center"></div>').appendTo(this.$container)
            this.social_div.css({
                "position": "relative",
                "top": "3px"
            })
            this.data.data.facebook.map(elem => {
                this.Social_fb = $('<div class="m-2 social_div"></div>').appendTo(this.social_div)
                this.social_link = $(`<a target="_blank" href=${elem.link}><img src=${elem.img} class="social" style="width:30px;border-radius:50%;"></a>`).appendTo(this.Social_fb)
            })

        }
        if (renderTextNode || this.data.data.length) {
            this.$container.appendTo(this.node);
        }
        this.scrollBottom();
    },
    clear: function () {
        if (this.$container) {
            this.$container.remove();
        }
    },
}
















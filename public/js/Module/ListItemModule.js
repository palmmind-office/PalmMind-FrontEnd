import { env } from '../../env';
import { socketModule } from '../core/socket';
import { googleAnalytics } from '../general/googleAnalytics';
import moment from "moment";

export var ListItemModule = {
    data: {},
    init: function (data) {
        this.data = data;
        this.cacheDOM();
        this.render();
        this.bindEvents();
    },
    cacheDOM: function () {
        this.$message = $('#message-module');
        this.$toastmessage = $('#botinitialised')
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
        this.$container = $(`<div id="Itemlist"></div>`);
        let renderTextNode = Array.isArray(this.data.title) ? (this.data.title.length > 0) : this.data.title;
        // if (renderTextNode) {
            let parentElem = this.$message.find('.message-section').find('ul');
            let text = Array.isArray(this.data.title) ? this.data.title.join('<br>') : this.data.title;
            let node = $(`<li class="sent"><img id="sentImage" src="${env.Orgimg}" alt=""><p id="utterPara" style="margin-bottom:5px;"><span style="color: #1C77BB;font-weight: 800;">${env.botName}</span>${text}<span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p></li>`);
            node.appendTo(parentElem);
        // }
        if (this.data.data) {
            let ul = $('<div/>');
            ul.css({
                "padding-left": "0px"
            })
            this.data.data.forEach(element => {
                let li = $(`<li></li>`).appendTo(ul);
                let a = $(`<a href="#" class="Litem">${element.subtitle}</a>`).appendTo(li);
                if (element.subdata) {
                    li.addClass('List_item_list')
                    let sublist = $(`<div class="pl-2" style="font-size:11px;pointer-events:none;color:#1C77BB;">${element.subdata.detail}</div>`).appendTo(li)
                    let payload = { title: element.subdata.title, payload: element.subdata.payload }
                    let cart_down= $('<img src="images/embed/down.png" style="width:12px;height:12px;" />')
                    cart_down.css({"font-size":"14px"})
                    let cart_up=$('<img src="images/embed/up.png" style="width:12px;height:12px;" />')
                    cart_down.appendTo(a)
                    cart_up.appendTo(a)
                    cart_up.hide()
                    sublist.hide()
                    let toggle=false
                    li.click(()=>{
                        if(toggle === false){
                            toggle=true
                            cart_down.hide()
                            cart_up.show()
                            sublist.show()
                            }
                        else if(toggle === true){
                            toggle =false
                            sublist.hide()
                            cart_down.show()
                            cart_up.hide()
                        }
                    })
                    sublist.on('click', function () {
                        this.clear();
                        if (element.subdata.payload) {
                            socketModule.messageSend(payload)
                        } else {
                            window.open(element.subdata.link)
                        }
                    }.bind(this))
                }
                if(element.hasOwnProperty('data')){
                    li.addClass('List_item_list')
                    let listSub_data = $('<ul></ul>')
                    listSub_data.css({"margin-bottom":" 1rem"})
                    listSub_data.appendTo(li)
                    let cart_down= $('<i class="fa fa-caret-down ml-3" aria-hidden="true"></i>')
                    let cart_up=$('<i class="fa fa-caret-up ml-3" aria-hidden="true"></i>')
                    cart_down.appendTo(a)
                    cart_up.appendTo(a)
                    cart_up.hide()
                    listSub_data.hide()
                    let toggle=false
                    element.data.forEach(el=>{
                        let list_li =$(`<li class="list_style">${el.title}</li>`)
                        list_li.css({'font-size':'12px'})
                        list_li.appendTo(listSub_data)
                       li.click(()=>{
                            if(toggle === false){
                                toggle=true
                                cart_down.hide()
                                cart_up.show()
                                listSub_data.show()
                                }
                            else if(toggle === true){
                                toggle =false
                                listSub_data.hide()
                                cart_down.show()
                                cart_up.hide()
                            }
                        })
                        
                        list_li.click(()=>{
                            if(el.payload){
                                let payload ={title:el.title,payload:el.payload}
                                socketModule.messageSend(payload)
                            }
                            if(el.link){
                                window.open(el.link,'_blank')
                            }
                        })
                    })
                }
                if (this.data.multi) {
                    ul.css({
                        "margin-left": " -54px"
                    })
                }
                let ico = $(``).appendTo(a);
                if (element.hasOwnProperty('link')) {
                    li.click(function () {
                        let link1 = element.link;
                        window.open(link1, '_blank');
                        googleAnalytics.recordEvent({
                            eventCategory: element.subtitle,
                            eventAction: link1
                        });
                    })
                }
                if (element.hasOwnProperty('payload')) {
                    li.click(function () {
                        let payload = {title:element.subtitle,payload:element.payload};
                        googleAnalytics.recordEvent({
                            eventCategory: element.subtitle,
                            eventAction: payload
                        });
                        socketModule.messageSend(payload);
                    })
                }
            });
            if (this.data.hasOwnProperty("subtitle")) {
                let c = $(`<div class="Itemlist text-center"></div>`);
                let subtitle = $(`<h6>${this.data.subtitle}</h6><hr>`);
                subtitle.appendTo(c);
                c.appendTo(this.$container);
            }
            ul.appendTo(this.$container);
            if (this.data.hasOwnProperty("buttom")) {
                let but = $(`<a href="#" class="btn" id="seemorefacts">${this.data.buttom.title}</a>`);
                but.appendTo(this.$container);
            }
            // if(this.data.hasOwnProperty("catagoriesContext"))
            // {
            //     console.log(this.data.catagoriesContext);
            //     catagoriesContext.init(this.data.catagoriesContext);
            //     this.scrollBottom();
            // }
        }
        
        if(this.data.button){
            let button_div =  $('<div class="btnDiv"></div>')
            button_div.appendTo(this.$container)
            this.data.button.forEach(el=>{
                let button= $(`<button class="btn btn-primary">${el.title}</button>`)
                button.appendTo(button_div)
                 button.click(element=>{
                    if(el.payload){
                        googleAnalytics.recordEvent({
                            eventCategory: el.title,
                            eventAction: el.payload + " " + "About Chatbots", 
                            // eventLabel: this.data.type,
                        });
                    let payloads = {title:el.title,payload:el.payload}
                        socketModule.messageSend(payloads)
                    }
                    if(el.link){
                        window.open(el.link,'_blank')
                    }
                 })
            })
        }
        if (renderTextNode || this.data.data.length) {
          this.$container.appendTo(node);
      }
        
        let link = 'https://mail.zoho.com/zm/#mail/folder/inbox/p/1602660165641100003';
        $('#seemorefacts').on('click', function () {
            googleAnalytics.recordEvent({
                eventCategory: element.title,
                eventAction: link
            });
            window.open(link, '_blank');
        });
        this.scrollBottom();
    },
    clear: function () {
        if (this.$container) {
            this.$container.remove();
        }
    },
    bindEvents: function () {
        if (!this.$container) {
            return;
        }
    }
}
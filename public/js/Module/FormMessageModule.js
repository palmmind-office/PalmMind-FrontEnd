import { env } from "../../env";
import { LoadingModule } from "../general/loading";
import policySerrvice from "../sharedService/policyService";
import { PostService } from "../sharedService/postService";
import { generalReplyModule } from "./generalReplyModule";
import { cookie } from "../general/cookie"
import { renderPreviousButton } from "../sharedService/renderPrevButton";
import { quickReplyModule } from "./quickReplyModule";
import { socketModule } from "../core/socket";
import moment from "moment";
export var fomrMessageModule = {
    data: {},
    dataAll: [],
    post: '',
    utterance: [],
    submitedData: [],
    selectList: [],
    brandId: null,
    productId: null,
    i: 0,
    init: function (data) {
        this.data = data;
        this.post = data.post
        this.cacheDOM();
        this.bindEvents()
        this.render();

    },
    scrollBottom: function () {
        $("#FormMessageSection").animate({
            scrollTop: $('#FormMessageSection .message-section')[0].scrollHeight
        }, "fast");
    },
    cacheDOM: function () {
        this.$element = $('#contact-profile-module');
        this.$inputMsg = $('#message-input-module');
        this.$hideinput = $('#message-input-module .wrap');
        this.$hideinput_input = $('#message-input-module .wrap input');
        this.$frameContainer = $('#frame');
        this.$message = $('#message-module');
    },
    bindEvents: function () {
        let _this = this;
    },
    render: function () {
        this.Visiable("hide");
        this.$hideinput_input.prop("disabled", true);
        this.$menuContainer = $(`<div id="FormMessageSection" class="MessageSection"></div>`)
        this.$messageSec = $(` <div class="message-section"></div>`).appendTo(this.$menuContainer);
        this.ul = $(`<ul style="list-style:none;margin-left: -24px;"></ul>`).appendTo(this.$messageSec);
        this.$menuContainer.appendTo(this.$frameContainer);
        if (this.data) {
            this.data.form.elements.forEach(e => {
                if (e.utterances) {
                    e.utterances.forEach((u, index) => {
                        this.utterance.push(u);
                    })
                }
                this.dataAll.push(e)
            })
        }
        this.Rendertext(this.dataAll[this.i])

    },
    Rendertext: function (data) {
        if (data.hasOwnProperty('utterances')) {
            this.RenderUtterance(data)
            this.scrollBottom();
        }
        if (data.hasOwnProperty('title')) {
            this.RenderTitle(data)
            this.scrollBottom();
        }

    },
    RenderUtterance: function (data_utterance) {
        setTimeout(() => {
            data_utterance.utterances.forEach((element, index) => {
                $(`<li class='sent'><img id="sentImage" src="${env.Orgimg}" alt="" /><p id="utterPara"><span style="color: #1C77BB;font-weight: 800;">${env.botName}</span> ${element.message}<span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p></li>`).appendTo(this.ul)
                this.scrollBottom();
            })
            socketModule.socket.emit("message:sent",{
                formMessageSection:true,
                bot:true,
                payload:element.message,
                text:element.message
            })
        }, 1000);
    },
    RenderSend: function (replies_data) {
        $(`<li class='replies'><img id="utterImage" src="${env.clientimg}" alt="" /><p id="utterPara">${replies_data.title}</p></li>`).appendTo(this.ul);
        socketModule.socket.emit("message:sent",{
            formMessageSection:true,
            human:true,
            payload:replies_data.title,
            text:replies_data.title
        })
    },
    Visiable: function (visible) {
        if (visible === 'visible') {
            $('.initialForm').removeAttr("disabled");
            $('.LiveFormBtn').removeAttr("disabled");
            $('#outerDiv #context').css("visibility", "visible");
            $('#outerDiv').removeClass('without-after-element');
            $('.content .colorchooser').css("visibility", "visible");
            $('#autosuggest').html("");
            $('#autosuggest').css("visibility", "visible");
            this.$hideinput.css("visibility", "visible");
            this.$hideinput_input.removeAttr("disabled");
            $('.homehelp').removeAttr("disabled");
            $('.buttoncontainer').remove();
        }
        if (visible === 'hide') {
            this.$hideinput.css("visibility", "hidden");
            $('.initialForm').prop("disabled", true);
            $('.LiveFormBtn').prop("disabled", true);
            $('.homehelp').prop("disabled", true);
            $('#autosuggest').html('');
            $('#outerDiv #context').css("visibility", "hidden");;
            $('#outerDiv').addClass('without-after-element');
            $('.content .colorchooser').css("visibility", "hidden");
            this.$hideinput_input.prop("disabled", true);
        }
    },
    RenderTitle: function (d1) {
        setTimeout(async () => {
            $(`<li class='sent'><img src="${env.Orgimg}" alt="" /><p><span style="color: #1C77BB;font-weight: 800;">${env.botName}</span><span>${d1.title}</span><span id="messageTimeStamp">${moment(new Date()).format('h:mm a')}</span></p></li>`).appendTo(this.ul);
            this.scrollBottom()
            //check if type is textbox or not
            if (d1.type == 'textbox') {
                let inputdiv = $(`<div class="wrap1"></div>`).appendTo(this.$inputMsg);
                let crossbtn = $(`<button id="context12" title="Cancel" data-toggle="tooltip">
                                    <img src="images/banner/close.png" alt="cancel" style="width:20px;height:20px;">
                                </button>`).appendTo(inputdiv);
                crossbtn.click(() => {
                    this.exitcontainer(this.data);
                    this.Visiable("visible");
                    // return false;
                    // this.clear()
                    renderPreviousButton.init();
                })
                let inputtext = $(`<input type="${d1.order}" placeholder="${d1.placeholder}" autocomplete="off"/>`).appendTo(inputdiv);
                let btn = $(` <button class="submit">
                <img src="images/menu/paper-plane.png" alt="" style="width:30px;height:30px;">
                                </button>`).appendTo(inputdiv);


                $(window).on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        btn.trigger('click');
                    }
                });
                let types = d1.validation.type;
                if (types == 'mobile') {
                    inputtext.on('keypress', function (e) {
                        e.target.value = e.target.value.match(/^([^e+-]{0,9})/)[0]
                    })
                }
                if (types == 'name') {
                    inputtext.on('keypress', function (e) {
                        e.target.value = e.target.value.match(/[^0-9!!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
                    })
                }

                btn.click(function () {
                    let data1 = inputtext.val();
                    let type = d1.validation.type;

                    if (type == 'name') {
                        inputtext.removeClass('error1');
                        if (data1 == "exit") {
                            this.exitcontainer(this.data);
                            this.visible("visible");
                            return false;
                        }
                        if (data1 === "") {
                            inputtext.addClass('error1');
                            inputtext.attr('placeholder', '');
                            inputtext.attr('placeholder', `Field should not be empty`);
                            return false;
                        }
                        this.RenderSend({
                            title: data1
                        });
                        if (!isNaN(data1)) {
                            this.RenderTitle({ title: d1.validation.error });
                            return false;
                        }
                        let lebel = d1.label;
                        let label = {};
                        // label[lebel] = data1;
                        label['data'] = data1;
                        label["value"] = lebel;
                        this.submitedData.push(label);
                        this.Rendertext(this.dataAll[this.i + 1]);
                        this.i += 1;
                        inputdiv.remove();
                        this.scrollBottom();
                    }
                    // for text area
                    if (type == 'textArea') {
                        inputtext.removeClass('error1');
                        inputtext.attr('minlength', 20)
                        if (data1 == "exit") {
                            this.exitcontainer(this.data);
                            this.Visiable("visible");
                            return false;
                        }
                        if (data1 === "") {
                            inputtext.addClass('error1');
                            inputtext.attr('placeholder', '');
                            inputtext.attr('placeholder', `Complaint field should not be empty`);
                            return false;
                        }
                        this.RenderSend({
                            title: data1
                        });
                        if (data1.length < 20) {
                            this.RenderTitle({ title: d1.validation.error });
                            return false;
                        }
                        let lebel = d1.label;
                        let label = {};
                        label["data"] = data1;
                        label["value"] = lebel;
                        this.submitedData.push(label);
                        this.Rendertext(this.dataAll[this.i + 1]);
                        this.i += 1;
                        inputdiv.remove();
                        this.scrollBottom();
                    }

                    //for mobile validation
                    if (type == 'mobile') {
                        inputtext.removeClass('error1');
                        inputtext.attr('maxlength', 10)
                        if (data1 == "exit") {
                            this.exitcontainer(this.data);
                            this.Visiable("visible");
                            return false;
                        }
                        if (data1 === "") {
                            inputtext.addClass('error1');
                            inputtext.attr('placeholder', '');
                            inputtext.attr('placeholder', `Mobile Number should not be empty`);
                            return false;
                        }
                        this.RenderSend({
                            title: data1
                        });
                        if (data1.length <= 9 || data1.length > 10 || isNaN(data1)) {
                            this.RenderTitle({ title: d1.validation.error });
                            return false;
                        }
                        let lebel = d1.label;
                        let label = {};
                        label["data"] = data1;
                        label["value"] = lebel;
                        this.submitedData.push(label);
                        this.Rendertext(this.dataAll[this.i + 1]);
                        this.i += 1;
                        inputdiv.remove();
                        this.scrollBottom();
                    }

                    // for requested value 
                    if (type == 'requested_value') {
                        inputtext.removeClass('error1');
                        if (data1 == "exit") {
                            this.exitcontainer(this.data);
                            this.Visiable("visible");
                            return false;
                        }
                        if (data1 === "") {
                            inputtext.addClass('error1');
                            inputtext.attr('placeholder', '');
                            inputtext.attr('placeholder', `Requested Value should not be empty`);
                            return false;
                        }
                        this.RenderSend({
                            title: data1
                        });
                        let lebel = d1.label;
                        let label = {};
                        // label[lebel] = data1;
                        label['data'] = data1;
                        label["value"] = lebel;
                        this.submitedData.push(label);
                        this.Rendertext(this.dataAll[this.i + 1]);
                        this.i += 1;
                        inputdiv.remove();
                        this.scrollBottom();
                    }

                    // for dob validation
                    if (type == 'purchase_date') {
                        inputtext.removeClass('error1');
                        if (data1 == "exit") {
                            this.exitcontainer(this.data);
                            this.Visiable("visible");
                            return false;
                        }
                        if (data1 === "") {
                            inputtext.addClass('error1');
                            inputtext.attr('placeholder', '');
                            inputtext.attr('placeholder', `Requested Value should not be empty`);
                            return false;
                        }
                        this.RenderSend({
                            title: data1
                        });
                        let lebel = d1.label;
                        let label = {};
                        label['data'] = data1;
                        label["value"] = lebel;
                        this.submitedData.push(label);
                        this.Rendertext(this.dataAll[this.i + 1]);
                        this.i += 1;
                        inputdiv.remove();
                        this.scrollBottom();

                    }


                    //for Email validation
                    if (type == 'email') {
                        inputtext.removeClass('error1');
                        if (data1 === "exit") {
                            this.exitcontainer(this.data);
                            this.Visiable("visible");
                            return false;
                        }
                        if (data1 === "") {
                            inputtext.addClass('error1');
                            inputtext.attr('placeholder', '');
                            inputtext.attr('placeholder', `Email should not be empty`);
                            return false;
                        }
                        let regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                        var validEmail = regex.test(data1);
                        if (!validEmail) {
                            this.RenderTitle({ title: d1.validation.error });
                            return false;
                        }


                        let lebel = d1.label;
                        let label = {};
                        // label[lebel] = data1;
                        label['data'] = data1;
                        label["value"] = lebel;
                        this.submitedData.push(label);
                        this.RenderSend({
                            title: data1
                        });
                        this.Rendertext(this.dataAll[this.i + 1]);
                        this.i += 1;
                        inputdiv.remove();
                        this.scrollBottom();
                    }

                }.bind(this))
            }
            else if (d1.type === "select") {
                let div = $(`<div class="input-group d-inline-block formDateSupport"></div>`)
                let crossbtn = $(`<button id="context1234" title="Cancel" data-toggle="tooltip">
                <img src="images/banner/close.png" alt="cancel">
                 </button>`).appendTo(div);
                crossbtn.click(() => {
                    this.exitcontainer(this.data);
                    this.Visiable("visible");
                    div.remove();
                    renderPreviousButton.init();
                })
                let countryDropdowncontent = $(`<select class="mdb-select md-form"></select>`).appendTo(div);
                $(`<option value="${d1.placeholder}" disabled selected>${d1.placeholder}</option>`).appendTo(countryDropdowncontent);
                d1.selectvalue.forEach((elements) => {
                    $(`<option value="${elements}">${elements}</option>`).appendTo(countryDropdowncontent);
                })
                let btn = $(` <button type="button" class="btn btn-outline-secondary">
                 <img src="images/menu/paper-plane.png" alt="" style="width:30px;height:30px;"></button>`).appendTo(div);
                div.appendTo(this.$inputMsg);
                $(window).on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        btn.trigger('click');
                    }
                });
                btn.click(function () {
                    let p = countryDropdowncontent.val();
                    if (p === "" || p === null || p === d1.placeholder) {
                        countryDropdowncontent.attr('placeholder', '');
                        countryDropdowncontent.attr('placeholder', `please choose specific one`);
                        return false;
                    }
                    this.submitedData.push({
                        "data": p,
                        "value": d1.label
                    });
                    this.RenderSend({
                        title: p
                    });
                    this.Rendertext(this.dataAll[this.i + 1]);
                    this.i += 1;
                    this.scrollBottom();
                    div.remove();
                }.bind(this));

            }
            else if (d1.type === "selectAPIdata") {
                let div = $(`<div class="input-group d-inline-block formDateSupport"></div>`)
                let crossbtn = $(`<button id="context1234" title="Cancel" data-toggle="tooltip">
                <img src="images/banner/close.png" alt="cancel">
                 </button>`).appendTo(div);
                crossbtn.click(() => {
                    this.exitcontainer(this.data);
                    this.Visiable("visible");
                    div.remove();
                    renderPreviousButton.init();
                })
                let countryDropdowncontent = $(`<select class="mdb-select md-form"></select>`).appendTo(div);
                $(`<option value="${d1.placeholder}" disabled selected>${d1.placeholder}</option>`).appendTo(countryDropdowncontent);

                if (d1.label === "productId") {
                    let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}cg/products`;
                    let response = await this.captureLeads({ brandId: this.brandId }, url)
                    response = await response.json();
                    d1.selectvalue = response || [];
                }
                d1.selectvalue.forEach((elements) => {
                    $(`<option value="${elements.id}">${elements.name}</option>`).appendTo(countryDropdowncontent);
                })

                let btn = $(` <button type="button" class="btn btn-outline-secondary">
                 <img src="images/menu/paper-plane.png" alt="" style="width:30px;height:30px;"></button>`).appendTo(div);
                div.appendTo(this.$inputMsg);
                $(window).on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        btn.trigger('click');
                    }
                });
                btn.click(function () {
                    let p = countryDropdowncontent.val();
                    if (p === "" || p === null || p === d1.placeholder) {
                        countryDropdowncontent.attr('placeholder', '');
                        countryDropdowncontent.attr('placeholder', `please choose specific one`);
                        return false;
                    }
                    this.submitedData.push({
                        "data": p,
                        "value": d1.label
                    });
                    if (d1.label === 'brandId') {
                        this.brandId = p
                    }

                    if (d1.label === 'productId') {
                        this.productId = p
                    }
                    if(d1 && d1.selectvalue.length>0){
                        this.renderValue=d1.selectvalue.filter((em)=>{
                            if(em.id==p){
                                return em
                            }
                        })
                        this.RenderSend({
                            title: this.renderValue[0].name
                        });
                    }
                   
                   
                    this.Rendertext(this.dataAll[this.i + 1]);
                    this.i += 1;
                    this.scrollBottom();
                    div.remove();
                }.bind(this));

            }
            else if (d1.type === "autocomplete") {
                let div = $(`<div class="input-group d-inline-block formDateSupport"></div>`)
                let crossbtn = $(`<button id="context1234" title="Cancel" data-toggle="tooltip">
                <img src="images/banner/close.png" alt="cancel">
                 </button>`).appendTo(div);
                crossbtn.click(() => {
                    this.exitcontainer(this.data);
                    this.Visiable("visible");
                    div.remove();
                    renderPreviousButton.init();
                })
                if (d1.label === "model_number") {
                    let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}cg/models`;
                    let response = await this.captureLeads({ productId: this.productId }, url)
                    response = await response.json();
                    d1.for = response || [];

                }
                let countryDropdowncontent = $(`<select class="mdb-select md-form"></select>`).appendTo(div);
                $(`<option value="${d1.placeholder}" disabled selected>${d1.placeholder}</option>`).appendTo(countryDropdowncontent);
                d1.for.forEach((elements) => {
                    $(`<option value="${elements}">${elements}</option>`).appendTo(countryDropdowncontent);
                })
                countryDropdowncontent.select2();

                let btn = $(` <button type="button" class="btn btn-outline-secondary">
                 <img src="images/menu/paper-plane.png" alt="" style="width:30px;height:30px;"></button>`).appendTo(div);
                div.appendTo(this.$inputMsg);
                $(window).on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        btn.trigger('click');
                        $(".select2-container").remove();
                    }
                });
                btn.click(function () {
                    let p = countryDropdowncontent.val();
                    if (p === "" || p === null || p === d1.placeholder) {
                        countryDropdowncontent.attr('placeholder', '');
                        countryDropdowncontent.attr('placeholder', `please choose one`);
                        return false;
                    }
                    this.submitedData.push({
                        "data": p,
                        "value": d1.label
                    });
                    this.RenderSend({
                        title: p
                    });
                    this.Rendertext(this.dataAll[this.i + 1]);
                    this.i += 1;
                    this.scrollBottom();
                    div.remove();
                }.bind(this));

            }

            else if (d1.type === "uploadFile") {
                let div = $(`<div class="input-group d-inline-block formDateSupport"></div>`);
                let crossbtn = $(`<button id="context1234" title="Cancel" data-toggle="tooltip">
                <img src="images/banner/close.png" alt="cancel">
                 </button>`).appendTo(div);
                crossbtn.click(() => {
                    this.exitcontainer(this.data);
                    this.Visiable("visible");
                    div.remove();
                    return false;
                });
                let multiform = $(`<div class="multipart1"></div>`).appendTo(div);
                multiform.css({ "padding": "0px 10px 5px 10px" });
                let input = $(`<input type="file" id="files" name="files" multiple/>`);
                input.css({ "font-size": "12px", "height": "25px" })
                input.appendTo(multiform);


                let btn = $(` <button type="button" class="btn btn-outline-secondary">
                <img src="images/menu/paper-plane.png" alt="" style="width:30px;height:30px;"></button>`).appendTo(div);
                div.appendTo(this.$inputMsg);
                $(window).on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        btn.trigger('click');
                    }
                });
                btn.click(function () {

                    let p = input.prop('files').length;
                    if (p === "" || p === null || p < 1) {
                        this.RenderTitle({ title: "please select at least one" });
                        return false;
                    }
                    this.submitedData.push({
                        "data": input.prop('files')[0],
                        "value": d1.label
                    });
                    this.RenderSend({
                        title: "File Selected"
                    });
                    this.Rendertext(this.dataAll[this.i + 1]);
                    this.i += 1;
                    this.scrollBottom();
                    div.remove();
                }.bind(this));
            }
            //check type is date or not
            else if (d1.type == 'date' || d1.type == 'FromDate' || d1.type == 'ToDate') {
                // inputtext.removeClass('error1');
                let container = $(`<div class="input-group d-inline-block formDateSupport"></div>`);
                let crossbtn = $(`<button id="context123" title="Cancel" data-toggle="tooltip">
                <img src="images/banner/close.png" alt="cancel">
                 </button>`).appendTo(container);
                crossbtn.click(() => {
                    this.exitcontainer(this.data);
                    this.Visiable("visible");
                    container.remove();
                    // return false;
                    //    this.clear()
                    renderPreviousButton.init();
                })
                let inputtime = $(`<input style="padding: 10px;text-align: center;" class="mobiscroll"></input>`).appendTo(container);
                inputtime.attr('placeholder', d1.placeholder);
                inputtime.attr('type', d1.order);
                let btn = $(` <button type="button" class="btn btn-outline-secondary">
                <img src="images/menu/paper-plane.png" alt="" style="width:30px;height:30px;"></button>`).appendTo(container);
                setTimeout((function () {
                    inputtime.scroller({
                        theme: 'ios',
                        preset: 'date',
                        dateFormat: 'yy-mm-dd'

                    });
                }), 0);
                container.appendTo(this.$inputMsg);
                $(window).on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        btn.trigger('click');
                    }
                });
                btn.click(function () {
                    let p = inputtime.val();
                    if (p === "") {
                        // inputtext.addClass('error1');
                        inputtime.attr('placeholder', '');
                        inputtime.attr('placeholder', `please choose spesific date`);
                        return false;
                    }
                    this.submitedData.push({
                        "data": p,
                        "value": d1.label
                    });
                    this.RenderSend({
                        title: p
                    });
                    this.Rendertext(this.dataAll[this.i + 1]);
                    this.i += 1;
                    this.scrollBottom();
                    container.remove();
                }.bind(this));
            }
            else if (d1.type == 'submitbutton') {
                this.FormSubmisson(d1)
            }
            socketModule.socket.emit("message:sent",{
                formMessageSection:true,
                bot:true,
                payload:d1.title,
                text:d1.title
            })
        }, 1700)
    },
    multipartLeadsCapture: function (leads) {
        let formdata = new FormData();

        Object.keys(leads).forEach(em => {
            formdata.append(em, leads[em]);
        })

        let url = `${this.post}`;
        return fetch(url, {
            method: 'POST',
            body: formdata
        });


    },
    captureLeads: async function (leads, passUrl = null) {
        // let url = `${this.post}`;
        let url = passUrl ? passUrl : `${env.protocol}://${env.server}:${env.port}${this.post}`;
       
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leads)
        });
    },
    postToDashboard: async function(leads){
                
        let url = `${env.protocol}://${env.server}:${env.port}/${this.data.action}`;             
        console.log(url,"urlss")
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leads)
        });              
    },
    FormSubmisson: function (lastitem) {
        let btnContainer = $(`<div class="buttoncontainer"></div>`).appendTo(this.$inputMsg);
        lastitem.button.forEach(buttons => {
            // console.log("buttons",buttons)
            let button = $(`<input type="button" class="${buttons.type}" value="${buttons.submit}">`).appendTo(btnContainer);
            $(window).on('keydown', function (e) {
                if (e.keyCode === 13) {
                    button.trigger('click');
                }
            });
            button.click(function (event) {
                if (buttons.type == "submit") {
                    button.prop("disabled", true);
                    button.prop("value", "Please wait..");
                    LoadingModule.init('#FormMessageSection');
                    let leadcaptureData = this.submitedData;
                    const convertArrayToObject = (array, key) => {
                        const initialValue = {};
                        return array.reduce((obj, item) => {
                            return {
                                ...obj,
                                [item[key]]: item.data,
                            };
                        }, initialValue);
                    };
                    let formData = convertArrayToObject(leadcaptureData, "value");
                    let visitor = cookie.getCookie('uniqueID')
                    formData['visitorId'] = visitor;
                   
                    if (this.data.hasOwnProperty('formFilled')) {
                        //add two numbers
                        formData = {
                            ...formData,
                            ...this.data.formFilled
                        }
                    }

                  
                    if(this.data.hasOwnProperty('action')){
                        this.postToDashboard(formData);
                    }
                     
                 
            
            
                    
                    if (this.data.multipart === true) {
                        this.multipartLeadsCapture(formData).then(data => data.json()).then(data => {
                            console.log(data, "response data from")
                            button.removeAttr("disabled");
                            button.attr("value", "Submit")
                            if (data.hasOwnProperty("context") | data.hasOwnProperty("data")) {
                                LoadingModule.init('#message-input-module');
                                generalReplyModule.init(` Dear ${data.data.name}, your request is received and we will get back to you soon ${this.data.hasOwnProperty("lastContactText") ? this.data.lastContactText : ""}. Thank you.`);
                            }
                            if (data.hasOwnProperty("message")) {
                                generalReplyModule.init(data.message);
                                // renderPreviousButton.init();
                            }
                            btnContainer.remove();
                            this.hideContainer();
                            LoadingModule.clear();
                            this.Visiable("visible");
                        });
                    } else {
                        this.captureLeads(formData)
                            .then((data) => data.json())
                            .then((data) => {
                                button.removeAttr("disabled");
                                button.attr("value", "Submit")
                                if (data.status == 'fail' || data.status == 'error') {
                                    LoadingModule.init('#message-input-module');
                                    generalReplyModule.init(`Sorry ?? ${data.message}, due to invalid login Credentials.`);
                                    // renderPreviousButton.init();
                                }
                                LoadingModule.init('#message-input-module');
                                // service call to get the next message
                                policySerrvice(data)

                                btnContainer.remove();
                                this.hideContainer();
                                LoadingModule.clear();
                                this.Visiable("visible");
                                renderPreviousButton.init();
                            }).catch((err) => {
                                console.log("error", err);
                                btnContainer.remove();
                                LoadingModule.init('#message-input-module');
                                generalReplyModule.init(`Server error try again`);
                                this.hideContainer();
                                LoadingModule.clear();
                                this.Visiable("visible");
                                // renderPreviousButton.init();

                            });
                    }
                }

                // console.log("button.type::",buttons.type);
                if (buttons.type == "cancle") {
                    LoadingModule.init('#message-input-module');
                    generalReplyModule.init(`${this.data.exitMSG}`);
                    this.Visiable("visible");
                    this.hideContainer();
                    LoadingModule.clear();
                    renderPreviousButton.init();
                }
                event.preventDefault();
                this.dataAll = [];

            }.bind(this));
        })
    },
    exitcontainer: function (data) {
        $('#frame .content .message-input .wrap1').remove();
        this.hideContainer();
        LoadingModule.init('#message-input-module');
        generalReplyModule.init(data.exitMSG);
        socketModule.socket.emit("message:sent",{
            formMessageSection:true,
            bot:true,
            payload:data.exitMSG,
            text:data.exitMSG
        })
        if (data.hasOwnProperty("exit_button") && data.exit_button) {
            let quick = {
                // "title": "Choose to connect to our live agent",
                "type": "quick_reply",
                data: data.exit_button
            }
            setTimeout(() => {
                quickReplyModule.init(quick)
            }, 500)
        }
        LoadingModule.clear();
    },
    hideContainer: function () {
        this.dataAll = [];
        this.i = 0;
        this.data = {};
        if (this.$menuContainer) {
            this.$menuContainer.remove();
        }
    }

}
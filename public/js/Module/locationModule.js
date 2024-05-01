import { LoadingModule } from '../general/loading';
import { generalReplyModule } from './generalReplyModule';
import { env } from '../../env';
import { generalSliderModule } from '../general/generalSliderModule';
const fetch = require('node-fetch');


export var locationModule = {
    data: {},
    city_val: '',
    init: function (data) {
        this.data = data;
        this.cacheDOM();
        this.bindEvents();
        this.render();
    },
    cacheDOM: function () {
        this.$message = $('#message-module');
        this.$inputMsg = $('#message-input-module');
        this.$hideinput = $('#message-input-module .wrap');
        this.$close = $('#outerDiv #context');
    },
    scrollBottom: function () {
        $(".messages").animate({
            scrollTop: $('#message-module')[0].scrollHeight
        }, "fast");
    },
    bindEvents: function () {
        $(document).on('change', '#city_select', function () {
            console.log('bindinghere', this.data)
            this.searchLocation(this.data, $('#city_select').val());
        }.bind(this));
    },
    render: function (city_list) {
        console.log(this.data, "zzzzzz");
        if (this.$container) {
            this.$container.remove();
        }
        let renderTextNode = Array.isArray(this.data.title) ? (this.data.title.length > 0) : this.data.title;
        console.log(renderTextNode, "render");
        if (renderTextNode) {
            let parentElem = this.$message.find('.message-section').find('ul');
            let text = Array.isArray(this.data.title) ? this.data.title.join('<br>') : this.data.title;
            let node = $(`<li class="sent"><img id="sentImage" src="${env.Orgimg}" alt=""><p id="utterPara" style="position: relative;
            top: 6px;" >${text}</p></li>`);
            node.appendTo(parentElem);
        }

        if (Object.keys(this.data).length) {

            console.log(Object.keys(this.data), "objjj");
            this.$container = $(`<div id="location-card" class="zoomIn animated"></div>`);
            if (this.data.hasOwnProperty("header")) {
                let header = $(`<span class="header">${this.data.header}</span>`)
                header.appendTo(this.$container);
            }

            let crosser = $(`<img src="images/banner/close.png" style="position: absolute;width: 43px;right:0px;top: 3px;cursor:pointer">`);
            crosser.appendTo(this.$container);

            crosser.on('click', () => {
                this.clear();
                this.showContainer();
            })

            if (this.data.hasOwnProperty("img")) {
                let header = $(`<img src="${this.data.img}" alt="loading..">`)
                header.appendTo(this.$container);
            }
            if (this.data.hasOwnProperty('subtitle')) {
                let text = Array.isArray(this.data.subtitle) ? this.data.subtitle.join('<br>') : this.data.subtitle;
                if (text) {
                    let p = $(`<p>${text}</p>`)
                    p.appendTo(this.$container);
                }
            }

            if (this.data.hasOwnProperty('button')) {

                let btnContainer = $("<div></div>");
                btnContainer.attr('class', 'button-container');
                btnContainer.css({ "margin-top": "-3%", "margin-bottom": "2%" });


                this.data.button.contents.forEach((content) => {
                    let btn = $(`<button>${content.title}</button>`)
                    btn.appendTo(btnContainer);
                    if (content.type === 'send_location') {
                        let _click = true;     

                        btn.on('click', function (event) {
                            if (!_click) {          
                                return;
                            }
                            _click = false;



                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(async function (position) {
                                    try {
                                        LoadingModule.init('#message-input-module');
                                        locationModule.clear();
                                        locationModule.showContainer();
                                        let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}location/showroom`;           //*
                                        console.log(url, "gggg")
                                        let data = {

                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude

                                        };

                                        let response = await fetch(url, {
                                            method: 'POST',
                                            headers: {
                                                "Accept": "application/json",
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(data)


                                        })

                                        let responseData = await response.json();
                                        console.log(responseData);
                                        console.log(responseData.data, "datadata")


                                        _click = true;

                                        let type = responseData.type;
                                        console.log(type, "SSS");
                                        if (type === 'generalslider') {
                                            generalSliderModule.init(responseData);

                                        }
                                        else if (type === 'general-reply') {
                                            generalReplyModule.init(responseData);
                                        }
                                        else if (type === 'location') {
                                            locationModule.init(responseData);
                                        }
                                        else {
                                            generalReplyModule.init('Sorry there ! due to some technical problem Location is not fetched.');
                                        }
                                        this.clear();
                                        LoadingModule.clear();
                                    }

                                    catch (err) {
                                        _click = true;
                                        locationModule.clear();
                                        LoadingModule.clear();
                                    }
                                });
                            }

                            else {
                                alert("Sorry, your browser does not support HTML5 geolocation.");
                            }
                        }.bind(this));
                    }
                    if (content.type === 'type_location') {
                        let _click = true;
                        btn.on('click', function () {
                            if (!_click) {          
                                return;
                            }
                            _click = false;

                            let inputContainer = $(`<div class = "type_location_div"></div>`)
                            let inputField = $(`<input type="text" placeholder="Enter your city" />`);
                            let searchIcon = $('<i class="fa fa-search"></i>')
                            searchIcon.appendTo(inputContainer)
                            inputField.appendTo(inputContainer);

                            inputContainer.appendTo(btnContainer);
                            console.log("clicked")
                            let apiResponse = async()=>{
                                try {
                                    let inputValue = inputField.val();
                                    if (inputValue) {
                                        // console.log(inputValue, "ssdsd");
                                        LoadingModule.init('#message-input-module');
                                        locationModule.clear();
                                        locationModule.showContainer();
                                        let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}location/showroom-city?location=${inputValue}`;
                                        // console.log(url, "modified")

                                        let response = await fetch(url, {
                                            method: 'GET',
                                            headers: {
                                                "Accept": "application/json",
                                                "Content-Type": "application/json"
                                            },
                                        })

                                        let responseData = await response.json();
                                        // console.log(responseData, "respppp");
                                        _click = true;
                                        let type = responseData.type;

                                        if (type === 'generalslider') {
                                            generalSliderModule.init(responseData);
                                        }
                                        else if (type === 'general-reply') {
                                            generalReplyModule.init(responseData);
                                        }
                                        else if (type === 'location') {
                                            locationModule.init(responseData);
                                        }
                                        else {
                                            generalReplyModule.init('Sorry there ! Due to some technical problem showrooms could not be found.');
                                        }
                                        LoadingModule.clear();
                                    }
                                }
                                catch (err) {
                                    console.log(err)
                                    console.log(err.message);
                                    _click = true;
                                    locationModule.clear();
                                    LoadingModule.clear();
                                }
                            }
                            searchIcon.on('click', async () => {     
                                apiResponse();
                            })
                            inputField.on('keydown',(event)=>{
                                if(event.key==="Enter"){
                                    apiResponse();
                                }
                            })
                        })
                    }
                });

                btnContainer.appendTo(this.$container);
            }
            this.$container.appendTo(this.$inputMsg);
            this.hideContainer();

        }
        $('#removelocation').on('click', () => {
            $('#input-location').attr('value', '');
            $('#input-location').html("");

        })
        this.scrollBottom();
    },

    showContainer: function () {
        this.clear();
        $('#frame .content .messages').css({ "max-height": " calc(100% - 120px)", "min-height": "calc(100% - 120px)" });
        this.$hideinput.css("display", "flex");
        this.$close.css("display", "none");
        $('#outerDiv').removeClass('without-after-element');
        this.$container.remove();
    },
    hideContainer: function () {
        this.$hideinput.css("display", "none");
        $('#outerDiv').addClass('without-after-element');
        $('#frame .content .messages').css({ "max-height": "376px", "min-height": "376px" });
    },
    clear: function () {
        this.data = {};
        if (this.$container) {
            this.$container.remove();
        }

    }
}











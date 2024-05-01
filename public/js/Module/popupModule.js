import { env } from "../../env"
import { cookie } from "../general/cookie"
import { timerPopUp } from "../Services/poptimerService"
import { PostInterest } from "../sharedService/postService"

export var popUp = {
    data:'',
    username:'',
    popUpMessage(data) {
        this.data=data
       let user = localStorage.getItem('userName')
       this.username =user
        //   if(username)

        let mainContainer = $('.message-section')
        let container = $('<div id="popupContainer" class="d-flex justify-content-center"></div>')
        let form_container = $('<form class="m-auto popupBackground"></form>')
        let heading = $(`<p class="text-center font-weight-bold">${data.title}</p>`)
        heading.css({'padding':'0 20px'})
        let cross_icon = $('<div class="float-right" id="popUpCancel"><i class="fa fa-times" aria-hidden="true"></i></div>')
        cross_icon.css({ 'cursor': 'pointer','color':'red','position':'relative','left':'6px','bottom':'14px' })
        // let requestLead = $(`<p class="text-center pl-3 pr-3">${data.subtitle}</p>`)
        // requestLead.css({ 'font-size': '11px', 'margin-top': '-5px' })
        cross_icon.appendTo(form_container)
        heading.appendTo(form_container)
        // requestLead.appendTo(form_container)

        let user_div = $('<div class="form-group floating"></div>')
        user_div.appendTo(form_container)
        if (this.username) {
            let user_input = $(`<input type="text" class="form-control floating" id="usr" required value=${data.fullName} autocomplete="off"/>`)
            user_input.appendTo(user_div)
            let user_label = $(`<label for="usr" id="label">${data.name}</label>`)
            user_label.appendTo(user_div)
        } else {
            let user_input = $('<input type="text" class="form-control floating" id="usr" required value="" autocomplete="off"/>')
            user_input.appendTo(user_div)
            let user_label = $(`<label for="usr" id="label">${data.name}</label>`)
            user_label.appendTo(user_div)
        }
        let mobile_div = $('<div class="form-group floating"></div>')
        mobile_div.appendTo(form_container)

        if(!this.username){
            let mobile_input = $('<input type="number" class="form-control floating" id="usrmobile" required value="" autocomplete="off"/>')
            mobile_input.appendTo(mobile_div)
        }else{
            let mobile_input = $('<input type="text" class="form-control floating" id="usrmobile" required value="" autocomplete="off"/>')
            mobile_input.appendTo(mobile_div)
        }
        let mobile_label = $(`<label for="usrmobile">${data.mobile}</label>`)
        mobile_label.appendTo(mobile_div)

        let button_wrapper = $('<div class="d-flex"></div>')
        let submit_button = $('<button class="btn btn-secondary">Submit</button>')
        submit_button.appendTo(button_wrapper)
        button_wrapper.appendTo(form_container)

        form_container.appendTo(container)
        container.appendTo(mainContainer)

        submit_button.on('click', (e) => {
            // console.log("e:::",e);
            e.preventDefault()
            this.validation()
        })

        cross_icon.on('click', () => {
            $('#popupContainer').remove()
        })
    },
    validation: function () {
        let name = $('#usr').val()
        let mobile = $('#usrmobile').val()
        let formData = {}
        let mobile_error;
        let errors = false
        let user_parent = $('#usr').parent()
        let mobile_parent = $('#usrmobile').parent()
        formData.fullname = name
        formData.mobile_email = mobile

        if (name === '' || mobile === '') {

            errors = true
            if (name == '') {
                $('#usr').focus((e) => {
                    $('#usr').parent().children().remove('.popup_error');
                })
                $('#usr').parent().children().remove('.popup_error');
                let error = $('<p class="popup_error">FullName must be required !!!</p>')
                error.appendTo(user_parent)
            }
            if (mobile == '') {
                $('#usrmobile').focus((e) => {
                    $('#usrmobile').parent().children().remove('.popup_error');
                })
                $('#usrmobile').parent().children().remove('.popup_error');
                if(!this.username){
                mobile_error = $('<p class="popup_error">Mobile Number must be required !!!</p>')
                mobile_error.appendTo(mobile_parent)
                }else{
                    mobile_error = $('<p class="popup_error">Interest must be required !!!</p>')
                    mobile_error.appendTo(mobile_parent) 
                }
            }
        }
        if(!this.username){
            if (mobile) {
            let mobRegex = /^\d{10}$/;
            let isMobile = mobRegex.test(mobile);
            if (!isMobile) {
                errors = true
                $('#usrmobile').focus((e) => {
                    $('#usrmobile').parent().children().remove('.popup_error');
                })
                $('#usrmobile').parent().children().remove('.popup_error');
                mobile_error = $('<p class="popup_error">Mobile Number must be 10 digit long.</p>')
                mobile_error.appendTo(mobile_parent)
            }
        }
    }
        if (errors === false) {
            this.postToServer(formData)          
        }

    },
    postToServer: async function (formData) {
        let visitorId = cookie.getCookie('uniqueID')
        let source = env.botsource
        let url = env.action

        let lead={}
        if (this.username) {
            lead = {
                fullname: formData['fullname'],
                interest: formData['mobile_email'],
                mobile_email: this.data.interest,
                visitorId: visitorId,
                source: source
            }
        } else {
             lead = {
                fullname: formData['fullname'],
                mobile_email: formData['mobile_email'],
                visitorId: visitorId,
                source: source
            }
        }

        let res = await PostInterest(url, lead)
        try {
            if (res.status === 'success') {
                localStorage.setItem('userName', res.data.fullname)
                $('#popupContainer').remove()
                let interest =localStorage.getItem('interest')
                env.PopUpTime = env.PopUpTime + env.ExtendedTime
                if(!interest){
                    timerPopUp.Timer()
                }
            }
        } catch (err) {
            console.log(err)
        }

    }
}
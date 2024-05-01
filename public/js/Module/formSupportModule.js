import { env } from "../../env";
import { socketModule } from "../core/socket";
import { cookie } from "../general/cookie";
import { PostInterest } from "../sharedService/postService";
import { renderPreviousButton } from "../sharedService/renderPrevButton";
import { generalReplyModule } from "./generalReplyModule";
import { userValidationModule } from "./userFormValidation";
import { contentRender } from "../sharedService/content-render";
import { editCalendarEvent } from "../sharedService/calendarServices";


export var formSupportModule = {
  data: "",
  interest: "",
  init: function (data) {
    this.data = data;
    console.log(this.data, "data::::");
    this.cacheDOM();
    this.render();
  },
  cacheDOM: function () {
    this.parentContainer = $("#frame");
  },
  render: function () {
    this.container = $('<div id="form_support" class="w-100 p-2"></div>');
    this.Heading = $('<div class="form_heading p-1"></div>');
    this.Heading.css({ "margin-left": "9px", position: "relative", top: "-10px" });
    this.title = $(`<p class="text-center font-weight-bold mt-1">${this.data.title}</p>`);
    this.title.css({ "font-size": "14px", color: "#1C77BB" });
    // this.cross_btn = $('<i class="fa fa-times float-right btn_crs pr-3" aria-hidden="true"></i>')
    // this.cross_btn.appendTo(this.Heading)
    this.title.appendTo(this.Heading);
    this.Heading.appendTo(this.container);
    this.form_body = $("<form></form>");
    this.form_body.css({ margin: "-41px 9px", padding: "14px" });
    $(document).ready(function () {
      $('[data-toggle="popover"]').popover({ trigger: "hove click" });
    });
    this.data.data.forEach((e) => {
      if (
        !(
          e.type === "dropdown" ||
          e.type === "radio" ||
          e.type === "textarea" ||
          e.type === "custom_date_time" ||
          e.use === "multi-file"
        )
      ) {
        this.content_div = $('<div class="form-group m-auto"></div>');
        this.content_div.appendTo(this.form_body);
        this.form_label = $(`<label class="p-1" >${e.label}</label>`);
        if (e.hasOwnProperty("validation") && e.validation.required === true) {
          this.form_label.addClass("required");
        }
        this.form_label.attr("for", e.id);
        this.form_label.appendTo(this.content_div);
        if (e.description) {
          this.info_circle = $(
            `<i class="fa fa-info-circle float-right pr-4 btn_info" data-toggle="popover" data-container="#form_support" data-placement="left"></i>`
          );
          this.info_circle.attr("title", e.label);
          this.info_circle.attr("data-content", e.description);
          this.info_circle.appendTo(this.content_div);
        }
        this.form_input = $('<input class="form-control" autoComplete="off"/>');
        this.form_input.attr("id", e.id);
        this.form_input.attr("placeholder", e.placeholder);
        this.form_input.attr("type", e.type);
        this.form_input.appendTo(this.content_div);
      }

      if (e.type === "custom_date_time") {
        this.content_div = $('<div class="form-group m-auto"></div>');
        this.content_div.appendTo(this.form_body);
        this.form_label = $(`<label class="p-1">${e.label}</label>`);
        if (e.hasOwnProperty("validation") && e.validation.required === true) {
          this.form_label.addClass("required");
        }
        this.form_label.attr("for", e.id);
        this.form_label.appendTo(this.content_div);
        if (e.description) {
          this.info_circle = $(
            `<i class="fa fa-info-circle float-right pr-4 btn_info" data-toggle="popover" data-container="#form_support" data-placement="left"></i>`
          );
          this.info_circle.attr("title", e.label);
          this.info_circle.attr("data-content", e.description);
          this.info_circle.appendTo(this.content_div);
        }
        this.form_input = $('<input class="form-control" autoComplete="off"/>');
        this.form_input.attr("id", e.id);
        this.form_input.attr("placeholder", e.placeholder);
        this.form_input.attr("type", "text");
        this.form_input.appendTo(this.content_div);
        this.form_input.datetimepicker({
          maxDate: 0,
          format: "Y-m-d",
        });
        $(".xdsoft_datetimepicker").css({
          "z-index": 100000000,
        });
      }

      if (e.type === "textarea") {
        this.content_div = $('<div class="form-group m-auto"></div>');
        this.content_div.appendTo(this.form_body);
        this.form_label = $(`<label class="p-1">${e.label}</label>`);
        if (e.hasOwnProperty("validation") && e.validation.required === true) {
          this.form_label.addClass("required");
        }
        this.form_label.attr("for", e.id);
        this.form_label.appendTo(this.content_div);
        if (e.description) {
          this.info_circle = $(
            `<i class="fa fa-info-circle float-right pr-4 btn_info" data-toggle="popover" data-container="#form_support" data-placement="left"></i>`
          );
          this.info_circle.attr("title", e.label);
          this.info_circle.attr("data-content", e.description);
          this.info_circle.appendTo(this.content_div);
        }
        this.form_input = $(
          '<textarea class="form-control" autoComplete="off" style="height:80px;resize: none;"></textarea>'
        );
        this.form_input.attr("id", e.id);
        this.form_input.attr("placeholder", e.placeholder);
        this.form_input.attr("type", e.type);
        this.form_input.appendTo(this.content_div);
      }

      if (e.type === "radio") {
        this.content_div = $('<div class="form-group m-auto"></div>');
        this.content_div.appendTo(this.form_body);
        this.form_label = $(`<label class="p-1">${e.label}</label>`);
        if (e.hasOwnProperty("validation") && e.validation.required === true) {
          this.form_label.addClass("required");
        }
        this.form_label.attr("for", e.id);
        this.form_label.appendTo(this.content_div);
        if (e.description) {
          this.info_circle = $(
            `<i class="fa fa-info-circle float-right pr-4 btn_info" data-toggle="popover" data-container="#form_support" data-placement="left"></i>`
          );
          this.info_circle.attr("title", e.label);
          this.info_circle.attr("data-content", e.description);
          this.info_circle.appendTo(this.content_div);
        }
        this.$radio = $('<div class="d-flex"></div>');
        this.$radio.appendTo(this.content_div);

        e.Radiobtn.forEach((element) => {
          this.$radio_div = $('<div class="pl-2"></div>');

          this.form_input = $(`<input type="radio" name="drone" value=${element.title}>`);
          this.form_input.attr("id", element.id);
          this.form_input.attr("type", e.type);
          this.form_label = $(`<label class="p-1" for=${element.id}>${element.title}</label>`);
          this.form_label.appendTo(this.$radio_div);
          this.form_input.appendTo(this.$radio_div);
          this.$radio_div.appendTo(this.$radio);
        });
        this.$radio.appendTo(this.content_div);
      }
      if (e.use === "multi-file") {
        let i = 0;
        this.fileContainer = $(`<div class="file-container"></div>`);
        this.fileContainer.appendTo(this.form_body);

        this.formDiv = $(`<div></div>`).appendTo(this.fileContainer);
        this.form_label = $(`<label class="p-1">${e.label}</label>`);
        this.form_label.appendTo(this.formDiv);
        this.inputDiv = $(`<div></div>`).appendTo(this.formDiv);
        this.inputDiv.css({
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "10px",
        });
        this.testDiv = $(`<div></div>`).appendTo(this.inputDiv);
        this.testDiv.css({
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "center",
        });

        this.form_input = $(`<input class="form-control imagesClass" type="file"/>`);
        this.form_input.attr("id", e.id);
        this.form_input.appendTo(this.testDiv);

        this.buttonDiv = $(`<p></p>`).appendTo(this.fileContainer);
        this.addFile = $(`<button class="btn btn-light" type="button" id="addFileField">Add Document</button>`);
        this.addFile.css({
          padding: "2px 10px",
          fontSize: "12px",
          borderRadius: "20px",
          background: "#1C77BB",
          color: "#fff",
        });
        this.addFile.appendTo(this.buttonDiv);
        this.addFile.click(() => {
          let add = this.inputDiv.clone();
          add.attr("id", `formDiv${i++}`);

          this.form_button = $(`<img src="images/delete.png" style="width:20px; height:20px:cursor:pointer;"/>`);
          this.inputDiv.attr("id", `formDiv${i++}`);
          this.form_button.on("click", (event) => {
            let parent = event.currentTarget.parentNode;
            parent.remove();
          });
          this.form_button.appendTo(add);

          add.appendTo(this.formDiv);
        });
      }

      if (e.type === "dropdown") {
        this.content_div = $('<div class="form-group m-auto"></div>');
        this.content_div.appendTo(this.form_body);
        this.form_label = $(`<label class="p-1">${e.label}</label>`);
        if (e.hasOwnProperty("validation") && e.validation.required === true) {
          this.form_label.addClass("required");
        }
        this.form_label.attr("for", e.id);
        this.form_label.appendTo(this.content_div);
        if (e.description) {
          this.info_circle = $(
            `<i  class="fa fa-info-circle float-right pr-4 btn_info" data-toggle="popover" data-container="#form_support" data-placement="left"></i>`
          );
          this.info_circle.attr("title", e.label);
          this.info_circle.attr("data-content", e.description);
          this.info_circle.appendTo(this.content_div);
        }
        this.form_select = $('<select class="form-control"></select>');
        this.form_select.attr("id", e.id);
        e.data.forEach((element) => {
          this.form_option = $(`<option value=${element.id}>${element.name}</option>`);
          this.form_option.appendTo(this.form_select);
        });
        this.form_select.appendTo(this.content_div);
        let interested = sessionStorage.getItem("interest");
        this.interest = interested;
        if (interested) {
          this.content_div.remove();
          sessionStorage.removeItem("interest");
        }
      }
    });
    this.buttonContainer = $('<div class="d-flex mt-3"></div>');
    if (this.data.buttons) {
      this.data.buttons.data.forEach((ele) => {
        this.button = $(`<button class="btn form_btn">${ele.text}</button>`);
        this.button.appendTo(this.buttonContainer);
        if (ele.type === "submit") {
          this.button.css({
            "background-color": "#1C77BB",
          });
        }
        this.button.click((e) => {
          e.preventDefault();
          if (ele.type === "cancel") {
            this.clear();
            renderPreviousButton.init();
          }
          if (ele.type === "submit") {
            this.leadCaptures();
            renderPreviousButton.init();
            this.clear();
          }
        });
      });
    }
    this.buttonContainer.appendTo(this.form_body);
    this.form_body.appendTo(this.container);
    this.container.appendTo(this.parentContainer);
  },
  getValue(id) {
    const elem = $("#" + id);
    return elem.hasClass("datetimepicker") ? new Date(elem.val()).toISOString() : elem.val() || elem.attr("data-value");
  },
  leadCaptures: function () {
    this.validation();
    let error = userValidationModule.checkError();
    let formData = {};

    if (!error) {
      const formDataField = new FormData();
      let source = env.botsource;
      let visitor = cookie.getCookie("uniqueID");
      if (this.data.hasOwnProperty("multipart")) {
        this.data.data.map((element) => {
          if (element.type == "file") {
            let input_file = $(`#${element.id}`).prop("files")[0];
            input_file && formDataField.append(`${element.id}`, input_file);
          }
          // else if (element.use == 'multi-file') {
          //     const imageCLass = $(`.imagesClass`)
          //     console.log(imageCLass)
          //     imageCLass.map((index) => {
          //         let multiple_file = imageCLass.prop('files')[0]
          //         multiple_file && formDataField.append(`images${index}`, multiple_file)
          //     })
          // }
          else if (element.use == "multi-file") {
            const imageCLass = $(`.imagesClass`);
            imageCLass.map((index) => {
              let multiple_file = imageCLass.prop("files")[0];
              multiple_file && formDataField.append(`images`, multiple_file);
            });
          } else {
            // console.log($("#" + element.id), $(`#${element.id}`).attr("data-value"))
            formDataField.append(`${element.id}`, this.getValue(element.id));
          }
        });
        let positionApplied = sessionStorage.getItem("positionApplied");
        formDataField.append(`visitorId`, visitor);
        formDataField.append(`source`, source);
        formDataField.append(`interest`, positionApplied);
        formDataField.append("type", "job");
        this.postMulltipartFormData(formDataField);
      } else {
        this.data.data.map((element) => {
          formData[element.id] = this.getValue(element.id);
        });
        this.postService(formData);
      }
    }
  },
  validation: function () {
    userValidationModule.init(this.data);
  },

  //for multipart form support
  postMulltipartFormData: async function (data) {
    try {
      let url = `${this.data.action}`;
      let response = await fetch(url, {
        method: "POST",
        body: data,
      });

      response = await response.json();
      response["message"] = this.data.successResponse;
      if (response.status === true) {
        let bodyData = response.data;
        console.log(bodyData, "bd>>>");
        let googlesheetsUrl = "rest/v1/google/googlesheet";
        await fetch(googlesheetsUrl, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(bodyData),
        });
      }

      if (response && response.message) {
        generalReplyModule.init({
          message: response.message,
        });
      } else {
        throw new Error("Something has been bad happened");
      }
    } catch (error) {
      generalReplyModule.init({
        message: "Something has been bad happened",
      });
    } finally {
      this.clear();
    }
  },
  postService: async function (data) {
    let url = this.data.action;
    let source = env.botsource;
    let visitor = cookie.getCookie("uniqueID");
    let val;
    console.log(data, "datasssss");
    if (this.data.formType) {
      if(this.data.formType === "Schedule Chatbot Demo"){
        val = {
          ...data,
          calendar: this.data.calendar
        }
        await editCalendarEvent(val, this.data.calednarUrl);
      }
      if (this.data.formType === "feedback") {
        val = {
          visitorId: visitor,
          mobile_number: data.mobileNumber,
          full_name: data.fullName,
          suggestion: data.suggestion,
          email_address: data.emailAddress,
          type: this.data.formType,
        };
      }
      if (this.data.formType === "book_appointment") {
        val = {
          visitorId: visitor,
          mobile_number: data.mobileNumber,
          full_name: data.fullName,
          email_address: data.emailAddress,
          interest: this.data.interest,
          // policyAgentNumber:data.accountNumber,
          title: data.category,
          type: this.data.formType,
          apponiment_date: data.date,
        };
        // console.log("appointment values:", val);
      }
      if (this.data.formType === "complain") {
        val = {
          visitorId: visitor,
          mobile_number: data.mobileNumber,
          full_name: data.fullName,
          email_address: data.emailAddress,
          problem: data.problem,
          policyAgentNumber: data.accountNumber,
          title: data.category,
          type: this.data.formType,
        };
      } else {
        val = { ...data, type: this.data.formType, visitorId: visitor };
      }
    } else {
      let interest = this.interest;
      data.source = source;
      data.interest = interest;
      data.visitorId = visitor;
      val = data;
    }

    console.log(val, url, ">>>>>>>>>>");

    let resp = await PostInterest("rest/v1/google/googlesheet", val);
    if (resp.status === "success") {
      console.log("Successfully posted on goglesheets");
    }
    let res = await PostInterest(url, val);
    if (res.status === "success") {
      this.clear();
      if (this.data.hasOwnProperty("successResponse")) {
        let counter = 0;
        let intervalId = setInterval(() => {
          if (counter === this.data.successResponse.length - 1) {
            clearInterval(intervalId);
          }
          res = this.data.successResponse[counter];
          contentRender(res);
          counter++;
        }, 1000);
        return;
      }
      generalReplyModule.init(res.for);

      renderPreviousButton.init();

      localStorage.setItem("appointmentUserName", data.fullName);
    } else {
      this.clear();
      generalReplyModule.init("Something Went Wrong Please,Try again !!!");
      renderPreviousButton.init();
    }
  },
  clear: function () {
    if (this.container) {
      this.container.remove();
    }
  },
};

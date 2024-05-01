import { env } from "../../env";
import { socketModule } from "../core/socket";

export var fileUpload = {
  init: function () {
    this.$button = document.querySelector("#new-message-file-upload-button");
    this.$addIcon = this.$button.querySelector(".add-file-icon");
    this.$removeIcon = this.$button.querySelector(".remove-file-icon");
    this.$input = document.querySelector("#new-message-file-upload-input");
    this.$textarea = document.querySelector("#search1");
    this.$span = document.querySelector("#new-message-file-input-filename");
    this.$imgPreview = document.querySelector("#imgPreview");
    this.$input.addEventListener("change", this.onFileChange.bind(this));
    this.$boundPasteImage = this.pasteImage.bind(this);
    this.$textarea.addEventListener("paste", this.$boundPasteImage);
    this.$button.addEventListener("click", this.clickButton.bind(this));
    this.toggleDisable(socketModule.livechat);
  },

  toggleDisable: function (show = true) {
    if (!show) {
      this.clear();
      this.$button.style.cursor = "not-allowed";
      this.$button.setAttribute("disabled", true);
      this.$textarea.removeEventListener("paste", this.$boundPasteImage);
    } else {
      this.$button.style.cursor = "pointer";
      this.$button.removeAttribute("disabled");
      this.$textarea.addEventListener("paste", this.$boundPasteImage);
    }
  },

  clickButton: function () {
    if (this.file) {
      return this.clear();
    }
    this.$input.click();
  },

  // onFileChange: async function () {
  //   const files = this.$input.files;

  //   if (files.length === 0) {
  //     return;
  //   }

  //   if (files.length > 4) {
  //     this.toastMessage("Only 4 files should be selected at once");
  //     this.clear();
  //     return null;
  //   }

  //   const file = files[0];

  //   if (file.size > 4000000) {
  //     this.toastMessage("File is larger than 4MB");
  //     this.clear();
  //     return null;
  //   }

  //   this.file = file;
  //   this.$span.innerText = `Attachment (${files.length} files)` || file.name;
  //   this.$addIcon.style.display = "none";
  //   this.$removeIcon.style.display = "block";
  // },

  onFileChange: async function () {
    this.isPastedImage=false;
    const files = this.$input.files;
    
    if (files.length > 4) {
      this.toastMessage("Only 4 files should be selected at once");
      this.clear();
      return null;
    }
    for (const file of files) {
      if (file.size > 4000000) {
        this.toastMessage("File is larger than 4MB");
        this.clear();
        return null;
      }
  
      this.file = file;
      this.$span.innerText = `Attachment (${files.length} files)` || file.name;
      this.$addIcon.style.display = "none";
      this.$removeIcon.style.display = "block";
  
    }
  },
  pasteImage: async function (event) {
    console.log("pipi");
    this.isPastedImage = true;
    const [clipboardItem] = (event.clipboardData || window.clipboardData).items;
    if (clipboardItem.kind !== "file") {
      return;
    }
    const file = await clipboardItem.getAsFile();
    // const valid = handleFileInputChange({ target: { files: [file], value: file.name } });
    // setPastedFile(valid ? file : null);
    if (file.size > 4000000) {
      this.toastMessage("File is larger than 4MB");
      this.clear();
      return null;
    }
    this.file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.$imgPreview.src = e.target.result;
    };
    this.$imgPreview.style.display = "block";
    reader.readAsDataURL(file);

    this.$imgPreview.alt = file.name;
    // this.$span.innerText = "Attachment" || file.name;
    this.$addIcon.style.display = "none";
    this.$removeIcon.style.display = "block";
  },

  getBufferArray: async function (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  },

  getFileUrl: async function (file) {
    try {
      const bufferData = await this.getBufferArray(file);
      const fetchUrl = `${env.protocol}://${env.server}:${
        env.port
      }/rest/v1/chat/file?visitor=${socketModule.getUniqueId()}&filename=${file.name}&from_chatbot=${true}`;
      const response = await fetch(fetchUrl, {
        method: "POST",
        body: bufferData,
        headers: {
          "Content-Type": file.type,
          "Content-Length": file.size,
        },
      });
      const data = await response.json();
      return data.path;
    } catch (error) {
      console.log("ERROR IN UPLOAD FILE => ", error);
      this.toastMessage(error.message);
      return "";
    } finally {
      this.clear();
    }
  },

  getAttachment: async function () {
    if (!this.file) {
      return null;
    }
    if (this.isPastedImage) {
      console.log("first condition get attach")
      const fileType = this.file.type.split("/")[0];
      const filePayload = await this.getFileUrl(this.file);
      const attachmentType = ["image", "audio", "video"].includes(fileType) ? fileType : "file";
      return [
        {
          type: attachmentType,
          payload: filePayload,
        },
      ];
    } else {
      console.log("second condition get attach")
      const files = this.$input.files || this.file;
      const attachmentPromises = Array.from(files).map(async (file) => {
        const fileType = file.type.split("/")[0];
        const filePayload = await this.getFileUrl(file);
        const attachmentType = ["image", "audio", "video"].includes(fileType) ? fileType : "file";

        return {
          type: attachmentType,
          payload: filePayload,
        };
      });

      return Promise.all(attachmentPromises);
    }
  },

  clear: function () {
    this.$input.value = "";
    this.$span.innerText = "";
    this.file = null;
    this.$imgPreview.style.display = "none";
    this.$addIcon.style.display = "block";
    this.$removeIcon.style.display = "none";
  },

  toastMessage: function (message) {
    let toggleParent = $("#message-module");
    let toastDiv = $(
      '<div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center" id="Toast_messageCOntainer"></div>'
    ).appendTo(toggleParent);
    toastDiv.css({
      "min-height": "100px",
      position: "absolute",
      bottom: "24px",
      "z-index": "99",
      left: "50%",
      transform: "translate(-50%,0)",
    });

    let toastClass = $('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"></div>').appendTo(
      toastDiv
    );
    toastClass.css({ opacity: "1" });
    $(`<div class="toast-body">${message}</div>`).appendTo(toastClass);
    setTimeout(() => {
      $("#Toast_messageCOntainer").remove();
    }, 2000);
  },
};

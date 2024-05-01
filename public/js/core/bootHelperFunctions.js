import { cookie } from "../general/cookie";
import { env } from "../../env";
import { LoadingModule } from "../general/loading";
import { socketModule } from "./socket";
import moment from "moment";
import { decryptData, encryptData } from "../Services/cryptoService";
/**
 * Extract response title from title response.
 * @param {*} data
 */

/**
 * Render chat bot history data to the bot.
 * @param {*} data
 */
function renderMessage(data, value) {
  let $titleContainer = $("#message-module");
  $titleContainer.find("ul").empty();
  let $ul = $titleContainer.find("ul")[0];
  let counter = 0;
  let reverseMessage = data.messages.reverse();
  const sendMessageInterval = setInterval(
    () => {
      let element = reverseMessage[counter]
      let msgClass = element && element.usertype ? (["bot", "agent"].includes(element.usertype) ? "sent" : "replies") : "";
      let imgSrc =
        ["bot", "agent"].includes(element.usertype) ? env.Orgimg : env.clientimg;
      let $elem = $(`<li class=${msgClass}>
      <img id="utterImage" src="${imgSrc}" alt="" />
  </li>`);

      if (element.text) {
        if (element.usertype === "bot") {
          // console.log(element.text, "bot message")
          let $textElement = $(`<p id="utterPara"><span style="color: #0171bb;font-weight: 800;">${env.botName}</span>${element.text}<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span></p>`);
          $elem.append($textElement);
        } else if (element.usertype === "agent") {
          let $textElement = $(`<p id="utterPara"><span style="color: #0171bb;font-weight: 800;">${element.metadata.name}</span>${element.text}<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span></p>`);
          $elem.append($textElement);
        }
        else {
          let $textElement = $(`<p id="utterPara">${element.text}</p>`);
          $elem.append($textElement);
        }
      }

      if (element.attachment) {
        let livechatUser = element.metadata.email === "" || undefined || null ? element.metadata.name : '';
        if (element.attachment.type === "image") {
          let attachmentSrc = element.attachment.payload;
          let $attachment = $(`<p id="utterPara">${livechatUser ? `<span style="color: #0171bb;font-weight: 800;">${livechatUser}</span>` : ''}<img class="attachment" style="width:100%;background:#fff;margin:unset;border-radius:22px;" src="${attachmentSrc}" alt="attachment" />${livechatUser ? `<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span>` : ''}</p>`);
          $elem.append($attachment);
        } else if (element.attachment.type === "pdf") {
          let attachmentSrc = element.attachment.payload;
          let $attachment = $(`<p id="utterPara">${livechatUser ? `<span style="color: #0171bb;font-weight: 800;">${livechatUser}</span>` : ''}<a class="attachment" style="width:100%;background:#fff;margin:unset;border-radius:22px;" href="${attachmentSrc}" target="_blank">View PDF</a>${livechatUser ? `<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span>` : ''}</p>`);
          $elem.append($attachment);
        }
        else if (element.attachment.type === "file") {
          let $attachmentSrc = element.attachment.payload;
          const fileName = $attachmentSrc.split("/").at(-1).split("-").at(-1);
          let $attachment = $(`<p id="utterPara">${livechatUser ? `<span style="color: #0171bb;font-weight: 800;">${livechatUser}</span>` : ''}<a class="attachment" target="_blank" href="${$attachmentSrc}">${fileName}</a>${livechatUser ? `<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span>` : ''}</p>`);
          $elem.append($attachment);
        }
        else if (element.attachment.type === "audio") {
          let $attachmentSrc = element.attachment.payload;
          let $attachment = $(`<p id="utterPara" style="width:100%;">${livechatUser ? `<span style="color: #0171bb;font-weight: 800;">${livechatUser}</span>` : ''}<audio controls src=${$attachmentSrc} style="width: 100%; padding-right:14px;margin:unset;border-radius:22px;" />${livechatUser ? `<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span>` : ''}</p>`);
          $elem.append($attachment);
        }
        else if (element.attachment.type === "video") {
          let $attachmentSrc = element.attachment.payload;
          let $attachment = $(`<p id="utterPara">${livechatUser ? `<span style="color: #0171bb;font-weight: 800;">${livechatUser}</span>` : ''}<video controls src=${$attachmentSrc} style="width: 100%; padding-right:14px;margin:unset;border-radius:22px;" />${livechatUser ? `<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span>` : ''}</p>`);
          $elem.append($attachment);
        }
        else if (element.attachment.type === "webProductDetails") {
          let $attachment = $(`<p id="repliesPara">
          <span><b>${element.attachment.title}</b></span><br/>
          <span>${element.attachment.brand}</span><br/>
          <span>${element.attachment.model}</span><br/>
          <span>${element.attachment.price}</span><br/><br />
          <img src="${element.attachment.image}" alt="image" style="width: 100%;margin:unset;border-radius:22px;" />
          </p>
        `);
          $elem.append($attachment);
        }
        else if (element.attachment.type === "other") {
          let $attachment = $(`<p id="utterPara">${livechatUser ? `<span style="color: #0171bb;font-weight: 800;">${livechatUser}</span>` : ''}<p class="attachment">Attachments</p>${livechatUser ? `<span id="messageTimeStamp">${moment(element.createdDate).format('h:mm a')}</span>` : ''}</p>`);
          $elem.append($attachment);
        }
      }
      $elem.appendTo($ul);

      counter++;
      if (counter === data.messages.length) {
        clearInterval(sendMessageInterval);
        scrollBottom();
        value.name ? socketModule.socket.emit("message:sent", { text: "Greet", payload: "greet" }, { source: env.botsource || 'web' }) :
          socketModule.socket.emit("message:sent", { text: "Greet", payload: "greet" }, { source: env.botsource || 'web' })
      }
    }, 0);
}

function scrollBottom() {
  $(".messages").animate(
    {
      scrollTop: $("#message-module")[0].scrollHeight
    },
    "fast"
  );
}

let httpService = async (url = '', headers = {}, method = 'GET', body = {}, Default = null) => {
  if (!method) {
    throw new Error('Method is not defined');
  }
  if (!url) {
    throw new Error('Url is not defined');
  }
  if (!headers) {
    throw new Error('Headers is not defined');
  }
  let fetchParams = {}
  if (!Default) {
    fetchParams = {
      method: method,
      headers: headers,
    }
  }
  if (Default) {
    fetchParams = {
      method: method,
      headers: headers,
    }
  }

  if (method === 'POST' || method === 'PATCH') {
    fetchParams['body'] = JSON.stringify(body)
  }
  return await fetch(url, {
    ...fetchParams
  })
}

async function fetchUserHistory(visitor = null) {
  try {
    let visitor_id = visitor || cookie.getCookie("uniqueID") || sessionStorage.getItem("uniqueID");
    visitor_id = encryptData(visitor_id);
    let url = `${env.protocol}://${env.server}:${env.port}${env.basePath}chat/visitor/conversation?user_id=${visitor_id}`;
    let fetchChatHistory = await httpService(url, {}, 'GET', {})
    fetchChatHistory = await fetchChatHistory.text()
    fetchChatHistory = decryptData(fetchChatHistory);
    return { data: fetchChatHistory, success: true };
  } catch (error) {
    console.log(error, "error occured")
    return {
      error: error,
      success: false
    }
  }
}

const renderPreviousConvo = async (visitor, value = null) => {
  try {
    LoadingModule.init("#message-input-module");
    let conversationHistory = await fetchUserHistory(visitor);
    if (conversationHistory && conversationHistory.success == true) {
      if (conversationHistory.data.data[0].messages.length > 0) {
        await renderMessage(conversationHistory.data.data[0], value)
      } else {
        throw new Error("error")
      }

    } else {
      throw new Error("error")
    }
  } catch (error) {
    socketModule.socket.emit("message:sent", { text: "Greet", payload: "greet" }, { source: env.botsource || 'web' })
    console.log(error, "error from boothelper")
  } finally {
    LoadingModule.clear();
  }
}

export { fetchUserHistory, renderPreviousConvo };

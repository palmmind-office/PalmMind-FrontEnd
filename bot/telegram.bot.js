const { EventEmitter } = require("node:events");
const ioClient = require("socket.io-client");

const bodyParser = require("body-parser");
const fetch = require("node-fetch");

class TelegramBot extends EventEmitter {
  constructor(config, type = "telegram") {
    super();
    if (!config.botToken || !config.secretToken) {
      console.log("missing app credentials", type);
      config = { botToken: "_____", secretToken: "_____" };
    }
    this.webhook = "/webhooks/" + type;
    this.type = type;
    this._botClientUrl =
      process.env.BOT_SOCKET_URL ||
      `${process.env.SOCKET_PROTOCOL}://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`;
    this._sockets = {};

    this.botToken = config.botToken;
    this.secretToken = config.secretToken;
  }

  start(app) {
    init(app, this);
    this.setWebhook();
  }

  connectSocket(userId, name, username) {
    return new Promise((resolve, _) => {
      if (this._sockets[userId] && this._sockets[userId].io?.readyState === "open") {
        return resolve(true);
      }

      this._sockets[userId] && this._sockets[userId].disconnect();
      const newSocket = ioClient(this._botClientUrl, {
        query: {
          token: process.env.SOCKET_TOKEN,
        },
        forceNew: true,
      });

      function onUserJoin(value) {
        if (!value) {
          return resolve(value);
        }
        newSocket.on("message:received", async (message, metadata) => {
          const responseMessage = Array.isArray(message) ? message : [message];
          for (let i = 0; i < responseMessage.length; i++) {
            try {
              await this.handleResponseMessage(metadata, responseMessage[i]);
            } catch (error) {
              console.log(error,"couldn't send this message => ", responseMessage[i]);
            }
          }
        });
        this._sockets[userId] = newSocket;
        return resolve(value);
      }

      newSocket.on("connect", () => {
        newSocket?.emit("user:join", userId, "all", "User", this.type, { name, username }, onUserJoin.bind(this));
      });
    });
  }

  async handleResponseMessage(metadata, message) {
    const userId = metadata.receipent;
    // message = {
    //   custom: {
    //     title: "Hello World",
    //     type: "textImageButton",
    //     image: "https://cdn.pixabay.com/photo/2023/08/05/14/24/twilight-8171206_1280.jpg",
    //     caption: "Twilight Photo",
    //     button: [
    //       {
    //         title: "Button 1",
    //         payload: "Button 1 Payload"
    //       },
    //       {
    //         title: "Button 2",
    //         payload: "Button 2 Payload"
    //       },
    //       {
    //         title: "Button 3",
    //         payload: "Button 3 Payload"
    //       },
    //       {
    //         title: "Button 4",
    //         payload: "Button 4 Payload"
    //       },
    //       {
    //         title: "Button 5",
    //         payload: "Button 5 Payload"
    //       },
    //     ],
    //   },
    // };

    if (message.text && message.buttons) {
      await this.sendReplyButtons(userId, message.text, message.buttons);
    }
   
    if (message.attachment?.payload) {
      message.custom = {
        type: "media",
        fileType: message.attachment?.type,
        media: message.attachment?.payload,
        size: metadata.size,
      };
      if (message.text) {
        message.custom.caption = message.text;
      }
    }

    if (message.text && !message.attachment?.payload && !message.buttons) {
      await this.sendText(userId, message.text);
    }

    if (!message.custom) {
      return null;
    }

    let custom = message.custom;
    if (custom.text && !custom.path || custom.message ) {
      return await this.sendText(userId, custom.text || custom.message);
    }

    const customType = custom.type || custom.Type;
    switch (customType) {
      case "image":
        const { imageUrl, caption } = custom;
        await this.sendMedia(userId, "picture", { media: imageUrl, text: caption });
        break;
      case "audio":
        var type = custom.type;
        var data = {type, payload: custom.path}
        await this.sendMedia(userId, custom.text, data )
        break;
      case "media":
        let { fileType, media, caption: text } = custom;
        var type = fileType === "image" ? "photo" : fileType === "file" ? "document" : fileType;
        var data = { type, payload: media };

        // if (type === 'file') {s
        //     data.file_name = media.split("/").at(-1).split("-").at(-1);
        // }
        await this.sendMedia(userId, text, data);
        break;
      case "text":
        await this.sendText(userId, custom.text || custom.message);
        break;
      case "quick_reply":
        const { title: replyText, data: buttons } = custom;
        await this.sendReplyButtons(userId, replyText, buttons);
        break;
      case "recommend-slider":
        await this.sendSliderButtons(userId, custom);
        break;
      case "textImageButton":
        await this.sendTextImageButton(userId, custom);
      case "location":
        await this.sendLocation(userId, custom);
        break;
      case "keyboard":
        await this.sendKeyboard(userId, custom);
        break;
      default:
        await this.sendRichMedia(userId, custom);
    }
  }

  async #sendRequest(body, endpoint, method) {
    endpoint = endpoint || "sendMessage";
    method = method || "POST";
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/${endpoint}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      this.response = await res.json();
      if (!this.response.ok) {
        console.log(
          "Telegram Error received. For more information, see: https://core.telegram.org/bots/api#available-methods"
        );
        console.log(response.description, url, body);
      }
      return this.response.result;
    } catch (err) {
      return console.log(`Error sending message: ${err}`);
    }
  }

  async setWebhook() {
    return this.#sendRequest(
      {
        url: `${this._botClientUrl}${this.webhook}`,
        secret_token: this.secretToken,
      },
      "setWebhook"
    );
  }

  async downloadMedia(mediaId) {
    try {
      const data = await this.#sendRequest({ file_id: mediaId }, "getFile");
      console.log("DAATA", data);
      if (!data?.file_path) {
        return null;
      }
      const fileUrl = `https://api.telegram.org/file/bot${this.botToken}/${data.file_path}`;
      console.log("FILE URL", fileUrl);
      return fetch(fileUrl);
    } catch (error) {
      console.log("ERROR IN GET MEDIA URL (TELEGRAM) => ", error);
      return "";
    }
  }

  async sendGenericMessage(userId, type, data, options) {
    return this.#sendRequest(
      {
        chat_id: userId,
        [type]: data,
        ...options,
      },
      { photo: "sendPhoto", audio: "sendAudio", document: "sendDocument", video: "sendVideo" }[type] || "sendMessage"
    );
  }

  async sendText(userId, text) {
    return this.sendGenericMessage(userId, "text", text);
  }

  async sendMedia(userId, text, { type, payload }) {
    return this.sendGenericMessage(userId, type, payload, { caption: text });
  }

  buttonsGrid(buttons, buttonsPerRow = 3) {
    return Array(Math.ceil(buttons.length / buttonsPerRow)).fill(0).map((_, index) => buttons.slice(buttonsPerRow * index, buttonsPerRow * (index + 1)));
  }

  async sendReplyButtons(userId, text, buttons) {
    const reply_markup =
      buttons?.length &&
      JSON.stringify({
        inline_keyboard: this.buttonsGrid(buttons.map((button) => (
          {
            text: button.title,
            callback_data: button.payload,
          }
        )))
      });
    return this.sendGenericMessage(userId, "text", text, { reply_markup });
  }

  //Case I: Single message at a time with sendPhoto - endpoint
  async sendSliderButtons(userId, buttons) {
    for (const item of buttons.data.slice(0, 3)) {
      const body = {
        chat_id: userId,
        text: item.title,
        photo: item.image.replace(/ /g, "%20"),
        caption: item.title + "\n" + item.iframe.split("?")[0],
      };
      await this.#sendRequest(body, "sendPhoto");
    }
    let finalMessage =
      "To view more products from same category, Please click on the link below:" +
      "\n" +
      buttons.detailsIframe.link.split("?")[0];
    await this.sendText(userId, finalMessage);
  }

  //Case II: Album Grid message with sendMediaGroup - endpoint
  // async sendSliderButtons(userId, buttons) {
  //     const mediaArray = buttons.data.slice(0, 3).map(item => ({
  //         type: "photo",
  //         media: item.image.replace(/\s+/g, "%20"),
  //         caption: item.title + '\n' + item.iframe.split('?')[0]
  //     }));
  //     const body = {
  //         chat_id: userId,
  //         media: JSON.stringify(mediaArray)
  //     };
  //     await this.#sendRequest(body, "sendMediaGroup");
  //     const finalMessage = 'To view more products from the same category, please click on the link below:\n' + buttons.detailsIframe.link.split('?')[0];
  //     await this.sendText(userId, finalMessage);
  // }

  async sendTextImageButton(userId, buttons) {
    const inlineKeyboard = {
      inline_keyboard: this.buttonsGrid(buttons.button.map((button) =>
      ({
        text: button.title,
        callback_data: button.payload,
      })
      )),
    };
    const body = {
      chat_id: userId,
      text: buttons.title,
      photo: buttons.image.replace(/ /g, "%20"),
      caption: buttons.caption || buttons.title,
      reply_markup: JSON.stringify(inlineKeyboard),
    };

    await this.#sendRequest(body, "sendPhoto");
  }
  async sendLocation(userId, LocationData) {
    await this.sendText(userId, LocationData.title);
    if (LocationData.data && LocationData.data.length > 0) {
      for (const location of LocationData.data) {
        const coordinates = location.coordinates.split(",");
        const latitude = parseFloat(coordinates[0]);
        const longitude = parseFloat(coordinates[1]);

        const body = {
          chat_id: userId,
          latitude: latitude,
          longitude: longitude,
        };

        await this.#sendRequest(body, "sendLocation");

        await this.sendText(
          userId,
          `Store: ${location.title}\nContact Person: ${location["Contact Person"]}\nContact Number: ${location.Phone}`
        );
      }
    }
  }
}

function init(app, bot) {
  const humanMessages = ["human", "agent", "support"];

  app.use(
    bot.webhook,
    bodyParser.json({
      verify: function (req) {
        var secretToken = req.headers["x-telegram-bot-api-secret-token"];
        if (!secretToken || secretToken !== this.secretToken) {
          throw new Error("Couldn't validate secret token.");
        }
      },
    })
  );

  app.post(bot.webhook, async (req, res) => {
    res.status(200).end();
    const { message, callback_query } = req.body || {};

    if (!message && !callback_query) {
      return;
    }
    const sender = message?.from || callback_query?.from;
    const paylod = {
      from: sender?.id?.toString(),
      name: `${sender?.first_name || ""} ${sender?.last_name || ""}`,
      username: sender?.username,
      id: message?.message_id || callback_query?.id,
      timestamp: message?.date || Date.now(),
    };
    if (callback_query?.data) {
      return bot.emit("text", { ...paylod, text: callback_query.data });
    }

    const attachmentType = ["photo", "audio", "sticker", "video", "voice", "document"].find((key) => key in message);

    if (attachmentType) {
      console.log("MESSAGE ATTACHMENT", message);
      const type =
        { photo: "image", sticker: "image", voice: "audio", document: "file" }[attachmentType] || attachmentType;
      const attachment = Array.isArray(message[attachmentType])
        ? message[attachmentType].at(-1)
        : message[attachmentType];
      const fileName = attachment.file_name || attachment.file_unique_id + (attachment?.mime_type === "audio/ogg" ? ".ogg" : ".png");
      return bot.emit("attachment", {
        ...paylod,
        type,
        [type]: `${attachment.file_id}.${fileName.split(".").at(-1)}#file_name-${fileName}`,
        caption: message.caption,
      });
    } else if (message?.text) {
      return bot.emit("text", { ...paylod, text: message.text });
    }
  });

  bot.on("text", async (payload) => {
    const { from: userId, id: mid, timestamp: time, name = null, username = null, callback } = payload;
    await bot.connectSocket(userId, name, username);

    const title = payload.text || "";
    const message = {
      title: title,
      payload: humanMessages.includes(title.toLowerCase()) ? "human" : callback || title,
    };

    const metadata = { mid, time, name, username };
    if (message.payload === "human") {
      bot._sockets[userId]?.emit("livechat:request");
    }
    bot._sockets[userId]?.emit("message:sent", message, metadata);
  });

  bot.on("attachment", async (payload) => {
    const { from: userId, id: mid, timestamp: time, name = null, username = null, type } = payload;
    await bot.connectSocket(userId, name, username);

    const metadata = { mid, time, name, username };

    if (type === "unsupported") {
      bot._sockets[userId]?.emit("message:sent", { title: "Unsupported Attachment" });
    }
    const message = {
      title: payload.caption || "",
      payload: "/attachments",
      attachment: {
        type: type === "sticker" ? "image" : type,
        payload: `${process.env.FILE_BASE_URL}rest/v1/chat/telegramFile/${payload[type]}`,
      },
    };
    bot._sockets[userId]?.emit("message:sent", message, metadata);
  });
}

module.exports = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  secretToken: process.env.TELEGRAM_VERIFY_TOKEN,
});

const ServerServices = require("./server.services");
const { isQueryUnhandeled } = require("./query.service");

async function postMessage(message, attachment, metadata, receipentId, type, senderId) {
  let exlcudeMessages = ['Starting Menu', 'dummy_welcome', 'Get Started', '/menu', 'menu', 'greet', 'Greet', "Greetings ! from PalmMind Technology. I'm PalmBot, Your AI Assistant. How may I help you today?"];
  if (exlcudeMessages.includes(message)) {
    return;
  }
  const userId = type === "human" ? senderId : receipentId;
  metadata.source = metadata?.source?metadata.source.replace(/-agent/g, "") : 'web';

  const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/messages/userId/{userId}?userId=${userId}&access_token=${process.env.ADMIN_TOKEN}`

  const messageText = Array.isArray(message) ? message[0] :
    typeof message === 'object' ? Object.entries(message).map(([key, value]) => `${key}:${value}`).join(" ") : message.toString();
    const bodyData = {
      senderId: senderId,
      usertype: type,
      text: messageText,
      attachment,
      metadata,
      createdDate: new Date(metadata.time).toISOString(),
    };

    let headers = {
      "Content-Type": "application/json",
    };
    try {
      await ServerServices.postToServer(url, bodyData, headers);
    } catch (err) {
      console.log("Please verify your dashboard server is running or not", err);
    }
}

async function patchMessage(message, text = "unsent message") {
  const host = process.env.DASHBOARD_SERVER;
  const port = process.env.DASHBOARD_PORT;
  const protocol = "http://";
  const path = "/rest/v1/messages?access_token=" + process.env.ADMIN_TOKEN;
  const baseUrl = protocol + host + ":" + port + path;

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const filter = '{"where":{"metadata":"{\\"mid\\":\\"' + message.mid + '\\"}"}}';
    const getResponse = await ServerServices.getFromServer(baseUrl + `&filter=${filter}`);
    const { data: getData } = await getResponse.json();
    if (!getData.length) {
      throw new Error("message to be patched was not found");
    };
    const patchBody = {
      id: getData[0].id,
      text,
    };
    await ServerServices.httpService(baseUrl, headers, "PATCH", patchBody);
  } catch (err) {
    console.log("Please verify your dashboard server is running or not", err);
  }
}

async function postQuery(title, payload = "", senderId = "web", forceHandled = false, responseMessage, visitorUserId) {
  // const url = `https://${process.env.DASHBOARD_SERVER}/rest/v1/Organizations/${process.env.ORGANIZATION_ID}/queries`;
  
  try {
    payload = payload.length ? payload : title;
    senderId = senderId?senderId.replace(/-agent/g, "") : 'web';
    let unhandeled = false;
    if (forceHandled) {
      unhandeled = false
    }
    const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/rest/v1/Organizations/${process.env.ORGANIZATION_ID}/queries`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: process.env.BOT_TOKEN,
    };
    const body = {
      visitorUserId,
      senderId,
      query: unhandeled ? payload : title,
      intentId: "",
      handled: unhandeled ? "false" : "true",
      response: responseMessage
    };
    await ServerServices.httpService(url, headers, "POST", body);
  } catch (error) {
    console.log("ERROR IN POST QUERY", error);
  }
}

exports.postMessage = postMessage;
exports.patchMessage = patchMessage;
exports.postQuery = postQuery;

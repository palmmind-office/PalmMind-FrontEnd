// const { postQuery } = require("../services/message.service");
const ServerServices = require("../services/server.services");

// localdata
const localData = require("../localDataJson/localrundata");

// bots
const { messengerBot, instagramBot } = require("../bot/facebook.bot");
const whatsappBot = require("../bot/whatsapp.bot");
const viberBot = require("../bot/viber.bot");

const { errorLogger } = require("../logger/main");

const REDIS_KEY = `${process.env.ORGANIZATION_ID}:users`;
const { client } = require("../utils/redis");
const { getCalendar } = require("../services/calendarService");

const handledSetTimeout = (callback, timeout) => {
  setTimeout(async () => {
    try {
      await callback();
    } catch (error) {
      console.log("ERROR IN SET TIMEOUT => ", error);
      errorLogger.log({ level: "error", timestamp: new Date(), message: { title: error.message } });
    }
  }, timeout)
};
const sanitizeMessage = (message) => {
  const attachment = message.attachment;
  return {
    ...message,
    type: typeof message.type === 'string' ? message.type : "invalidMessage",
    ...(attachment ? {
      attachment: {
        ...attachment,
        type: typeof attachment.type === 'string' ? attachment.type : "unknown",
        payload: typeof attachment.payload === 'string' ? attachment.payload : "invalid attachment"
      }
    } : {})
  }
}
const getUserData = async (userId) => {
  if (!userId || (typeof userId) !== 'string') {
    return {}
  }
  const userData = await client.hget(REDIS_KEY, userId);
  return {
    name: userData?.name || (userData?.first_name || userData?.last_name ? `${userData?.first_name + ' ' || ''}${userData?.last_name || ''}` : userId.replaceAll("_", " ").toUpperCase()),
    role: userData?.role,
    id: userData?.id,
    uniqueId: userId
  };
}

//checking user exist in db
const saveUserInDashboard = async (id, source, data) => {
  // let url = `https://${process.env.DASHBOARD_SERVER}/${process.env.BASEPATH}/visitors/userId?userId=${id}&access_token=${process.env.ADMIN_TOKEN}`;
  let url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/${process.env.BASEPATH}/visitors/userId?userId=${id}&access_token=${process.env.ADMIN_TOKEN}`;
  let organizationId = process.env.ORGANIZATION_ID;
  let profileDetails = {};
  if (source === "fb") {
    profileDetails = await messengerBot.getUserProfile(id);
  } else if (source === "instagram") {
    profileDetails = await instagramBot.getUserProfile(id);
  } else if (['whatsapp', 'viber'].includes(source)) {
    profileDetails = data
  }
  else if (source === 'web' && Object.keys(data).includes('visitedSource')) {
    profileDetails = data
  }

  delete profileDetails.error;
  let bodyData = {
    source: source,
    user_id: id,
    organizationId: organizationId,
    clientDetails: {
      ...profileDetails,
    },
  };
  let headers = {
    "Content-Type": "application/json",
  };
  return ServerServices.postToServer(url, bodyData, headers)
    .catch(error => {
      console.log("ERROR IN SAVE USER IN DASHBOARD => ", error);
    });
};

const sendOfflineMessage = async (message, metadata, source) => {
  const bot = { fb: messengerBot, instagram: instagramBot, viber: viberBot, whatsapp: whatsappBot }[source];
  if (!bot || !bot.handleResponseMessage || typeof bot.handleResponseMessage !== 'function') {
    return null;
  }
  return bot.handleResponseMessage(metadata, message);
}

const saveSessionInDashboard = async (data) => {
  // let url = `https://${process.env.DASHBOARD_SERVER}/${process.env.BASEPATH}/visitors/userId?userId=${id}&access_token=${process.env.ADMIN_TOKEN}`;
  const url = `http://${process.env.DASHBOARD_SERVER}:${process.env.DASHBOARD_PORT}/${process.env.BASEPATH}/sessions/addBulkSession?access_token=${process.env.ADMIN_TOKEN}`;

  const headers = {
    "Content-Type": "application/json",
  };

  return ServerServices.postToServer(url, data, headers)
    .catch(error => {
      console.log("ERROR IN SAVE SESSION IN DASHBOARD => ", error)
    });
  // console.log(url, {data}, (await response.json()))
};

const bypassRasa = async function (socket, message, userID, metadata) {
  let emitted = true;
  
  if(message ==='greet' ){
    socket.emit('message:received',localData.startMessaging)
  }
  else if(message ==='menu' ){
    socket.emit('message:received',localData.menu)
  }
  else if(message ==='Book a Demo' ){
    const timeslots = await getCalendar();
    socket.emit('message:received', timeslots)
  }
  else {
    emitted = false;
  }

  return emitted;
  if (message === 'Get Started') {
    socket.emit('message:received', localData.intro);
  }
  else if(message ==='greet' ){
    socket.emit('message:received',localData.startMessaging)

  }
  else if(message ==='menu' ){
    socket.emit('message:received',localData.menu)
  }
  else if(message ==='See our Chatbots'){
    socket.emit('message:received',localData.ourProducts)
  }
  else if(message ==='Banking'){
    socket.emit('message:received',localData.banking)
  }
  else if(message ==='Insurance'){
    socket.emit('message:received',localData.insurance)
  }
  else if(message ==='Automotive'){
    socket.emit('message:received',localData.automotive)
  }
  else if(message ==='Colleges'){
    socket.emit('message:received',localData.colleges)
  }
  else if(message ==='Government'){
    socket.emit('message:received',localData.government)
  }
  else if(message ==='Education Consultancies'){
    socket.emit('message:received',localData.consultancy)
  }
  else if(message ==='Know More'){
    socket.emit('message:received',localData.knowMore)
  }
  else if(message ==='Book a Demo'){
    socket.emit('message:received',localData.bookDemo)
  }
  else if(message ==='Contact Us'){
    socket.emit('message:received',localData.contact)
  }
  else if(message ==='Jobs'){
    socket.emit('message:received',localData.lookJob)
  }
  else if(message ==='Full Time Job'){
    socket.emit('message:received',localData.fullTimeJob)
  }
  else if(message ==='Internship'){
    socket.emit('message:received',localData.internship)
  }
  else if(message ==='Apply for Position'){
    socket.emit('message:received',localData.applyJob)
  }
  else if(message ==='Apply Now'){
    socket.emit('message:received',localData.applyNow)
  }
  else if(message ==='Get a free Trial'){
    socket.emit('message:received',localData.getFreeTrial)
  }
  else if(message ==='Get Free Trial Form'){
    socket.emit('message:received',localData.getFreeTrialForm)
  }
  else if (message === 'ignore-livechat') {
    socket.emit('message:received', 'Livechat request cancelled')
  }
  
};

module.exports = {
  saveUserInDashboard,
  saveSessionInDashboard,
  bypassRasa,
  getUserData,
  handledSetTimeout,
  sendOfflineMessage,
  sanitizeMessage
};

const { client } = require("../utils/redis");
const Handlers = require("./handlers");
const eventsMap = require("./eventsMap");

const { loggerInfo, loggerError } = require("../services/logger.services");
const { errorLogger } = require("../logger/main");

const USER_REDIS_KEY = `${process.env.ORGANIZATION_ID}:users`;
const SESSION_REDIS_KEY = `${process.env.ORGANIZATION_ID}:sessions`;
const PAYLOAD_ACCEPT_ACTIONS = ["accept", "reject", "end", "request", "transferRequest", "transferAccept", 'transferReject'];

const ALLOWED_ORIGINS = process.env.SOCKET_ALLOWED_ORIGINS.split(", ");

// socket error handler
const withErrorHandler = (action) => async function (...args) {
  const eventName = action.replace(/([a-z][A-Z])/, (x) => `${x[0]}:${x[1].toLowerCase()}`);
  try {
    const data = await this(...args);
    const mapFunction = eventsMap[action];
    if (!mapFunction || typeof mapFunction !== 'function') {
      return;
    }
    const metadata = {
      action,
      ...(await mapFunction(data) || {})
    }
    loggerInfo(action, metadata, 200, eventName);
  } catch (error) {
    console.log(`ERROR IN SOCKET HANDLER ${action} => `, error);
    errorLogger.log({ level: "error", timestamp: new Date(), message: { title: error.message } });
    loggerError(error?.message || error, { action }, null, eventName);
    const callback = args.find(arg => typeof arg === 'function');
    return callback ? callback() : null;
  }
};

async function handleSocketPayload(payload) {
  try {
    // to emit socket event typeAction(...args) send a payload of type:action:arg1:arg2:...
    // for example to emit livechatAccept(acceptId) payload should be livechat:accept:{acceptId}
    let [type, action, ...args] = payload.split(":");
    if (!type || !action) {
      return false;
    }
    if (args.join(":").includes("{")) {
      try {
        args = Object.values(JSON.parse(args.join(":")))
      } catch (error) {
        args = args;
      }
    }
    const eventName = type + action[0].toUpperCase() + action.slice(1);
    if (type === "livechat" && this._PAYLOAD_ACCEPT_ACTIONS.includes(action)) {
      // await this[eventName](...args);
      // console.log("inside section", payload, eventName)
      await withErrorHandler(eventName).bind(this[eventName].bind(this))(...args);
      return true;
    }
    return false;
  } catch (error) {
    console.log("ERROR IN HANDLE SOCKET PAYLOAD => ", payload, error)
    return false;
  }
}

exports.init = function (io) {
  client.del(USER_REDIS_KEY);
  client.del(SESSION_REDIS_KEY);

  io.use(function (socket, next) {
    try {
      const { token } = socket.handshake.query;
      const { origin } = socket.handshake.headers;
      if (ALLOWED_ORIGINS.length && origin && !ALLOWED_ORIGINS.includes(origin)) {
        throw new Error("Origin not Allowed " + origin)
      }
      if (token !== process.env.SOCKET_TOKEN) {
        throw new Error("Invalid Authorization Token " + token);
      }
      next();
    } catch (error) {
      console.log("ERROR IN SOCKET REQUEST => ", error);
      socket.disconnect();
    }
  });

  io.sockets.on("connection", function (socket) {
    const handlers = new Handlers(io, socket, USER_REDIS_KEY, PAYLOAD_ACCEPT_ACTIONS);
    handlers.handleSocketPayload = handleSocketPayload;
    Object.keys(eventsMap).forEach(action => {
      const eventName = action.replace(/([a-z][A-Z])/, (x) => `${x[0]}:${x[1].toLowerCase()}`);
      socket.on(eventName, withErrorHandler(action).bind(handlers[action].bind(handlers)));
    })
  });
};

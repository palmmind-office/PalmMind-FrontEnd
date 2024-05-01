const { postMessage, postQuery } = require("../services/message.service");
const { client } = require("../utils/redis");
const { saveUserInDashboard, bypassRasa, saveSessionInDashboard, handledSetTimeout, sendOfflineMessage, sanitizeMessage } = require("./utils");
const RasaAPI = require("../utils/rasa");
const messages = require("./messages");
const crypto = require("crypto");
let excludeQuery = ['Starting Menu', 'dummy_welcome', 'Get Started', '/menu', 'menu', 'lead'];

class Handlers {
  constructor(io, socket, userRedisKey, payloadAcceptActions) {
    this._io = io;
    this._socket = socket;
    this._userRedisKey = userRedisKey;
    // this._sessionRedisKey = sessionRedisKey;
    this._user = null;
    this._source = null;
    this._LIVECHAT_REQUEST_EXPIRY = 180; //seconds;
    this._TRANSFER_REQUEST_EXPIRY = 15; //seconds;
    this._LIVECHAT_SESSION_EXPIRY = 1 * 60 * 60; //seconds;
    this._PAYLOAD_ACCEPT_ACTIONS = payloadAcceptActions
    // to remove user data after 1 hour of inactivity [necessary for facebook bots]
    this._removeDataTimeout;
    this._sessionData = {}
  }

  serverMetadata(receipent = this._user) {
    return { time: Date.now(), sender: "server", source: this._source, receipent };
  }

  setRemoveDataTimeout(seconds = 1 * 60 * 60) {
    if (this._removeDataTimeout) {
      clearTimeout(this._removeDataTimeout);
    }
    this._removeDataTimeout = handledSetTimeout(() => {
      // client.hdel(this._userRedisKey, this._user);
      this._socket.disconnect();
    }, seconds * 1000);
  }

  async disconnect() {
    handledSetTimeout(() => {
      this.disconnectHandler();
    }, 10 * 1000)
  }

  async disconnectHandler() {
    const isSomeDeviceConnected = this._io.sockets.adapter.rooms[this._user]?.length > 0;
    if (isSomeDeviceConnected) {
      return null;
    }
    const userData = await client.hget(this._userRedisKey, this._user);
    client.hdel(this._userRedisKey, this._user);

    if (userData.role === 'Agent') {
      const users = await client.hgetall(this._userRedisKey);
      await Promise.all(
        Object.entries(users).filter(([_, data]) => data.engagedWith === this._user).map(async ([visitor, data]) => {
          await this.livechatExpire(visitor, this._user, true, false)
          await this.userSetSession(`endedChat::${this._user}::${this._user}`, data.engagedWith)
        })
      );      
      const agentSession = {
        agent: this._user,
        organizationId: process.env.ORGANIZATION_ID,
        createdDate: userData.connected,
        source: userData.source?.replace("-agent", "") || "web",
        events: [
          {
            event: 'joined',
            data: userData.category,
            timestamp: userData.connected
          },
          {
            event: 'left',
            data: userData.category,
            timestamp: Date.now()
          }
        ]
      }
      console.log(agentSession, ">>>>>>>>>>>>>>")
      return saveSessionInDashboard([agentSession])
    }
    await this.userBroadcast();

    if (!userData.id || !userData.source) {
      return null;
    }

    const defaultSession = {
      visitor: userData.id,
      organizationId: process.env.ORGANIZATION_ID,
      source: userData.source
    }

    const subSessionHistory = Object.entries(userData?.sessionHistory || {}).map(([timestamp, eventData]) => {
      const [event, data, engagedWith] = eventData.split('::');
      return ({ event, data, engagedWith, timestamp: parseInt(timestamp) })
    });
    const sessionData = [...subSessionHistory, ...(userData.engagedWith ? [{
      event: 'endedChat',
      data: 'self',
      engagedWith: userData.engagedWith,
      timestamp: Date.now(),
    }] : []), {
      event: 'left',
      data: userData.category,
      timestamp: Date.now(),
      engagedWith: userData.engagedWith || "bot",
    }];
    // the following code breaks events into sessions grouped by engagedWith
    let sessions = [];
    let runningAgent = "";

    for (const eventData of sessionData.sort((a, b) => a.timestamp - b.timestamp)) {
      const currentAgent = eventData.engagedWith || "bot";
      delete eventData.engagedWith;

      if (currentAgent !== runningAgent) {
        sessions = [{ agent: currentAgent, ...defaultSession, events: [eventData] }, ...sessions];
      } else {
        sessions.find(({ agent }) => agent === currentAgent).events.push(eventData);
      }

      runningAgent = currentAgent;
      if (eventData.event === 'transferredChat') {
        sessions = [{ agent: eventData.data, ...defaultSession, events: [eventData] }, ...sessions];
        runningAgent = eventData.data;
      }
    }

    // await client.hset(this._sessionRedisKey, this._user, sessionData)
    return saveSessionInDashboard(sessions.reverse().map(session => ({ ...session, createdDate: (session.events || [])[0]?.timestamp })));
  }

  async userSetStatus(status = "passive") {
    await client.hset(this._userRedisKey, this._user, { status });
    if (status === 'passive') {
      const allUsers = await client.hgetall(this._userRedisKey);
      const engagedIds = Object.entries(allUsers).filter(([_, data]) => data.engagedWith === this._user);
      await Promise.all(engagedIds.map(async ([engagedId, _]) => {
        await this.livechatExpire(engagedId, this._user, true, false);
        await this.userSetSession(`endedChat::${this._user}::${this._user}`, engagedId);
      }))
    }
    await this.userBroadcast();
  }

  async userGetData(callback) {
    const data = await client.hget(this._userRedisKey, this._user);
    return callback(data);
  }

  async userSetSession(newSessionEvent, visitorId) {
    const userData = await client.hget(this._userRedisKey, this._user);
    if (userData.role === 'User') {
      visitorId = this._user
    }
    if (!visitorId || !newSessionEvent) {
      return null;
    }
    const sessionHistory = { [Date.now()]: newSessionEvent };
    await client.hset(this._userRedisKey, visitorId, { sessionHistory }, ["sessionHistory"])
  }

  async userSetData(data) {
    const validKeys = ['name', 'first_name', 'last_name', 'username', 'id', 'mobileNumber', 'email', 'location', 'latitude', 'longitude', 'navigationHistory', 'sessionHistory', 'osInfo', 'broswerInfo', 'profile_pic', 'updatedDate'];
    const navigationHistory = data.newLink ? { [Date.now()]: data.newLink } : undefined;
    if (data.newLink) {
      const userData = await client.hget(this._userRedisKey, this._user);
      await this.userSetSession(`navigation::${data.newLink}::${userData.engagedWith || "bot"}`, this._user)
    }
    if (navigationHistory) {
      data.navigationHistory = navigationHistory;
    }
    Object.keys(data).forEach((key) => {
      if (!validKeys.includes(key)) {
        delete data[key]
      }
    })
    await client.hset(this._userRedisKey, this._user, data, ["navigationHistory"]);
    await this.userBroadcast();
  }

  async userJoin(userId, category = "all", role = "User", source = "web", botUserData = {}, callback = (value) => value) {
    if (!userId || (this._user && this._user !== userId)) {
      return callback(false);
    }
    if (!this._source && !source) {
      return callback(false);
    }
    this._user = userId;
    this._source = this._source || source;
    let user = await client.hget(this._userRedisKey, this._user);
    if (user.joined) {
      this._socket.to(this._user).emit("user:alreadyJoined", userId);
    }
    category = user.category || category;
    role = user.role || role;
    [this._user, category, role].forEach((room) => this._socket.join(room));

    if (role === "Agent") {
      await client.hset(this._userRedisKey, this._user, {
        category, role,
        source: this._source,
        status: 'active',
        connected: user.connected || Date.now()
      });
      this._socket.join("all");
      return callback(true);
    }

    const response = await saveUserInDashboard(this._user, this._source, botUserData);
    if (!response) {
      return callback(false);
    }

    const data = await response.json();
    await client.hset(this._userRedisKey, this._user, { category, role, source: this._source, joined: true });
    await this.userSetData({ ...data.clientDetails, ...data })
    await this.userSetSession(`joined::${category}::${user.engagedWith || "bot"}`);
    await this.broadcastToAgents('livechat:userConnect', { source: this._source, userId: this._user });
    user = await client.hget(this._userRedisKey, this._user);
    return callback(user);
  }

  async userBroadcast() {
    const users = await client.hgetall(this._userRedisKey);

    const visitorsAndAgents = Object.entries(users).map(([userId, data]) => ({ userId, ...data, connected: data.connected || true }));
    this._io.to('Agent').emit("livechat:users", visitorsAndAgents);
  }

  async livechatUsers() {
    const agent = await client.hget(this._userRedisKey, this._user);
    if (agent.role !== "Agent") {
      return null;
    }
    const users = await client.hgetall(this._userRedisKey);
    const categoryUsers = [];
    Object.entries(users).forEach(([userId, data]) => {
      const userJson = { userId, ...data, connected: true };
      categoryUsers.push(userJson);
    });
    const uniqueIds = [...new Set(categoryUsers.map((user) => user.userId))];
    const uniqueUsers = uniqueIds.map((userId) => categoryUsers.find((user) => user.userId === userId));
    this._socket.emit("livechat:users", uniqueUsers);
  }

  async sendMessagesAtInterval(data, userId, secondsToWait = 3) {
    const indexWiseResponse = async (counter) => {
      const responseMessage = data[counter].responseMessage || data[counter];
      this._io.to(userId).emit("message:received", responseMessage, this.serverMetadata(userId));
      const postMessageData = responseMessage.custom || responseMessage
      const postText = postMessageData.title || postMessageData.text || postMessageData.bodyText || postMessageData.message || postMessageData.type || postMessageData.Text || postMessageData.Type || JSON.stringify(responseMessage);
      const agentMessage = { type: "botMessage", text: postText, id: crypto.randomUUID() };
      await this.broadcastToAgents("message:received", agentMessage, this.serverMetadata(userId));
      postMessage(postText, undefined, { ...this.serverMetadata(userId), payload: postMessageData.payload }, userId, "bot", "bot");
    }
    if (!data.length) {
      return;
    }
    await indexWiseResponse(0);
    if (data.length === 1) {
      return;
    }
    let counter = 1;
    const sendMessageInterval = setInterval(async () => {
      await indexWiseResponse(counter)
      counter++;
      if (counter === data.length) {
        clearInterval(sendMessageInterval);
      }
    }, secondsToWait * 1000); // convert seconds to miliseconds

  }

  async livechatRequest(requestId, onlyOppositeRole = true, attachedMessage, intervene = false) {
    const requester = await client.hget(this._userRedisKey, this._user);
    if (requester.role === 'User') {
      this.setRemoveDataTimeout();
    }
    const category = (requester.role === "User" && requestId) || requester.category || "all";
    const requestee = await client.hget(this._userRedisKey, requestId);

    if (requester.role === "User" && requester.engagedWith) {
      const alreadyEngagedMessage = await messages.alreadyEngaged(null, requester.engagedWith, this._user);
      this._io.to(this._user).emit("message:received", alreadyEngagedMessage, this.serverMetadata());
      return;
    }

    // two types of request can be sent:
    // 1. with requestId targeted to particular user [helpful for agents] or some category [helpful for users]
    // 2. without requestId open to any one available in given category [helpful for users]
    // if onlyOppositeRole is true searches for users of opposite roles when requestId is absent

    const oppositeRole = requester.role === "User" ? "Agent" : "User";
    const allUsers = await client.hgetall(this._userRedisKey);

    if (requester.role === 'User') {
      const isSomeoneAvailable = Object.values(allUsers).some(
        (user) =>
          (!onlyOppositeRole || user.role === oppositeRole) &&
          (category === "all" || user.category === category) &&
          (user.role === 'User' || user.status === 'active')
      );
      if (!isSomeoneAvailable) {
        // const rasaResponse = await RasaAPI.getIntentRequest('/agent_unavailable', { 'source': this._source || 'web', sender: this._user });
        // const data = Array.isArray(rasaResponse) ? rasaResponse : [rasaResponse];
        // return this.sendMessagesAtInterval(data, this._user)
        return this._io.to(this._user).emit("message:received", messages.notAvailable(category), this.serverMetadata());
      }
      await client.hset(this._userRedisKey, this._user, { waiting: true })
      await this.userBroadcast();
      await this.userSetSession(`sentRequest::${category}`);
    }

    if (requestee.engagedWith) {
      const alreadyEngagedMessage = await messages.alreadyEngaged(requestId, requestee.engagedWith, this._user);
      this._socket.emit("message:received", alreadyEngagedMessage, this.serverMetadata());
      return;
    }

    if (requestee.requester) {
      const alreadyRequestedMessage = await messages.alreadyRequested(requestId, requestee.requester, this._user);
      this._socket.emit("message:received", alreadyRequestedMessage, this.serverMetadata());
      return;
    }

    if (requester.role === 'Agent' && requestee.role === 'User' && intervene) {
      return this.livechatStart(requestId, this._user, this._user, false, true);
    }

    const requestExpiry = `${parseInt(this._LIVECHAT_REQUEST_EXPIRY / 60)} minutes`;
    const incomingRequestMessage = await messages.incomingRequest(requester.role, this._user, requestExpiry, requester.source, attachedMessage);

    if (requester.role === 'Agent' && requestId) {
      this._io.to(requestId).emit("message:received", incomingRequestMessage, this.serverMetadata(requestId));

      if (requestee.role === 'User') {
        await client.hset(this._userRedisKey, requestId, { requester: this._user });
        await this.userSetSession(`receivedRequest::${this._user}`, requestId);
      };
      await this.userBroadcast();
    } else if (onlyOppositeRole) {
      const oppositeUsers = Object.entries(allUsers).filter(
        ([_, data]) => (category === "all" || data.category === category) && data.role === oppositeRole && (data.role === 'User' || data.status === 'active')
      );
      oppositeUsers.forEach(([userId]) => {
        this._io.to(userId).emit("message:received", incomingRequestMessage, this.serverMetadata(userId));
      });
    } else {
      this._socket
        .to(category)
        .to("all")
        .emit("message:received", incomingRequestMessage, this.serverMetadata(requestId));
    }

    this._io.to(this._user).emit("message:received", messages.sentRequest(), this.serverMetadata()); // broadcast event to all 
    this._io.to(this._user).emit("livechatRequest:sent");

    handledSetTimeout(async () => {
      const userData = await client.hget(this._userRedisKey, this._user);

      if (userData.role === 'Agent') {
        const requestUser = await client.hget(this._userRedisKey, requestId);
        if (this._user !== requestUser.requester) { return null; }
        await client.hset(this._userRedisKey, requestId, { requester: undefined });
      }

      if (userData.role === 'User' && !userData.waiting) {
        return null;
      }

      await client.hset(this._userRedisKey, this._user, { waiting: undefined })
      await this.userBroadcast();

      const expiredRequestMessage = await messages.expiredRequest(requestId);
      this._io.to(this._user).emit("message:received", expiredRequestMessage, this.serverMetadata());
    }, this._LIVECHAT_REQUEST_EXPIRY * 1000); //ms

    return { requester: this._user, requestee: requestId || category };
  }

  async livechatAccept(acceptId) {
    const acceptor = await client.hget(this._userRedisKey, this._user);
    if (acceptor.role === 'User') {
      this.setRemoveDataTimeout();
    }
    const accepted = await client.hget(this._userRedisKey, acceptId);

    acceptId = acceptId || acceptor.requester;

    if (!acceptId || (acceptor.role === "User" && acceptor.requester !== acceptId)) {
      this._socket.emit("message:received", await messages.notYetRequested(acceptId), this.serverMetadata());
      return;
    }

    if (accepted.engagedWith) {
      const alreadyEngagedMessage = await messages.alreadyEngaged(acceptId, accepted.engagedWith, this._user);
      this._socket.emit("message:received", alreadyEngagedMessage, this.serverMetadata());
      return;
    }

    if (acceptor.role === 'Agent' && !accepted.waiting) {
      this._socket.emit("message:received", await messages.notYetRequested(acceptId), this.serverMetadata());
      return;
    }

    if (acceptor.role === "Agent" && acceptor.status !== "active") {
      this._socket.emit("message:received", messages.notActive(), this.serverMetadata());
      return;
    }

    const agentId = acceptor.role === "User" ? acceptId : this._user;
    const userId = agentId === acceptId ? this._user : acceptId;
    acceptor.role === 'User' && (await this.userSetSession(`acceptedRequest::${acceptId}`))
    await this.livechatStart(userId, agentId);

    // system logger
    return { acceptee: acceptId, acceptor: this._user }
  }

  async livechatReject(rejectId) {
    const rejector = await client.hget(this._userRedisKey, this._user);
    if (rejector.role === 'User') {
      this.setRemoveDataTimeout();
    }
    rejectId = rejectId || rejector.requester;


    if (!rejectId || (rejector.role === "User" && rejector.requester !== rejectId)) {
      this._socket.emit("message:received", await messages.notYetRequested(rejectId), this.serverMetadata());
      return;
    }

    const rejected = await client.hget(this._userRedisKey, rejectId);
    if (rejected.engagedWith) {
      const alreadyEngagedMessage = await messages.alreadyEngaged(rejectId, rejected.engagedWith, this._user);
      this._socket.emit("message:received", alreadyEngagedMessage, this.serverMetadata());
      return;
    }

    await client.hset(this._userRedisKey, this._user, { requester: undefined });

    // send rejected message only to agents
    rejected.role === 'Agent' && this._io.to(rejectId).emit("message:received", await messages.livechatReject(this._user), this.serverMetadata(rejectId));
    this._io.to(this._user).emit("message:received", await messages.livechatReject(), this.serverMetadata());
    rejector.role === 'User' && (await this.userSetSession(`rejectedRequest::${rejectId}`))
    this._io
      .to(this._user)
      .emit("livechat:reject");
    await this.userBroadcast();

    return { rejectee: rejectId, rejector: this._user }
  }

  async livechatStart(visitorId, agentId, fromId = "", isTranferred = false, isIntervened = false) {
    const agentUser = await client.hget(this._userRedisKey, agentId);
    const visitorUser = await client.hget(this._userRedisKey, visitorId);

    if (agentUser.status !== 'active') {
      this._io.to(visitorId).emit("message:received", messages.notActive(true), this.serverMetadata(visitorId))
      await client.hset(this._userRedisKey, visitorId, { requester: undefined, waiting: false, engagedWith: undefined })
      await this.userBroadcast()
      this._io.to(agentId).emit("message:received", messages.notActive(), this.serverMetadata(agentId))
      return;
    }

    await this.userSetSession(`${isTranferred ? 'transferred' : isIntervened ? 'intervened' : 'started'}Chat::${agentId}::${visitorUser.engagedWith || agentId}`, visitorId)

    await client.hset(this._userRedisKey, visitorId, {
      requester: undefined,
      waiting: undefined,
      engagedWith: agentId,
      category: agentUser.category || "all",
    });

    const sessionTime = `${parseInt(this._LIVECHAT_SESSION_EXPIRY / 60)} minutes`;

    this._io
      .to(visitorId)
      .emit("message:received", await messages.livechatStart(agentId, sessionTime, "", isTranferred, isIntervened), this.serverMetadata(visitorId));

    this._io
      .to(visitorId)
      .emit("livechat:started");

    this._io
      .to(agentId)
      .emit("message:received", await messages.livechatStart(visitorId, sessionTime, fromId, isTranferred, isIntervened), this.serverMetadata(agentId));

    // const allUsers = await client.hgetall(this._userRedisKey);

    // Object.entries(allUsers).forEach(([id, userData]) => {
    //   if (userData.role === 'Agent') {
    //     this._socket.to(id).emit("livechat:close", JSON.stringify({ visitorId, source: visitorUser.source }))
    //   }
    // })
    this._io.to('Agent').emit("livechat:close", JSON.stringify({ visitorId, source: visitorUser.source }))
    await this.userBroadcast();

    handledSetTimeout(async () => {
      const { engagedWith } = await client.hget(this._userRedisKey, visitorId);
      if (!engagedWith || engagedWith !== agentId) {
        return null;
      }
      await this.livechatExpire(visitorId, agentId, false);
    }, this._LIVECHAT_SESSION_EXPIRY * 1000); //ms
  }

  async livechatTransferRequest(transferId, agentId) {
    const agentData = await client.hget(this._userRedisKey, agentId);
    const visitorData = await client.hget(this._userRedisKey, transferId);

    if (agentData.role !== "Agent" || visitorData.engagedWith !== this._user) {
      this._socket.emit("message:received", await messages.transferFailed(transferId, agentId), this.serverMetadata());
      return;
    }

    if (visitorData.requestedTransferTo?.includes(agentId)) {
      const alreadyRequestedMessage = await messages.alreadyRequested(agentId, this._user, visitorData.engagedWith, true);
      this._socket.emit("message:received", alreadyRequestedMessage, this.serverMetadata());
      return;
    }

    await client.hset(this._userRedisKey, transferId,
      { requestedTransferTo: [...(visitorData.requestedTransferTo || []), agentId] })

    const expiryTime = `${this._TRANSFER_REQUEST_EXPIRY} seconds`

    this._io
      .to(agentId)
      .emit("message:received", await messages.transferRequest(this._user, transferId, expiryTime, visitorData.source), this.serverMetadata(agentId));

    await this.userBroadcast();

    handledSetTimeout(async () => {
      await client.hset(this._userRedisKey, transferId, { requestedTransferTo: visitorData.requestedTransferTo?.filter((agent) => agent !== agentId) });
      await this.userBroadcast();
      // const allUsers = await client.hgetall(this._userRedisKey);
      // Object.entries(allUsers).forEach(([id, userData]) => {
      //   if (userData.role === 'Agent') {
      //     this._socket.to(id).emit("livechat:close", JSON.stringify({ visitorId: transferId, source: visitorData.source }));
      //   }
      // })
      this._io.to('Agent').emit("livechat:close", JSON.stringify({ visitorId: transferId, source: visitorData.source }));
    }, this._TRANSFER_REQUEST_EXPIRY * 1000);

    return { requester: visitorData?.engagedWith, requestee: agentId }

  }

  async livechatTransferAccept(visitorId) {

    const visitorData = await client.hget(this._userRedisKey, visitorId);

    if (!visitorData.requestedTransferTo?.includes(this._user)) {
      return this._socket.emit("message:received", await messages.notYetRequested(), this.serverMetadata())
    }

    if (visitorData.engagedWith) {
      this._io.to(visitorData.engagedWith).emit("message:received", await messages.transferSuccess(visitorId, this._user), this.serverMetadata(visitorData.engagedWith));
    }

    await client.hset(this._userRedisKey, visitorId, { requestedTransferTo: undefined });

    await this.livechatStart(visitorId, this._user, visitorData.engagedWith, true);

    return { acceptee: visitorData?.engagedWith, acceptor: this._user }
  }

  async livechatTransferReject(visitorId) {
    const visitorData = await client.hget(this._userRedisKey, visitorId);

    if (!visitorData.requestedTransferTo?.includes(this._user)) {
      return this._socket.emit("message:received", await messages.notYetRequested(), this.serverMetadata())
    }

    if (visitorData.engagedWith) {
      this._io.to(visitorData.engagedWith).emit("message:received", await messages.transferFailure(visitorId, this._user), this.serverMetadata(visitorData.engagedWith));
    }

    await client.hset(this._userRedisKey, visitorId, { requestedTransferTo: visitorData.requestedTransferTo?.filter((agent) => agent !== this._user) });

    await this.userBroadcast();

    return { rejectee: visitorData?.engagedWith, rejector: this._user }
  }

  async livechatExpire(visitorId, agentId, forced = true, broadcast = true) {
    const visitor = await client.hget(this._userRedisKey, visitorId);
    if (visitor.engagedWith !== agentId) {
      return null;
    }
    await client.hset(this._userRedisKey, visitorId, { engagedWith: undefined, waiting: undefined });

    this._io.to(visitorId).emit("message:received", await messages.livechatExpire(agentId, forced), this.serverMetadata(visitorId));
    this._io.to(visitorId).emit("livechat:ended");
    if (!forced) {
      await this.userSetSession('endedChat::auto::' + visitor.engagedWith)
    }
    this._io
      .to(agentId)
      .emit("message:received", await messages.livechatExpire(visitorId, forced), this.serverMetadata(agentId));
    //for storing agent rating from rasa  
    // const senderUser = await client.hget(this._userRedisKey, visitorId);
    // this.callRasa('/customer_rating', { agentId, visitorId, source: senderUser.source }, '/customer_rating', visitorId);
    if (!broadcast) {
      return null;
    }
    await this.userBroadcast();

  }

  async livechatEnd(visitorId) {
    const userData = await client.hget(this._userRedisKey, this._user);

    if (userData.role === "Agent") {
      const engagedData = visitorId && await client.hget(this._userRedisKey, visitorId)
      if (!engagedData || engagedData.engagedWith !== this._user) {
        this._io.to(this._user).emit("message:received", await messages.notEngaged(visitorId), this.serverMetadata());
        return;
      }
      await this.livechatExpire(visitorId, this._user, true, false);
      await this.userSetSession(`endedChat::${this._user}::${this._user}`, visitorId);
      return await this.userBroadcast();
    }

    if (!userData.engagedWith) {
      this._io.to(this._user).emit("message:received", await messages.notEngaged(), this.serverMetadata());
      return;
    }

    await this.livechatExpire(this._user, userData.engagedWith);
    await this.userSetSession(`endedChat::self::${userData.engagedWith}`);
    this._io.to(this._user).emit("livechat:ended");
  }

  async broadcastToAgents(event, ...data) {
    // send user or agent sent messages to agents of same category for live monitoring
    // in this implementation messages are sent wheather or not the user or agent is engaged in live chat
    const allUsers = await client.hgetall(this._userRedisKey);
    const senderUser = allUsers[this._user] || {};
    Object.entries(allUsers).forEach(([userId, { role, category }]) => {
      if (role === "Agent" && ["all", category].includes(senderUser.category)) {
        this._socket.to(userId).emit(event, ...data);
      }
    });
  }

  async messageSent(message, metadata) {
    const sender = this._user;
    const source = this._source;
    const senderUser = await client.hget(this._userRedisKey, sender);
    const receipent = metadata?.receipent || senderUser?.engagedWith || "server";
    const senderName = senderUser?.name || metadata?.name || `${senderUser?.first_name || ''} ${senderUser?.last_name || ""}`
    if (!senderUser.name && senderName?.trim()) {
      this.userSetData({ name: senderName });
    }
    const senderUserData = { name: senderName.trim(), phoneNumber: senderUser?.mobileNumber || senderUser?.mobile || metadata?.phoneNumber || '', email: senderUser?.email || '' };
    metadata = { receipent, ...metadata, sender, ...senderUserData, source, time: Date.now() };

    message.type = message.type || "userMessage";
    message = sanitizeMessage(message)
    message.text = message.text || message.title || (message.attachment?.payload ? "" : message);
    message.payload = message.payload || message.text || message.attachment;

    const { text, payload, attachment } = message;
    const messageId = crypto.randomUUID();

    if (senderUser.role === 'User' && !['formMessageSection', 'bot', 'isLink', 'request_livechat'].some(value => Object.keys(message).includes(value))) {
      this._socket.to(senderUser.engagedWith).emit("message:received", await messages.newMessage(this._user, message.text, senderUser.source), this.serverMetadata(senderUser.engagedWith));
      senderUser.source?.startsWith("web") && this._io.to(this._user).emit("message:received", { id: messageId, ...message }, metadata);
    }
    // check if this is a proxy for some other socket event (with payload)
    const isSocketEvent = (typeof this.handleSocketPayload === 'function') && (await this.handleSocketPayload(payload.type?payload.type:payload));
    if (isSocketEvent) {
      return null;
    }

    // check if the message is sent by an agent
    if (senderUser.role === "Agent") {
      const allUsers = await client.hgetall(this._userRedisKey);
      const receivingUser = allUsers[receipent];
      const canSendMessage = receivingUser || (message.isOfflineMessage && message.targetSource && message.targetCategory)

      if (!canSendMessage) {
        this._io.to(sender).emit("message:received", messages.userNotFound(receipent), this.serverMetadata(sender));
        return;
      }

      postMessage(text, attachment, { ...metadata, payload }, receipent, message.type === "interAgentMessage" ? "interAgent" : "agent", sender);
      // send message to all relevant agents
      Object.entries(allUsers).forEach(([_id, data]) => {
        if (data?.role === "Agent" &&
          (message.type === 'interAgentMessage' || ["all", data?.category].includes(receivingUser?.category || message.targetCategory))) {
          this._io.to(_id).emit("message:received", { id: messageId, ...message }, metadata);
        }
      });
      if (!receivingUser) {
        return sendOfflineMessage(message, metadata, message.targetSource);
      }
      return this._socket.to(receipent).emit("message:received", { id: messageId, ...message }, metadata);
    }

    this.setRemoveDataTimeout();

    //for handling if visitor click button with link and formMessage Section
    if (message && message.hasOwnProperty('isLink')) {
      postMessage(message.text || message.payload, undefined, { ...metadata, payload }, receipent, "human", sender);
      await this.broadcastToAgents("message:received", { ...message, id: messageId }, metadata);
      return null
    }

    if (message && ['formMessageSection', 'bot'].every(value => Object.keys(message).includes(value))) {
      const postText = message.title || message.text;
      const agentMessage = { type: "botMessage", text: postText, id: messageId };
      await this.broadcastToAgents("message:received", agentMessage, this.serverMetadata(sender));
      postMessage(text, undefined, { ...this.serverMetadata(sender), payload }, sender, "bot", "bot");
      return null
    }

    if (message && ['formMessageSection', 'human'].every(value => Object.keys(message).includes(value))) {
      postMessage(text, undefined, { ...metadata, payload }, receipent, "human", sender);
      await this.broadcastToAgents("message:received", { ...message, id: messageId }, metadata);
      return null
    }


    // handle user sent message
    postMessage(text, attachment, { ...metadata, payload }, receipent, "human", sender);
    if (!excludeQuery.includes(text)) {
      await this.broadcastToAgents("message:received", { ...message, id: messageId }, metadata);
    }
    // stop propagation if sender is user and is engaged in livechat
    if (senderUser.engagedWith) {
      if (excludeQuery.includes(payload)) {
        await this.livechatEnd()
        return null
      }
      return null
    }
    // bypass rasa api for local testing
    if (source === "web" && await bypassRasa(this._socket, message.payload, sender, metadata)) {
      return null;
    }
    // fetch response from rasa api
    if(source !='web' && message.attachment?.payload){
     return await this.callRasa(message,metadata,text,sender)
    }
    await this.callRasa(payload, metadata, text, sender)
  }

  async callRasa(payload, metadata, text, sender) {
    let source = this._source;
    const rasaResponse = await RasaAPI.getIntentRequest(payload, metadata);
    if (!rasaResponse) {
      return;
    }
    const data = Array.isArray(rasaResponse) ? rasaResponse : [rasaResponse];

    const visitorData = data.find((messageData => messageData.visitorData?.name || messageData.visitorData?.mobile_number || messageData.visitorData?.email))?.visitorData;
    if (visitorData) {
      this.userSetData({ ...visitorData })
    }

    await this.sendMessagesAtInterval(data, sender)

    if (!excludeQuery.includes(text)) {
      postQuery(text, payload.payload?payload.payload:payload, source, data?.some(resData => resData.isform), data, sender);
    }
  }


}

module.exports = Handlers;

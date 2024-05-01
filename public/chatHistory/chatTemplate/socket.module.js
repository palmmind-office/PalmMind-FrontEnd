import { env } from "../../env";

export var socketModule = {
  socket: "",
  uniqueID: localStorage.getItem("userName") || "agent",
  category: localStorage.getItem("category") || "all",
  init: function (url) {
    this.socket = io.connect(url, {
      query: {
        token: env.socket_token,
      },
    });
    this.socket.on("connect", () => {
      this.socket.emit("user:join", this.uniqueID, this.category, "Agent");
    });
  },
  messageSend: function (text, payload, receipent) {
    //sen messageObj with null value
    const message = { type: "agentMessage", text, payload };
    this.socket.emit("message:sent", message, { receipent });
  },
};

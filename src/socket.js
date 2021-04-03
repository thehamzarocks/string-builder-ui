import { io } from "socket.io-client";

const url = "http://localhost:8080";
const socket = io(url);

const callbacks = {};

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect_error", (err) => {
  if (err.message === "invalid username") {
    console.error("No username!");
  }
});

socket.on("connect", () => {
  console.log("Connected");
});

socket.on("entry-update", (message) => {
  console.log(message);
  callbacks["entry-update"](message);
});

const SocketService = {
  registerCallback: (channel, callback) => {
    callbacks[channel] = callback;
  },

  connectToSocket: () => {
    console.log("Connecting to socket...");
    socket.auth = "stringer";
    socket.connect();
  },

  disconnectFromSocket: () => {
    console.log("Disconnecting from socket");
    socket.off("connect_error");
  },

  sendMessage: (channel, message) => {
    console.log("Sending message");
    socket.emit(channel, message);
  },
};

export default SocketService;

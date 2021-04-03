import { io } from "socket.io-client";

const url = "http://localhost:8080";
const socket = io(url);

const callbacks = {};

socket.on("connect", () => {});

socket.on("entry-update", (message) => {
  callbacks["entry-update"](message);
});

const SocketService = {
  registerCallback: (channel, callback) => {
    callbacks[channel] = callback;
  },

  connectToSocket: () => {
    socket.connect();
  },

  disconnectFromSocket: () => {},

  sendMessage: (channel, message) => {
    socket.emit(channel, message);
  },
};

export default SocketService;

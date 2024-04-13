import { io } from "socket.io-client";
const socketInitialize = () => {
  const socket = io("https://real-time-drawing-board-backend.onrender.com");
  // const socket = io("http://localhost:5000");
  return socket;
};

export default socketInitialize;

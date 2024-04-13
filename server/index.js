const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "https://realtime-drawing-board-psi.vercel.app",
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
    socket.on(
      "send_drawing",
      (prevPoint, point, color, linewidth, height, width) => {
        socket
          .to(room)
          .emit(
            "receive_drawing",
            prevPoint,
            point,
            color,
            linewidth,
            height,
            width
          );
      }
    );
    socket.on("send_text", (text) => {
      socket.to(room).emit("receive_text", text);
    });

    socket.on("clear_canvas", (roomid) => {
      socket.to(roomid).emit("canvas_clear", roomid);
    });
  });
});

server.listen(5000, () => console.log("Server started at port 5000"));

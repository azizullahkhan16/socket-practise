import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 8080;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware template for socket.io
io.use((socket, next) => {
  next();
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.emit("welcome", "Welcome to the chat");

  socket.broadcast.emit("newUser", `${socket.id} has joined the chat`);

  socket.on("joinRoom", ({ room, message }) => {
    console.log(message);
    socket.to(room).emit("newMessage", message);
  });

  socket.on("newRoom", ({ newRoom }) => {
    socket.join(newRoom);
    console.log(`${socket.id} has joined room ${newRoom}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

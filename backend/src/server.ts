require("dotenv").config();
import express from "express";
import cors from "cors";
import "./cron/scheduler";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_API,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: process.env.CLIENT_API,
    credentials: true,
  })
);
const port = process.env.PORT;
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const exerciseRouters = require("./routes/exerciseRoutes");
const mExerciseRoutes = require("./routes/mExerciseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const roomRoutes = require("./routes/roomRoutes");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/exercise", exerciseRouters);
app.use("/m_exercise", mExerciseRoutes);
app.use("/chat", chatRoutes);
app.use("/room", roomRoutes);

io.on("connection", (socket) => {
  console.log("A user has connected");

  socket.on("sendMessage", (data) => {
    console.log("Message has been sent: ", data.comment);
    io.emit("receiveMessage", {
      created_datetime: data.created_datetime,
      username: data.username,
      comment: data.comment,
    });
  });
});
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

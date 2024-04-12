require("dotenv").config();
import express from "express";
import cors from "cors";
import "./cron/scheduler";

const app = express();

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
const chatRoutes = require("./routes/chatRoutes");
const roomRoutes = require("./routes/roomRoutes");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/exercise", exerciseRouters);
app.use("/chat", chatRoutes);
app.use("/room", roomRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

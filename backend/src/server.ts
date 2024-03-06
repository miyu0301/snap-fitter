require("dotenv").config();
import express from "express";

const app = express();
app.use(express.json());
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

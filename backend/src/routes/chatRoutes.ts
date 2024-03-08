import express from "express";
const chatRouter = express.Router();
const chatController = require("../controllers/chatController");

chatRouter.get("/", chatController.getChats);
chatRouter.get("/:id", chatController.getChatById);
chatRouter.post("/", chatController.createChat);
chatRouter.put("/:id", chatController.updateChat);
chatRouter.delete("/:id", chatController.deleteChat);

module.exports = chatRouter;

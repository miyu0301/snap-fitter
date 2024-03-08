import express from "express";
const channelRoutes = express.Router();
const channelController = require("../controllers/channelController");

channelRoutes.get("/", channelController.getChannels);
channelRoutes.get("/:id", channelController.getChannelById);
channelRoutes.post("/", channelController.createChannel);
channelRoutes.put("/:id", channelController.updateChannel);
channelRoutes.delete("/:id", channelController.deleteChannel);

module.exports = channelRoutes;

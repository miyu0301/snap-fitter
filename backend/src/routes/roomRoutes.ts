import express from "express";
const roomRoutes = express.Router();
const roomController = require("../controllers/roomController");

roomRoutes.get("/", roomController.getRooms);
roomRoutes.get("/:id", roomController.getRoomById);
roomRoutes.get("/room_list/:user_id", roomController.getRoomByUserId);
roomRoutes.post("/", roomController.createRoom);
roomRoutes.put("/:id", roomController.updateRoom);
roomRoutes.delete("/:id", roomController.deleteRoom);

module.exports = roomRoutes;

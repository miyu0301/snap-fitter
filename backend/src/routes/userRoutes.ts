import express from "express";
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;

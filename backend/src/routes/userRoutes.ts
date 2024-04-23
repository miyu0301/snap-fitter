import express from "express";
const userRouter = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "profile_images/");
  },
  filename: function (req: any, file: any, cb: any) {
    let customFileName = crypto.randomBytes(18).toString("hex"),
      fileExtension = path.extname(file.originalname);
    cb(null, customFileName + fileExtension);
  },
});
const upload = multer({ storage: storage });

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", upload.single("image"), userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;

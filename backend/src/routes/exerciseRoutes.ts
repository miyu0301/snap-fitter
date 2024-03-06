import express from "express";
const exerciseRouter = express.Router();
const exerciseController = require("../controllers/exerciseController");

exerciseRouter.get("/:user_id", exerciseController.getExerciseRecordByUserId);
exerciseRouter.post("/", exerciseController.createExerciseRecord);
exerciseRouter.put("/:id", exerciseController.updateExerciseRecord);
exerciseRouter.delete("/:id", exerciseController.deleteExerciseRecord);

module.exports = exerciseRouter;

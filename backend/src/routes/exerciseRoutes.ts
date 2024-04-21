import express from "express";
const exerciseRouter = express.Router();
const exerciseController = require("../controllers/exerciseController");

exerciseRouter.get(
  "/all/:user_id",
  exerciseController.getExerciseRecordByUserId
);
exerciseRouter.get(
  "/all/:user_id/:start_date/:end_date",
  exerciseController.getExerciseRecordByUserIdForPeriod
);
exerciseRouter.get(
  "/burned_calories/:user_id",
  exerciseController.getBurnedCaloriesByUserId
);

exerciseRouter.get("/:id", exerciseController.getExerciseRecordById);
exerciseRouter.post("/", exerciseController.createExerciseRecord);
exerciseRouter.put("/:id", exerciseController.updateExerciseRecord);
exerciseRouter.delete("/:id", exerciseController.deleteExerciseRecord);

module.exports = exerciseRouter;

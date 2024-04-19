import express from "express";
const mExerciseRouter = express.Router();
const mExerciseController = require("../controllers/mExerciseController");

mExerciseRouter.get("/", mExerciseController.getMExercises);
mExerciseRouter.get("/:id", mExerciseController.getMExercisesById);

module.exports = mExerciseRouter;

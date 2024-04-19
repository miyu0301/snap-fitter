import { Request, Response } from "express";

const knex = require("../../db/knexConfig");

/**
 * get all master exercise data from the database
 * @param req
 * @param res
 * @returns  all master exercise
 */
const getMExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const m_exercises = await knex("m_exercise").select("*");
    res.json(m_exercises);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get a master exercise by id from the database
 * @param req
 * @param res
 * @returns selected master exercise
 */
const getMExercisesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const m_exercises = await knex("m_exercise").where("id", id).select("*");
    if (m_exercises.length > 0) {
      res.json(m_exercises[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getMExercises,
  getMExercisesById,
};

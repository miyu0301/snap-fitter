import { Request, Response } from "express";

const knex = require("../../db/knexConfig");

/**
 * get an exercise record by user id
 * @param req
 * @param res
 * @returns selected user data
 */
const getExerciseRecordByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id: number = parseInt(req.params.user_id);
    const records = await knex("exercise_records")
      .join("m_exercise", "m_exercise.id", "=", "exercise_records.exercise_id")
      .where("exercise_records.user_id", user_id)
      .select(
        "exercise_records.id as id",
        "m_exercise.name as exercise_name",
        "exercise_records.user_id as user_id",
        "exercise_records.start_datetime as start_datetime",
        "exercise_records.end_datetime as end_datetime",
        "exercise_records.pause as pause",
        "exercise_records.burned_calories as burned_calories"
      )
      .orderBy("exercise_records.start_datetime", "asc");
    const datetime_range = records.reduce(
      (
        acc: { oldest_datetime: Date; latest_datetime: Date },
        record: { start_datetime: number }
      ) => {
        const start_datetime = new Date(record.start_datetime);
        if (!acc.oldest_datetime || start_datetime < acc.oldest_datetime) {
          acc.oldest_datetime = start_datetime;
        }
        if (!acc.latest_datetime || start_datetime > acc.latest_datetime) {
          acc.latest_datetime = start_datetime;
        }
        return acc;
      },
      {
        oldest_datetime: null,
        latest_datetime: null,
      }
    );
    res.json({ records: records, datetime_range: datetime_range });
    // res.json(records);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get an exercise record by user id for periods
 * @param req
 * @param res
 * @returns selected user data
 */
const getExerciseRecordByUserIdForPeriod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id: number = parseInt(req.params.user_id);
    const start_date: Date = new Date(req.params.start_date);
    const end_date: Date = new Date(req.params.end_date);

    let records = await knex("exercise_records")
      .join("m_exercise", "m_exercise.id", "=", "exercise_records.exercise_id")
      .where("exercise_records.user_id", user_id)
      .whereBetween("exercise_records.start_datetime", [start_date, end_date])
      .select(
        "exercise_records.id as id",
        "m_exercise.name as exercise_name",
        "exercise_records.user_id as user_id",
        "exercise_records.start_datetime as start_datetime",
        "exercise_records.end_datetime as end_datetime",
        "exercise_records.pause as pause",
        "exercise_records.burned_calories as burned_calories"
      )
      .orderBy("exercise_records.start_datetime", "asc");

    res.json(records);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
/**
 * get an exercise record by user id
 * @param req
 * @param res
 * @returns selected user data
 */
const getBurnedCaloriesByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("HI");
    const user_id: number = parseInt(req.params.user_id);
    const records = await knex("exercise_records")
      .select("start_datetime")
      .where("user_id", user_id)
      .groupBy("start_datetime")
      .sum("burned_calories as total_calories")
      .orderBy("start_datetime", "asc");
    console.log(records);
    res.json(records);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get an exercise record by user id
 * @param req
 * @param res
 * @returns selected user data
 */
const getExerciseRecordById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const record = await knex("exercise_records").where("id", id).select("*");
    res.json(record[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyInsert {
  user_id: number;
  exercise_id: number;
  start_datetime?: Date;
  end_datetime?: Date;
  pause?: number;
  burned_calories?: number;
}

/**
 * insert new user data to the database
 * @param req
 * @param res
 * @returns inserted user data
 */
const createExerciseRecord = async (
  req: Request<{}, {}, RequestBodyInsert>,
  res: Response
): Promise<void> => {
  try {
    const {
      user_id,
      exercise_id,
      start_datetime,
      end_datetime,
      pause,
      burned_calories,
    } = req.body;

    const inserted = await knex("exercise_records")
      .insert({
        user_id: user_id,
        exercise_id: exercise_id,
        start_datetime: start_datetime,
        end_datetime: end_datetime,
        pause: pause,
        burned_calories: burned_calories,
      })
      .returning("*");
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyUpdate {
  exercise_id?: number;
  start_datetime?: Date;
  end_datetime?: Date;
  pause?: number;
  burned_calories?: number;
}
interface RequestParamsUpdate {
  id: string;
}

/**
 * update existed user in the database
 * @param req
 * @param res
 * @returns updated user data
 */
const updateExerciseRecord = async (
  req: Request<RequestParamsUpdate, {}, RequestBodyUpdate>,
  res: Response
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const updateData: Partial<RequestBodyUpdate> = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key as keyof RequestBodyUpdate] = value;
      }
    });
    const updated = await knex("exercise_records")
      .where("id", id)
      .update(updateData)
      .returning("*");
    res.status(201).json(updated[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * delete existed user in the database
 * @param req
 * @param res
 * @returns deleted user data
 */
const deleteExerciseRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const deleted = await knex("exercise_records")
      .where("id", id)
      .delete()
      .returning("*");
    res.status(201).json(deleted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getExerciseRecordByUserId,
  getExerciseRecordByUserIdForPeriod,
  getBurnedCaloriesByUserId,
  getExerciseRecordById,
  createExerciseRecord,
  updateExerciseRecord,
  deleteExerciseRecord,
};

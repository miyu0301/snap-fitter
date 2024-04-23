import { Request, Response } from "express";

const knex = require("../../db/knexConfig");

/**
 * get all users data from the database
 * @param req
 * @param res
 * @returns  all users data
 */
const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    let query = knex("users").select("*");
    const search = req.query.search;
    if (search) {
      query = query.where("username", "like", `%${search}%`);
    }
    const users = await query.select("*");
    res.json(users);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get an user data by id from the database
 * @param req
 * @param res
 * @returns selected user data
 */
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const users = await knex("users").where("id", id).select("*");
    if (users.length > 0) {
      res.json(users[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyInsert {
  username: string;
  email: string;
  password: string;
  goal_id?: number;
  level_id?: number;
  gender?: number;
  birthday?: Date;
  height?: number;
  weight?: number;
}

/**
 * insert new user data to the database
 * @param req
 * @param res
 * @returns inserted user data
 */
const createUser = async (
  req: Request<{}, {}, RequestBodyInsert>,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      goal_id,
      level_id,
      gender,
      birthday,
      height,
      weight,
    } = req.body;

    const inserted = await knex("users")
      .insert({
        username: username,
        email: email,
        password: password,
        goal_id: goal_id,
        level_id: level_id,
        gender: gender,
        birthday: birthday,
        height: height,
        weight: weight,
        registration_datetime: new Date().toISOString(),
      })
      .returning("*");
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyUpdate {
  username?: string;
  email?: string;
  password?: string;
  goal_id?: number;
  level_id?: number;
  gender?: number;
  birthday?: Date;
  height?: number;
  weight?: number;
  image_path?: string;
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
const updateUser = async (
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
    if (req.file) {
      updateData["image_path"] = req.file.filename;
    }
    const updated = await knex("users")
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
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const deleted = await knex("users").where("id", id).delete().returning("*");
    res.status(201).json(deleted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

import { Request, Response } from "express";

const knex = require("../../db/knexConfig");

interface RequestBodySelect {
  to_user_id?: number;
  to_channel_id?: number;
}

/**
 * get all chats data from the database
 * @param req
 * @param res
 * @returns  all chats data
 */
const getChats = async (
  req: Request<{}, {}, RequestBodySelect>,
  res: Response
): Promise<void> => {
  try {
    const { to_user_id, to_channel_id } = req.body;

    let query = knex("chats").select("*");
    if (to_user_id !== null) {
      query = query.where("to_user_id", to_user_id);
    } else if (to_channel_id !== null) {
      query = query.where("to_channel_id", to_channel_id);
    }
    const chats = await query.orderBy("created_datetime", "desc");
    res.json(chats);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get an chat data by id from the database
 * @param req
 * @param res
 * @returns selected chat data
 */
const getChatById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const chats = await knex("chats").where("id", id).select("*");
    if (chats.length > 0) {
      res.json(chats[0]);
    } else {
      res.status(404).send("chat not found");
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyInsert {
  from_user_id: number;
  to_user_id?: number;
  to_channel_id?: number;
  comment?: string;
  created_datetime: Date;
}

/**
 * insert new chat data to the database
 * @param req
 * @param res
 * @returns inserted chat data
 */
const createChat = async (
  req: Request<{}, {}, RequestBodyInsert>,
  res: Response
): Promise<void> => {
  try {
    const {
      from_user_id,
      to_user_id,
      to_channel_id,
      comment,
      created_datetime,
    } = req.body;

    const inserted = await knex("chats")
      .insert({
        from_user_id: from_user_id,
        to_user_id: to_user_id,
        to_channel_id: to_channel_id,
        comment: comment,
        created_datetime: created_datetime,
      })
      .returning("*");
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyUpdate {
  comment: string;
}
interface RequestParamsUpdate {
  id: string;
}

/**
 * update existed chat in the database
 * @param req
 * @param res
 * @returns updated chat data
 */
const updateChat = async (
  req: Request<RequestParamsUpdate, {}, RequestBodyUpdate>,
  res: Response
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const { comment } = req.body;
    const updated = await knex("chats")
      .where("id", id)
      .update("comment", comment)
      .returning("*");
    res.status(201).json(updated[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * delete existed chat in the database
 * @param req
 * @param res
 * @returns deleted chat data
 */
const deleteChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const deleted = await knex("chats").where("id", id).delete().returning("*");
    res.status(201).json(deleted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
};

import { Request, Response } from "express";

const knex = require("../../db/knexConfig");

/**
 * get all rooms data from the database
 * @param req
 * @param res
 * @returns  all rooms data
 */
const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await knex("rooms").select("*");
    res.json(rooms);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get an room data by id from the database
 * @param req
 * @param res
 * @returns selected room data
 */
const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const result = await getRoomWithMembers(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("room not found");
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get an room list by user id from the database
 * @param req
 * @param res
 * @returns selected room data
 */
const getRoomByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id: number = parseInt(req.params.user_id);
    const rooms = await knex("rooms")
      .leftJoin(
        "room_user_mappings",
        "rooms.id",
        "=",
        "room_user_mappings.room_id"
      )
      .where("room_user_mappings.user_id", user_id)
      .leftJoin("users", "room_user_mappings.user_id", "=", "users.id")
      .groupBy("rooms.id", "rooms.room_name")
      .select("rooms.id as id", "rooms.room_name as room_name");
    res.json(rooms);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyInsert {
  room_name: string;
  create_user_id: number;
  members: number[];
}

/**
 * insert new room data to the database
 * @param req
 * @param res
 * @returns inserted room data
 */
const createRoom = async (
  req: Request<{}, {}, RequestBodyInsert>,
  res: Response
): Promise<void> => {
  try {
    const { room_name, create_user_id, members } = req.body;
    const insertedId = await knex.transaction(async (trx: any) => {
      const insertedRooms = await trx("rooms")
        .insert({
          room_name: room_name,
          create_user_id: create_user_id,
          created_datetime: new Date().toISOString(),
        })
        .returning("*");

      for (const member of members) {
        await trx("room_user_mappings").insert({
          room_id: insertedRooms[0].id,
          user_id: member,
        });
      }
      return insertedRooms[0].id;
    });

    const result = await getRoomWithMembers(insertedId);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyUpdate {
  room_name?: string;
  members?: number[];
}
interface RequestParamsUpdate {
  id: string;
}

/**
 * update existed channel in the database
 * @param req
 * @param res
 * @returns updated channel data
 */
const updateRoom = async (
  req: Request<RequestParamsUpdate, {}, RequestBodyUpdate>,
  res: Response
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const { room_name, members } = req.body;

    if (room_name !== null && room_name !== undefined) {
      await knex("rooms")
        .where("id", id)
        .update("room_name", room_name)
        .returning("*");
    }
    if (members !== null && members !== undefined) {
      await knex("room_user_mappings").where("room_id", id).delete();
      for (const member of members) {
        await knex("room_user_mappings").insert({
          room_id: id,
          user_id: member,
        });
      }
    }
    const result = await getRoomWithMembers(id);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * delete existed room in the database
 * @param req
 * @param res
 * @returns deleted room data
 */
const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const deleted = await knex("rooms").where("id", id).delete().returning("*");
    res.status(201).json(deleted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface Room {
  id: number;
  room_name: string;
  create_user_id: number;
  created_datetime: Date;
  members: [];
  member_ids: number[];
}

const getRoomWithMembers = async (id: number): Promise<Room | null> => {
  const rooms = await knex("rooms")
    .leftJoin(
      "room_user_mappings",
      "rooms.id",
      "=",
      "room_user_mappings.room_id"
    )
    .leftJoin("users", "room_user_mappings.user_id", "=", "users.id")
    .where("rooms.id", id)
    .select(
      "rooms.id as id",
      "rooms.room_name as room_name",
      "rooms.create_user_id as create_user_id",
      "rooms.created_datetime as created_datetime",
      "users.id as user_id",
      "users.level_id as level_id",
      "users.goal_id as goal_id",
      "users.username as username",
      "users.image_path as image_path"
    );

  if (rooms.length > 0) {
    let member_ids: number[] = [];
    rooms.map((room: { user_id: number }) => member_ids.push(room.user_id));

    let result: Room = {
      id: rooms[0].id,
      room_name: rooms[0].room_name,
      create_user_id: rooms[0].create_user_id,
      created_datetime: rooms[0].created_datetime,
      members: rooms.map(
        (room: {
          user_id: number;
          username: string;
          level_id: number;
          goal_id: number;
          image_path: string;
        }) => ({
          id: room.user_id,
          username: room.username,
          level_id: room.level_id,
          goal_id: room.goal_id,
          image_path: room.image_path,
        })
      ),
      member_ids: member_ids,
    };
    return result;
  } else {
    return null;
  }
};

module.exports = {
  getRooms,
  getRoomById,
  getRoomByUserId,
  createRoom,
  updateRoom,
  deleteRoom,
};

import { Request, Response } from "express";

const knex = require("../../db/knexConfig");

/**
 * get all channels data from the database
 * @param req
 * @param res
 * @returns  all channels data
 */
const getChannels = async (req: Request, res: Response): Promise<void> => {
  try {
    const channels = await knex("channels").select("*");
    res.json(channels);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * get an channel data by id from the database
 * @param req
 * @param res
 * @returns selected channel data
 */
const getChannelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const result = await getChannelWithMembers(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("channel not found");
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyInsert {
  channel_name: string;
  create_user_id: number;
  members: number[];
}

/**
 * insert new channel data to the database
 * @param req
 * @param res
 * @returns inserted channel data
 */
const createChannel = async (
  req: Request<{}, {}, RequestBodyInsert>,
  res: Response
): Promise<void> => {
  try {
    const { channel_name, create_user_id, members } = req.body;
    const insertedId = await knex.transaction(async (trx: any) => {
      const insertedChannels = await trx("channels")
        .insert({
          channel_name: channel_name,
          create_user_id: create_user_id,
          created_datetime: new Date().toISOString(),
        })
        .returning("*");

      for (const member of members) {
        await trx("channel_user_mappings").insert({
          channel_id: insertedChannels[0].id,
          user_id: member,
        });
      }
      return insertedChannels[0].id;
    });

    const result = await getChannelWithMembers(insertedId);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyUpdate {
  channel_name?: string;
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
const updateChannel = async (
  req: Request<RequestParamsUpdate, {}, RequestBodyUpdate>,
  res: Response
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const { channel_name, members } = req.body;

    if (channel_name !== null && channel_name !== undefined) {
      await knex("channels")
        .where("id", id)
        .update("channel_name", channel_name)
        .returning("*");
    }
    if (members !== null && members !== undefined) {
      await knex("channel_user_mappings").where("channel_id", id).delete();
      for (const member of members) {
        await knex("channel_user_mappings").insert({
          channel_id: id,
          user_id: member,
        });
      }
    }
    const result = await getChannelWithMembers(id);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

/**
 * delete existed channel in the database
 * @param req
 * @param res
 * @returns deleted channel data
 */
const deleteChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);
    const deleted = await knex("channels")
      .where("id", id)
      .delete()
      .returning("*");
    res.status(201).json(deleted[0]);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface Channel {
  id: number;
  channel_name: string;
  create_user_id: number;
  created_datetime: Date;
  members: [];
}

const getChannelWithMembers = async (id: number): Promise<Channel | null> => {
  const channels = await knex("channels")
    .join(
      "channel_user_mappings",
      "channels.id",
      "=",
      "channel_user_mappings.channel_id"
    )
    .join("users", "channel_user_mappings.user_id", "=", "users.id")
    .where("channels.id", id)
    .select(
      "channels.id as id",
      "channels.channel_name as channel_name",
      "channels.create_user_id as create_user_id",
      "channels.created_datetime as created_datetime",
      "users.id as user_id",
      "users.username as username"
    );

  if (channels.length > 0) {
    let result: Channel = {
      id: channels[0].id,
      channel_name: channels[0].channel_name,
      create_user_id: channels[0].create_user_id,
      created_datetime: channels[0].created_datetime,
      members: channels.map(
        (channel: { user_id: number; username: string }) => ({
          user_id: channel.user_id,
          username: channel.username,
        })
      ),
    };
    return result;
  } else {
    return null;
  }
};

module.exports = {
  getChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel,
};

import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const knex = require("../../db/knexConfig");

interface RequestBodyLogin {
  username: string;
  password: string;
}

/**
 * login to the app
 * @param req
 * @param res
 * @returns is_loginned: if this user can login or not
 * @returns user_exists: if this user exists or not
 * @returns user_id: logined user id
 * @returns username: logined username
 */
const login = async (
  req: Request<{}, {}, RequestBodyLogin>,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const users = await knex("users").where({ username: username }).select("*");

    if (users.length > 0) {
      bcrypt.compare(
        password,
        users[0].password,
        function (err: any, result: boolean) {
          if (result) {
            res.status(201).json({
              is_loginned: true,
              user_exists: true,
              user_id: users[0].id,
              username: username,
            });
          } else {
            res.status(201).json({
              is_loginned: false,
              user_exists: true,
              user_id: null,
              username: null,
            });
          }
        }
      );
    } else {
      res.status(201).json({
        is_loginned: false,
        user_exists: false,
        user_id: null,
        username: null,
      });
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

interface RequestBodyRegister {
  username: string;
  email: string;
  password: string;
}

/**
 * register user data to the app
 * @param req
 * @param res
 * @returns is_new_user: if this user is new or not
 * @returns user_id: logined user id
 * @returns username: logined username
 */
const register = async (
  req: Request<{}, {}, RequestBodyRegister>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const result = await knex("users").where("username", username).count();
    const count: number = parseInt(result[0].count);

    if (count > 0) {
      res.status(201).json({
        is_new_user: false,
        user_id: null,
        username: null,
      });
    } else {
      bcrypt.hash(
        password,
        Number(process.env.BCRYPT_SALTROUNDS),
        async function (err: any, hashedPassword: string) {
          const inserted = await knex("users")
            .insert({
              username: username,
              email: email,
              password: hashedPassword,
              registration_datetime: new Date().toISOString(),
            })
            .returning("*");
          res.status(201).json({
            isNewUser: true,
            user_id: inserted[0].id,
            username: inserted[0].username,
          });
        }
      );
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  login,
  register,
};

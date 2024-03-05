// const pool = require('../models/userModel');

// const getUsers = async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM users');
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// const getUserById = async (req, res) => {
//   try {
//       const { id } = req.params;
//       const result = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
//       if (result.rows.length > 0) {
//           res.json(result.rows[0]);
//       } else {
//           res.status(404).send('User not found');
//       }
//   } catch (err) {
//       res.status(500).send(err.message);
//   }
// };

// const createUser = async (req, res) => {
//     try {
//         const { name } = req.body;
//         const response = await pool.query(`INSERT INTO users (name) VALUES ('${name}') RETURNING *`);
        
//         const data = response.rows;
//         res.send(data);
//         // res.status(201).send('User created');
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name } = req.body;
//         await pool.query(`UPDATE users SET name = '${name}' WHERE id = ${id}`);
//         res.send('User updated');
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await pool.query(`DELETE FROM users WHERE id = ${id}`);
//         res.send('User deleted');
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// module.exports = {
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser
// }
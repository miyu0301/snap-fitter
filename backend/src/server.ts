import express from 'express';

const app = express();
const port = 3000;

const pool = require('./models/connectDatabase');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/all', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM users');
      console.log(result);
      res.json(result.rows);
  } catch (err) {
      // res.status(500).send(err.message);
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

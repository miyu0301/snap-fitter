import express from 'express';

const app = express();
const port = 3000;
const userRoutes = require('./routes/userRoutes');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

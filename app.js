const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const router = require('./routes/index');

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() => {
    console.log('BD is working');
  })
  .catch(() => {
    console.log('BD is not working');
  });

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b56f47d085893b755e4354',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log('Сервер успешно запущен');
});

const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/errorHandler');
const { errors } = require('celebrate');

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
app.use(cookieParser());
app.use(express.json());

app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log('Сервер успешно запущен');
});

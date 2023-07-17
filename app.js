const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

const app = express();

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log('Сервер успешно запущен');
});

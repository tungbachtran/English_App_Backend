const express = require('express');
require("dotenv").config();
var path = require('path');

const database = require('./config/database');
const route = require("./routes/index.route");
const app = express();
const port = process.env.PORT ;
app.use(express.static(`${__dirname}/public`));
database.connect();




route(app);
app.listen(port, () => {
  console.log('Example app listening on port ');
});

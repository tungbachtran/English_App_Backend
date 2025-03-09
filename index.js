const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config();
var path = require('path');
const cors = require('cors');
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST","PUT","DELETE"],
};
app.options("",cors(corsConfig));
app.use(cors(corsConfig));
app.use(bodyParser.json());
const database = require('./config/database');
const route = require("./routes/index.route");

const port = process.env.PORT ;
app.use(express.static(`${__dirname}/public`));
database.connect();




route(app);
app.listen(port, () => {
  console.log('Example app listening on port ');
});

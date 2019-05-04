const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const config = require("./config/env");

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(morgan("dev"));

mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    app.listen(() => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch(err => console.log(err));

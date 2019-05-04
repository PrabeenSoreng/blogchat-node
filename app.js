const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/blogchat-socialapp", {
    useNewUrlParser: true
  })
  .then(() => {
    app.listen(() => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch(err => console.log(err));

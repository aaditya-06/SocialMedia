const mongoose = require("mongoose");
const postData = require("./data.js");
const posts = require("../models/posts.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/LinkNest";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connect to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await posts.deleteMany({});
  await posts.insertMany(postData.data);
  console.log("data intialized");
};

initDB();

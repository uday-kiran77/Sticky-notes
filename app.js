const express = require("express");
const path = require("path");
const http = require("http");
// const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var cookieSession = require("cookie-session");

require("dotenv").config();
require("./src/db/mongoose");

//routes
const UserRouter = require("./src/routes/User");
const appRouter = require("./src/routes/notes");

//db model

app = express();

app.use(UserRouter);
app.use(appRouter);

app.set("view engine", "ejs");
// app.set("trust proxy", 1);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["this is a secret key"],
    maxAge: 3660000,
  })
);
// app.post("/login", (req, res) => {
//   console.log(req.body.username);
// });

app.listen(3000, () => {
  console.log("server is up");
});

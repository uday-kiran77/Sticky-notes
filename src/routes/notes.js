const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

//db model
const User = require("../dbModels/user");

//middleware
const { auth, isLoggedIn } = require("../middleware/userAuth");

router = new express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", auth, (req, res) => {
  const message = req.session.message ? req.session.message : null;
  req.session.message = null;
  res.render("notes", { message });
});

router.get("/notes", auth, async (req, res) => {
  const token = req.session.token;
  const notes = await User.findOne({ _id: token });
  res.send(notes.notes);
});

router.post("/notes", auth, async (req, res) => {
  const token = req.session.token;
  let doc = await User.findOneAndUpdate({ _id: token }, { notes: req.body });
});

module.exports = router;

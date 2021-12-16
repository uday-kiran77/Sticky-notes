const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

var cookieSession = require("cookie-session");

//db model
const User = require("../dbModels/user");
//middleware
const { isLoggedIn } = require("../middleware/userAuth");

router = new express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(
  cookieSession({
    name: "session",
    keys: ["this is a secret key"],
    maxAge: 3660000,
  })
);

router.get("/login", isLoggedIn, (req, res) => {
  res.render("login", { error: null, username: null });
});

router.get("/register", isLoggedIn, (req, res) => {
  res.render("register", { error: null, username: null });
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.render("login", {
      error: "Invalid username/password",
      username,
    });
  }

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.render("login", {
      error: "User doesn't exist",
      username,
    });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.render("login", {
      error: "Invalid username/password",
      username,
    });
  }

  req.session.token = user._id;
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const username = req.body.username.trim().toLowerCase();
  const password = req.body.password.trim();

  if (!username || !password) {
    return res.render("register", {
      error: "please fill out all the fields",
      username,
    });
  }

  const usernameExists = false;
  if (usernameExists) {
    return res.render("register", {
      error: "username exists",
      username,
    });
  }

  const passwordValidation = password.length >= 6 ? false : true;
  if (passwordValidation) {
    return res.render("register", {
      error: "Please choose a strong password",
      username,
    });
  }

  //hash password
  const salt = await bcrypt.genSalt(8);
  hashedPassword = await bcrypt.hash(password, salt);

  // create user
  try {
    const response = await User.create({
      username,
      password: hashedPassword,
    });
    req.session.token = response._id;
    req.session.message = "Registered Successfully...";
    res.redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      return res.render("register", {
        error: "username exists",
        username,
      });
    }
    throw error;
  }
});

//logout user
router.get("/logout", (req, res) => {
  req.session.token = null;
  res.redirect("/login");
});

module.exports = router;

const mongoose = require("mongoose");
const User = require("../dbModels/user");

const isLoggedIn = (req, res, next) => {
  if (req.session.token != null) {
    return res.redirect("/");
  }
  next();
};

const auth = async (req, res, next) => {
  if (req.session.token == null) {
    return res.redirect("/login");
  }
  next();
};

module.exports = {
  isLoggedIn,
  auth,
};

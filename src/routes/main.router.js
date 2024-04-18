const express = require("express");
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middlewares/auth");
const mainRouter = express.Router();

mainRouter.get("/", (req, res, next) => {
  res.redirect('/products')
});

mainRouter.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("auth/login");
});

mainRouter.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("atuh/signup");
});

module.exports = mainRouter;

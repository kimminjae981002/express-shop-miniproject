const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const cookieSession = require("cookie-session");
require("dotenv").config();

const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/user.router");
const adminCategoriesRouter = require('./routes/admin-categories.router')
const adminProductsRouter = require('./routes/admin.products.router')
const cartRouter = require('./routes/cart.router')
const productsRouter = require('./routes/products.router')


const app = express();

app.use(
  cookieSession({
    name: "cookie-session",
    keys: [process.env.cookieEncryptionKey],
  })
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(process.env.mongo_db)
  .then(() => {
    console.log("mognodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", mainRouter);
app.use("/auth", usersRouter);
app.use('/admin/categories', adminCategoriesRouter)
app.use('/admin/products', adminProductsRouter)
app.use('/products', productsRouter)
app.use('/cart', cartRouter)

app.listen("3000", (req, res) => {
  console.log("listening 3000");
});

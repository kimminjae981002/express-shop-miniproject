const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const cookieSession = require("cookie-session");
const flash = require('connect-flash');
const methodOverride = require('method-override')
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

// connect-flash 미들웨어
app.use(flash());

// passport 미들웨어
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// ejs 폴더 안에서 변수로 사용 가능 
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user;
  next()
})

app.use(methodOverride('_method'));

// req.body 사용 가능 미들웨어
app.use(express.json());
// 정적 폴더 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// ejs 미들웨어
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

// 서버 종료 시키지 않기 위해 에러 체크
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || '에러 발생')
})

app.listen("3000", (req, res) => {
  console.log("listening 3000");
});

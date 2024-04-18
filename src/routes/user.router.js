const express = require("express");
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middlewares/auth");
const passport = require("passport");

const usersRouter = express.Router();

// /login미들웨어 안에 authenticate 미들웨어가 또 있다.
// 그래서 authenticate 미들웨어로 가기 위해서는
// 66번째줄에 즉시 함수 실행을 해주면 된다.
usersRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // passport.js에서 done
    if (err) {
      return next(err);
    }

    if (!user) {
      console.log(err);
      return res.json({ msg: info });
    }

    // passport에서 제공하는 함수 logIn
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/products");
    });
  })(req, res, next);
});

usersRouter.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

const User = require("../models/user.model");
const sendMail = require("../mail/mail");

usersRouter.post("/signup", async (req, res) => {
  // user 객체 생성
  const user = new User(req.body);

  // db에 user 저장
  try {
    await user.save();
    // 이메일 보내기
    // await sendMail(user.email, "welcome");
    res.redirect('/login');
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
});

usersRouter.get("/auth/google", passport.authenticate("google"));
usersRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/products",
    failureRedirect: "/login",
  })
);

usersRouter.get("/auth/kakao", passport.authenticate("kakao"));
usersRouter.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", {
    successReturnToOrRedirect: "/products",
    failureRedirect: "/login",
  })
);

module.exports = usersRouter;

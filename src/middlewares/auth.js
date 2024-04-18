// passport에서 제공하는 인증 미들웨어
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/products");
  }

  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
};

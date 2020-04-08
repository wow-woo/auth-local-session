module.exports = function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("http://localhost:3000/");
  }
  next();
};

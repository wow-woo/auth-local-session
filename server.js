const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./database/models/UserSchema");
const session = require("express-session");
const flash = require("express-flash");
require("dotenv").config({ path: "config/config.env" });
const connectDB = require("./database/connectDB");
const passport = require("passport");
const initPassport = require("./utils/initPassport");
const noAuth = require("./utils/noAuth");
const haveAuth = require("./utils/haveAuth");

connectDB();
initPassport(passport);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "korea",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post("/api/register", async (req, res) => {
  console.log("req", req.body.email);
  try {
    const isMatched = await User.findOne({ email: req.body.email });
    console.log("isMatched", isMatched);
    if (isMatched) return res.redirect("http://localhost:3000/login");

    const user = await User.create(req.body);
    res.redirect("http://localhost:3000/login");
  } catch (err) {
    console.log(err.message);
  }
});

app.post(
  "/api/login",
  passport.authenticate("local", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/login",
    failureFlash: true,
  })
);

app.get("/api/logout", async (req, res) => {
  try {
    req.logOut();

    return res.redirect("http://localhost:3000");
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const isLogged = req.isAuthenticated();
    if (isLogged) {
      const { _id, email, displayname } = req.user;

      return res.json({
        success: true,
        user: { _id, email, displayname },
        isLogged,
      });
    }

    return res.json({ success: false });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => console.log("server on 5000 port"));

const Local_Strategy = require("passport-local").Strategy;
const User = require("../database/models/UserSchema");

const initPassport = (passport) => {
  passport.serializeUser(async (user, done) => {
    try {
      console.log("serializeUser", "user", user._id);

      return done(null, user._id);
    } catch (err) {
      console.log(err.message);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      console.log("deserializeUser! ");
      const user = await User.findById(id);
      console.log("deserialize", "id", id, "user", user);
      return done(null, user);
    } catch (err) {
      console.log(err.message);
    }
  });

  passport.use(
    new Local_Strategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user)
            return done(null, false, { message: "wrong email address" });

          const isValid = await user.comparePW(password);
          if (!isValid) return done(null, false, { message: "wrong password" });

          return done(null, user);
        } catch (err) {
          console.log(err.message);
          return done(err);
        }
      }
    )
  );
};

module.exports = initPassport;

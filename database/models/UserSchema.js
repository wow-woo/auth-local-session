const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
  },
  displayname: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
});

UserSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);

    this.password = hashed;
  } catch (err) {
    console.log(err.message);
  }
});

UserSchema.method("comparePW", async function (pw) {
  try {
    const isMatched = await bcrypt.compare(pw, this.password);

    return isMatched;
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = mongoose.model("User", UserSchema);

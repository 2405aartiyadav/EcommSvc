const mongoose = require("mongoose");
const UserAuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: String,
  isSecurityQuestionSet:Boolean,
  securityQuestion1: String,
  securityAns1: String,
  securityQuestion2: String,
  securityAns2: String
});

const UserAuth = mongoose.model("UserAuth", UserAuthSchema);
module.exports = UserAuth;

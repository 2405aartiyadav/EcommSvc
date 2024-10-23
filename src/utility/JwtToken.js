const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "itssecret";

const generateToken = (user) => {
  return jsonwebtoken.sign(
    {
      id: user._id,
      email: user.email,
    },
    SECRET_KEY,
    {
      algorithm: "HS256",
      expiresIn: "10m",
    }
  );
};

const verifyToken = (token) => {
  return jsonwebtoken.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const tokenGenerator = (obj) => {
  const token = jwt.sign(obj, JWT_SECRET, { expiresIn: "3h" });
  return token;
};

module.exports = {
  tokenGenerator,
};

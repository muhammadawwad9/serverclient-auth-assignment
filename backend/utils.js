const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
//models imports
const User = require("./models/user");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const tokenGenerator = (obj) => {
  const token = jwt.sign(obj, JWT_SECRET, { expiresIn: "3h" });
  return token;
};

/*This function is to check if the token is real (real user) or not, for example when the user closes the browser and reopen it I want to check the stored token :) */
const checkTokenValidity = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
      if (err) reject({ valid: false });
      const { id } = payload;
      try {
        const foundUser = await User.findOne({ _id: id });
        if (foundUser) {
          foundUser.password = undefined;
          resolve({ valid: true, data: foundUser });
        }
        reject({ valid: false });
      } catch (err) {
        reject({ valid: false });
      }
    });
  });
};

module.exports = {
  tokenGenerator,
  checkTokenValidity,
};

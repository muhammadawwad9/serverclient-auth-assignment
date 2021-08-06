const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const requireLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  //now we want to verify that this is the same token that we gave to the user
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) return res.status(401).json({ error: "you must be logged in" });
    const { id } = payload;
    try {
      const foundUser = await User.findById({ _id: id }).select("-password");
      req.userId = foundUser._id;
      next();
    } catch (err) {
      res.status(503).json({ err });
    }
  });
};

module.exports = requireLogin;

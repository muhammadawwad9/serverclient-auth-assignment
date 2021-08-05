const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

//functions imports from utils
const { tokenGenerator, checkTokenValidity } = require("../utils");

router.post("/register", async (req, res) => {
  try {
    let { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    /*now I want to check if the user exists, ethier the email or username, I searched for how can I put two conditions in find(), so my life will be easier :)*/

    const userExists = await User.find({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (userExists.length > 0)
      return res.status(403).json({ err: "User Already Exists" });
    const user = new User({ ...req.body, password: hashedPassword });
    const savedUser = await user.save();
    //I won't send the password to the client side with the data
    savedUser.password = undefined;
    /*I will use the id of the saved user in the DB in order to put it inside the token and also inside the req object so I will have it for future requests  (as long as the user logged in) :)*/
    const id = savedUser._id;
    const token = tokenGenerator({ id });
    return res.json({
      msg: `Welcome ${savedUser.firstName}`,
      token,
      data: savedUser,
    });
  } catch (err) {
    console.log("ERROR: ", err);
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username.trim() || !password)
      return res.status(400).json({ err: "missing fields" });
    const foundUsername = await User.findOne({ username });
    if (!foundUsername)
      return res.status(401).json({ err: "Wrong Username or Password" }); //I say that something wrong(without specifications) for more security :)
    const correct = await bcrypt.compare(password, foundUsername.password);
    if (!correct)
      return res.status(401).json({ err: "Wrong Username or Password" });
    const id = foundUsername._id;
    foundUsername.password = undefined;
    const token = tokenGenerator({ id });
    return res.json({
      msg: `Welcome ${foundUsername.firstName}`,
      token,
      data: foundUsername,
    });
  } catch (err) {
    console.log("ERROR: ", err);
  }
});

router.post("/check-token", async (req, res) => {
  try {
    const { tokenToCheck } = req.body;
    const response = await checkTokenValidity(tokenToCheck);
    const { valid, data } = response;
    console.log("VALID: ", valid);
    console.log("data: ", data);

    if (valid) return res.json({ valid, data });
    return res.status(401).json({ valid });
  } catch (err) {
    console.log("ERRPR: ", err);
  }
});

module.exports = router;

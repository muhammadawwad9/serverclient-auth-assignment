const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const User = require("../models/user");
dotenv.config();

//middlewares imports
const requireLogin = require("../middleware/requireLogin");

router.put("/update-profile", requireLogin, async (req, res) => {
  try {
    /*I will get all the info from the client side, because before user makes an update, the current info will be auto filled in the inputs (the info before updating)*/
    const uname = req.body.username.toLowerCase();
    const uEmail = req.body.email;
    let isTaken = await User.find({
      $or: [{ username: uname }, { email: uEmail }],
    });
    let filteredUsers = isTaken.filter((user) => user._id != req.userId);
    if (filteredUsers.length > 1)
      return res.status(422).json({ err: "User Already Exist" });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { ...req.body, username: uname },
      {
        new: true,
      }
    );
    updatedUser.password = undefined;
    return res.json({ msg: " Info Updated Successfully", updatedUser });
  } catch (err) {
    res.status(503).json({ err });
  }
});

module.exports = router;

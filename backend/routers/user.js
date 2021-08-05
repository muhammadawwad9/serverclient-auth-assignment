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
    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });
    updatedUser.password = undefined;
    return res.json({ msg: " Info Updated Successfully", updatedUser });
  } catch (err) {
    console.log("ERROR: ", err);
  }
});

module.exports = router;

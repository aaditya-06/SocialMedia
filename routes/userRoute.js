const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const User = require("../models/user");

router.get(
  "/account",
  wrapAsync(async (req, res) => {
    // const user = await User.findById(req.user._id)
    //   .populate("posts")
    //   .populate("followers")
    //   .populate("following");

    // if (!user) throw new ExpressError("User not found", 404);

    res.render("posts/account");
    // , { user, isCurrentUser: true }
  })
);

module.exports = router;

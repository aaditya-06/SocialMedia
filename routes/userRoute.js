const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");

const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, fullName, email, password } = req.body;
      const newUser = new User({ username, fullName, email });

      const registeredUser = await User.register(newUser, password);

      // Auto login after successful signup
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Obsidian!");
        res.redirect("/");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  saveRedirectUrl,
  async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/";
    delete req.session.redirectUrl;
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/");
  });
});

module.exports = router;

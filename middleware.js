const Post = require("./models/posts");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let post = await Post.findById(id);

  if (!post.owner.equals(req.user._id)) {
    req.flash("error", "You are not allowed to edit or delete this post.");
    return res.redirect("/");
  }

  next();
};


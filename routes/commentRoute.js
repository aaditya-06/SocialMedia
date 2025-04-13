const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { commentSchema } = require("../schema");
const ExpressError = require("../utils/expressError");
const Post = require("../models/posts");
const Comment = require("../models/comment");
const { isLoggedIn } = require("../middleware");

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

//comment to post
router.post(
  "/:id/comments",
  isLoggedIn,
  validateComment,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      req.flash("error", "Post not found.");
      return res.redirect("/");
    }


    const comment = new Comment(req.body.comments);
    comment.author = req.user._id;

    post.comments.push(comment);

    await comment.save();
    await post.save();

    req.flash("success", "Comment added!");
    res.redirect("/");
  })
);

module.exports = router;

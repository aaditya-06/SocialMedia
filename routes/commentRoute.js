const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { commentSchema } = require("../schema");
const ExpressError = require("../utils/expressError");
const Post = require("../models/posts");
const Comment = require("../models/comment");

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
  validateComment,
  wrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comments);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect("/");
  })
);

module.exports = router;

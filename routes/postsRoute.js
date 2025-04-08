const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { postSchema } = require("../schema");
const ExpressError = require("../utils/expressError");
const Post = require("../models/posts");
const moment = require("moment");

const validatePosts = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(404, msg);
  }
  next();
};

//show all posts
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allPosts = await Post.find({}).populate("comments").sort({ _id: -1 });
    res.render("posts/index", { allPosts, moment });
  })
);

//new post
router.get("/new", (req, res) => {
  res.render("posts/new");
});

//create post
router.post(
  "/",
  validatePosts,
  wrapAsync(async (req, res) => {
    const post = new Post(req.body.posts);
    await post.save();
    res.redirect("/");
  })
);

//edit post
router.get(
  "/:id/editPost",
  wrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("comments");
    if (!post) throw new ExpressError(400, "page Not Found");
    res.render("posts/editPost", { post, moment });
  })
);


//upadate post
router.put(
  "/:id",
  validatePosts,
  wrapAsync(async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, { ...req.body.posts });
    res.redirect("/");
  })
);

//delete post
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  })
);

module.exports = router;

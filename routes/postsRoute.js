const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { postSchema } = require("../schema");
const ExpressError = require("../utils/expressError");
const Post = require("../models/posts");
const moment = require("moment");
const multer = require("multer");

const { storage } = require("../cloudinary/cloudinary");
const { isLoggedIn, isOwner } = require("../middleware");

const methodOverride = require("method-override");
router.use(methodOverride("_method"));

// Use Cloudinary storage for multer now
const upload = multer({ storage });

const validatePosts = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// Show all posts
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allPosts = await Post.find({})
      .populate({
        path: "comments",
        populate: { path: "author" },
      })
      .populate("owner")
      .sort({ _id: -1 });

    res.render("posts/index", { allPosts, moment });
  })
);

// New post form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("posts/new");
});

// Create post (with cloud image upload!)
// Accept either image or reel
router.post(
  "/",
  isLoggedIn,
  upload.single("posts[media]"),
  validatePosts,
  wrapAsync(async (req, res) => {
    try {
      const post = new Post(req.body.posts);
      post.owner = req.user._id;

      // Handle media upload
      if (req.file) {
        if (req.file.mimetype.startsWith("image/")) {
          post.image = {
            url: req.file.path,
            filename: req.file.filename,
          };
        } else if (req.file.mimetype.startsWith("video/")) {
          post.reel = {
            url: req.file.path,
            filename: req.file.filename,
          };
        }
      }

      await post.save();
      req.flash("success", "Post created successfully!");
      res.redirect("/");
    } catch (error) {
      console.error("Error uploading media: ", error);
      req.flash(
        "error",
        "There was an issue uploading the media. Please try again."
      );
      res.redirect("/posts/new");
    }
  })
);

// Edit post form
router.get(
  "/:id/editPost",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("comments");
    if (!post) throw new ExpressError(400, "Page not found");
    res.render("posts/editPost", { post, moment });
  })
);

// Update post
router.put(
  "/:id",
  validatePosts,
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, { ...req.body.posts });
    req.flash("success", "Post updated!");
    res.redirect("/");
  })
);

// Delete post
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash("success", "Post deleted!");
    res.redirect("/");
  })
);

// Like / Unlike a post
router.post(
  "/:id/like",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    const likedIndex = post.likes.indexOf(req.user._id);
    if (likedIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();
    res.redirect("/");
  })
);

module.exports = router;

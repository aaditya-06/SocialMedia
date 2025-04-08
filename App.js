const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const moment = require("moment");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");

const { postSchema, commentSchema } = require("./schema.js");

const Post = require("./models/posts.js");
const Comment = require("./models/comment.js");
const User = require("./models/user.js");

const app = express();
const port = 8080;

// Set up ejs-mate as the view engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/LinkNest";
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

const validatePosts = (req, res, next) => {
  let { error } = postSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

const validateComment = (req, res, next) => {
  let { error } = commentSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// Home - Show all posts
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const allPosts = await Post.find({}).populate("comments").sort({ _id: -1 });
    res.render("posts/index", { allPosts, moment });
  })
);

app.get(
  "/account",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate("posts")
      .populate("followers")
      .populate("following");

    if (!user) throw new ExpressError("User not found", 404);

    res.render("posts/account", { user, isCurrentUser: true });
  })
);

// New Post Form Route
app.get("/new", async (req, res) => {
  res.render("posts/new");
});

// Create Post Route
app.post(
  "/",
  validatePosts,
  wrapAsync(async (req, res) => {
    const postData = req.body.posts;
    const newPost = new Post(postData);
    await newPost.save();
    res.redirect("/");
  })
);

// Edit Post Form
app.get(
  "/:id/editPost",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("comments");
    if (!post) throw new ExpressError("Post not found", 404);
    res.render("posts/editPost", { post, moment });
  })
);

// Update Post Route
app.put(
  "/:id",
  validatePosts,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndUpdate(id, { ...req.body.posts });
    res.redirect("/");
  })
);

// Delete Post Route
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect("/");
});

//Comments routes
app.post(
  "/:id/comments",
  validateComment,
  wrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const newComment = new Comment(req.body.comments);

    post.comments.push(newComment);
    await newComment.save();
    await post.save();

    res.redirect("/");
  })
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/expressError");

const postsRoutes = require("./routes/postsRoute");
const commentsRoutes = require("./routes/commentRoute");
const usersRoutes = require("./routes/userRoute");

const app = express();
const port = 8080;

// DB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/LinkNest")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

// View Engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Routes
app.use("/", postsRoutes);
app.use("/", commentsRoutes);
app.use("/", usersRoutes);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

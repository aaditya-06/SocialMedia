const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const ExpressError = require("./utils/expressError");
const User = require("./models/user");

const postsRoutes = require("./routes/postsRoute");
const commentsRoutes = require("./routes/commentRoute");
const usersRoutes = require("./routes/userRoute");

const app = express();
const port = 8080;

const dbUrl = process.env.DB;

// DB Connection
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

// View Engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const cookieParser = require("cookie-parser");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(cookieParser());

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),//1week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use("/", postsRoutes);
app.use("/", commentsRoutes);
app.use("/", usersRoutes);
app.use("/upload", express.static("upload"));

app.get("/setcookie", (req, res) => {
  res.cookie("SocialMediaUser", "LoggedInUser", {
    maxAge: 3600000, //1hour
    httpOnly: true,
  });
  res.send("Cookie has been set!");
});

app.get("/getcookie", (req, res) => {
  const userCookie = req.cookies.SocialMediaUser;
  res.send(`Cookie Value: ${userCookie}`);
});

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

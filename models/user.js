const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  bio: String,
  profileImage: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

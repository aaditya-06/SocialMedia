const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: { url: String, filename: String },
    reel: {
      url: String,
      filename: String
    },
    caption: {
      type: String,
      required: true,
    },
    location: String,
    date: {
      type: Date,
      default: Date.now,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

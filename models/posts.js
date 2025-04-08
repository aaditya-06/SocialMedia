const mongoose = require("mongoose");
const comments = require("./comment");
const { ref } = require("joi");

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default:
        "https://4kwallpapers.com/images/wallpapers/tamanna-bhatia-2024-3840x2160-15277.jpg",
      set: (v) =>
        !v.trim()
          ? "https://4kwallpapers.com/images/wallpapers/tamanna-bhatia-2024-3840x2160-15277.jpg"
          : v,
    },
    caption: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Somwhere under the sky",
    },
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

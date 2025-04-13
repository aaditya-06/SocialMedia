const Joi = require("joi");

module.exports.postSchema = Joi.object({
  posts: Joi.object({
    caption: Joi.string().required(),
    location: Joi.string().optional(),
    image: Joi.string().optional(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comments: Joi.object({
    comment: Joi.string().required(),
  }).required(),
});

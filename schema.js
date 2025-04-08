const Joi = require("joi");
module.exports.postSchema = Joi.object({
  posts: Joi.object({
    caption: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comments: Joi.object({
    comment: Joi.string().required(),
  }).required(),
});

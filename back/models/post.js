const mongoose = require('mongoose');

  const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: false, default: "noimage" },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    usersLiked: { type: Array, required: false, default: [] },
    usersDisliked: { type: Array, required: false, default: [] },
  });
  
  module.exports = mongoose.model('post', postSchema);
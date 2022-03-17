const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({ 
    author: { type: String, required: true},
    text: { type: String, required: true },
    post: { type: String, required: true}
  });
  
  module.exports = mongoose.model('comment', commentSchema);
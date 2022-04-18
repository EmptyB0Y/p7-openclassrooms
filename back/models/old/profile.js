const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userId: { type: String, required: true},
    firstname: { type: String, required: true},
    lastname: { type: String, required: false },
    description: { type: String, required: false},
    pictureUrl: { type: String, required: false, default: 'http://127.0.0.1:3000/images/default/nopic.webp'},
    access: { type: String, required: true}
  });
  
  module.exports = mongoose.model('profile', profileSchema);
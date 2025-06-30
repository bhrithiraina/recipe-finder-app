const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [Object] // or use a sub-schema for recipes
});

module.exports = mongoose.model('User', userSchema);

var mongoose = require('mongoose');

module.exports = mongoose.model(
  'User', {
    displayName: String,
    googleID: String,
    googleRefreshToken: String
  }
);
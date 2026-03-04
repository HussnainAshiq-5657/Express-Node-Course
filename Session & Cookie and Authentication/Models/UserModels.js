const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userpassword: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model('person', UserSchema);
module.exports = UserModel;

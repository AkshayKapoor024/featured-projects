const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function () {
      return !this.googleId; // Required only for local strategy
    },
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true, // Always required — useful for both strategies
    unique: true,
    lowercase: true,
    trim: true
  },
  googleId: {
    type: String,
    required: function () {
      return !this.username; // Required only for Google users
    },
    unique: true,
    sparse: true // allows this field to be empty without throwing duplicate error
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bio:String,
  fullname:String,
  github:String,
  instagram:String,
  linkedin:String,
  location:String,
  mobile:String,
  occupation:String,
  organization:String,
  profilepic:{
    type:String,
    default:'https://wallpaperaccess.com/full/959317.jpg'
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameUnique: false // 🔑 prevents duplicate username index
});

const User = mongoose.model('user',userSchema)
module.exports=User

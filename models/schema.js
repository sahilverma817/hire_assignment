const { Double } = require('bson');
const { Decimal128 } = require('mongoose');
const mongoose = require('mongoose');

// Define the schema for the User collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  totalLikes: {
    type: Number,
    default: 3
  },
  numPosts: {
    type: Number,
    default: 0
  }
});

// Define the schema for the Post collection
const postSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    default: mongoose.Types.ObjectId
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: String,
    required: true
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  numLikes: {
    type: Number,
    default: 0
  }
});

// Create the User model from the userSchema
const User = mongoose.model('User', userSchema);

// Create the Post model from the postSchema
const Post = mongoose.model('Post', postSchema);

// Export the User and Post models for use in other parts of the application
module.exports = {
  User,
  Post
};

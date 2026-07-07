const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'employer'],
      default: 'candidate',
    },
    phone: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    company: {
      type: String,
    },
    location: {
      type: String,
    },
    skills: [String],
    experience: {
      type: Number,
    },
    resume: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

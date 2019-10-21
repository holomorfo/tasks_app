const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// hash the plain text pasxsword before savins
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be positive');
      }
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid');
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (value.length < 7)
        throw new Error('Password must be at least 7 characters long');
      if (value.includes('password')) throw new Error('Not a valid password');
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// Virtual property
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  console.log('User object');
  delete userObject.password;
  delete userObject.tokens;
  console.log(userObject);
  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to login');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login');
  return user;
};

// hash the plain text pasxsword before savins
userSchema.pre('save', async function(next) {
  const user = this;
  console.log('User');
  console.log(user);
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;

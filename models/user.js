// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const gravatar = require("gravatar");

// const userSchema = new mongoose.Schema({
// 	email: {
// 		type: String,
// 		required: [true, "Email is required"],
// 		unique: true,
// 		match: [/.+@.+\..+/, "Please enter a valid email address"],
// 	},
// 	password: {
// 		type: String,
// 		required: [true, "Password is required"],
// 		minlength: [6, "Password must be at least 6 characters long"],
// 	},
// 	subscription: {
// 		type: String,
// 		enum: ["starter", "pro", "business"],
// 		default: "starter",
// 	},
// 	token: {
// 		type: String,
// 		default: null,
// 	},
// 	avatarURL: {
// 		type: String,
// 		default: function () {
// 			return gravatar.url(this.email, { s: "250", d: "retro" }, true);
// 		},
// 	},
// });

// userSchema.methods.setPassword = async function (password) {
// 	this.password = await bcrypt.hash(password, 10);
// };

// userSchema.methods.validatePassword = async function (password) {
// 	return await bcrypt.compare(password, this.password);
// };

// const User = mongoose.model("User", userSchema);

// module.exports = User;



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250', d: 'retro' }, true);
    },
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
});

userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

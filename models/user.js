const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	subscription: {
		type: String,
		enum: ["starter", "pro", "business"],
		default: "starter",
	},
	token: {
		type: String,
		default: null,
	},
});

userSchema.methods.setPassword = async function (password) {
	this.password = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema);
module.exports = User;

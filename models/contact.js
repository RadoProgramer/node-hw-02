const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Set name for contact"],
	},
	email: {
		type: String,
		required: [true, "Set email for contact"],
		unique: true,
		match: [/.+@.+\..+/, "Please enter a valid email address"],
	},
	phone: {
		type: String,
		required: [true, "Set phone for contact"],
		unique: true,
		match: [/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"],
	},
	favorite: {
		type: Boolean,
		default: false,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;

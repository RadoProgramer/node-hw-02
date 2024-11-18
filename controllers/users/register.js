const User = require("../../models/user");
const Joi = require("joi");

const registrationSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

const register = async (req, res, next) => {
	const { error } = registrationSchema.validate(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	const { email, password } = req.body;
	const existingUser = await User.findOne({ email });
	if (existingUser) return res.status(409).json({ message: "Email in use" });

	const newUser = new User({ email });
	await newUser.setPassword(password);
	await newUser.save();

	res.status(201).json({
		user: { email: newUser.email, subscription: newUser.subscription },
	});
};

module.exports = register;

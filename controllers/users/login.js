const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Joi = require("joi");

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const login = async (req, res, next) => {
	const { error } = loginSchema.validate(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user || !(await user.validatePassword(password))) {
		return res.status(401).json({ message: "Email or password is wrong" });
	}

	const payload = { id: user._id };
	const accessToken = jwt.sign(payload, process.env.SECRET, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "30d",
	});
	user.token = accessToken;
	await user.save();

	res.json({
		accessToken,
		refreshToken,
		user: { email: user.email, subscription: user.subscription },
	});
};

module.exports = login;

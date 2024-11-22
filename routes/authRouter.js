const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "This email is already registered" });
		}

		const user = new User({ email });
		await user.setPassword(password);
		await user.save();

		res.status(201).json({
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post("/login", async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user || !(await user.validatePassword(password))) {
			return res.status(401).json({ message: "Email or password is wrong" });
		}

		const payload = { id: user._id };
		const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "30m" });
		const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: "30d",
		});

		user.token = token;
		await user.save();

		res.json({
			token,
			refreshToken,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post("/refresh-token", (req, res) => {
	const refreshToken = req.headers.authorization?.split(" ")[1];

	if (!refreshToken) {
		return res.status(401).json({ message: "Refresh token is required" });
	}

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err) {
				return res.status(403).json({ message: "Invalid refresh token" });
			}

			const user = await User.findById(decoded.id);
			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			const payload = { id: user._id };
			const newAccessToken = jwt.sign(payload, process.env.SECRET, {
				expiresIn: "1h",
			});
			const newRefreshToken = jwt.sign(
				payload,
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: "30d" }
			);

			res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
		}
	);
});

router.get("/logout", authMiddleware, async (req, res, next) => {
	try {
		req.user.token = null;
		await req.user.save();
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		next(error);
	}
});

router.get("/current", authMiddleware, (req, res) => {
	const { email, subscription } = req.user;
	res.json({ email, subscription });
});

module.exports = router;

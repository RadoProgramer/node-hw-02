const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");
const uploadAvatar = require("../middleware/avatarUpload");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

router.get("/verify/:verificationToken", async (req, res, next) => {
	const { verificationToken } = req.params;

	try {
		const user = await User.findOne({ verificationToken });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.verify = true;
		user.verificationToken = null;
		await user.save();

		res.status(200).json({ message: "Verification successful" });
	} catch (error) {
		next(error);
	}
});

router.post("/verify", async (req, res, next) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: "missing required field email" });
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.verify) {
			return res
				.status(400)
				.json({ message: "Verification has already been passed" });
		}

		const verificationLink = `${process.env.BASE_URL}/auth/verify/${user.verificationToken}`;
		const emailContent = {
			to: email,
			from: process.env.EMAIL_FROM,
			subject: "Email Verification",
			html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
		};

		await sgMail.send(emailContent);

		res.status(200).json({ message: "Verification email sent" });
	} catch (error) {
		next(error);
	}
});

router.post("/signup", async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "This email is already registered" });
		}

		const verificationToken = uuidv4();
		const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

		const user = new User({ email, password, avatarURL, verificationToken });
		user.password = await bcrypt.hash(password, 10);
		await user.save();

		const verificationLink = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;
		const emailContent = {
			to: email,
			from: process.env.EMAIL_FROM,
			subject: "Email Verification",
			html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
		};

		await sgMail.send(emailContent);

		res.status(201).json({
			user: {
				email: user.email,
				subscription: user.subscription,
				avatarURL: user.avatarURL,
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

		if (!user.verify) {
			return res.status(401).json({
				message: "Email not verified. Please check your email.",
			});
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

router.post("/refresh-token", async (req, res) => {
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

			if (!user.verify) {
				return res.status(401).json({ message: "Email not verified" });
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
	const { email, subscription, avatarURL, verify } = req.user;

	if (!verify) {
		return res.status(401).json({ message: "Email not verified" });
	}

	res.json({ email, subscription, avatarURL });
});
router.patch("/subscription", authMiddleware, async (req, res, next) => {
	const { subscription } = req.body;
	const allowedSubscriptions = ["starter", "pro", "business"];

	if (!allowedSubscriptions.includes(subscription)) {
		return res.status(400).json({
			message: `Invalid subscription. Allowed values are: ${allowedSubscriptions.join(
				", "
			)}`,
		});
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.user._id,
			{ subscription },
			{ new: true }
		);

		res.json({
			message: "Subscription updated successfully",
			user: {
				email: updatedUser.email,
				subscription: updatedUser.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.patch(
	"/avatars",
	authMiddleware,
	uploadAvatar,
	async (req, res, next) => {
		try {
			const { file } = req;

			if (!file) {
				console.log("No file received");
				return res.status(400).json({ message: "File upload failed" });
			}

			console.log("File path received for processing:", file.path);

			const avatar = await Jimp.read(file.path);
			console.log("Image loaded successfully");

			await avatar.resize(250, 250).writeAsync(file.path);
			console.log("Image resized successfully");

			const avatarsDir = path.join(process.cwd(), "public/avatars");
			const uniqueName = `${req.user._id}-${Date.now()}-${file.originalname}`;
			const finalPath = path.join(avatarsDir, uniqueName);

			await fs.rename(file.path, finalPath);
			console.log("File moved to:", finalPath);

			req.user.avatarURL = `/avatars/${uniqueName}`;
			await req.user.save();

			res.status(200).json({ avatarURL: req.user.avatarURL });
		} catch (error) {
			console.error("Error during avatar upload:", error);
			next(error);
		}
	}
);

module.exports = router;

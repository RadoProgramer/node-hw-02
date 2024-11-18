const express = require("express");
const jwt = require("jsonwebtoken");
const register = require("../../controllers/users/register");
const login = require("../../controllers/users/login");
const logout = require("../../controllers/users/logout");
const current = require("../../controllers/users/current");
const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/refresh-token", async (req, res) => {
	const refreshToken = req.headers.authorization?.split(" ")[1];

	if (!refreshToken) {
		return res.status(401).json({ message: "Refresh token is required" });
	}

	try {
		const decodedToken = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
		const payload = { id: decodedToken.id };
		const accessToken = jwt.sign(payload, process.env.SECRET, {
			expiresIn: "15m",
		});
		const newRefreshToken = jwt.sign(
			payload,
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "30d" }
		);
		res.json({ accessToken, refreshToken: newRefreshToken });
	} catch (error) {
		res.status(403).json({ message: "Invalid refresh token" });
	}
});

module.exports = router;

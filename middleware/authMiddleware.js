const passport = require("passport");

const authMiddleware = (req, res, next) => {
	console.log("AuthMiddleware triggered");
	passport.authenticate("jwt", { session: false }, async (err, user, info) => {
		if (err || !user) {
			console.log("Authorization failed");
			return res.status(401).json({ message: "Not authorized" });
		}

		const token = req.headers.authorization?.split(" ")[1];

		if (user.token !== token) {
			console.log("Invalid token");
			return res.status(401).json({ message: "Token is invalid or expired" });
		}

		req.user = user;
		console.log("Authorization succeeded");
		next();
	})(req, res, next);
};

module.exports = authMiddleware;

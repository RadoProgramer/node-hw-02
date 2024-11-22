const passport = require("passport");

const authMiddleware = (req, res, next) => {
	passport.authenticate("jwt", { session: false }, async (err, user, info) => {
		if (err || !user) {
			return res.status(401).json({ message: "Not authorized" });
		}

		const token = req.headers.authorization?.split(" ")[1];

		if (user.token !== token) {
			return res.status(401).json({ message: "Token is invalid or expired" });
		}

		req.user = user;
		next();
	})(req, res, next);
};

module.exports = authMiddleware;

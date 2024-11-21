const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user");
require("dotenv").config();

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET,
};

passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			const user = await User.findById(payload.id);
			if (!user) {
				return done(null, false);
			}
			return done(null, user);
		} catch (error) {
			done(error, false);
		}
	})
);

module.exports = passport;

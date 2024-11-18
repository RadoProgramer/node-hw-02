const passport = require("passport");
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const User = require("../models/user");

const setJWTStrategy = () => {
	const secret = process.env.SECRET;
	const params = {
		secretOrKey: secret,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	};
	passport.use(
		new JWTStrategy(params, async (payload, done) => {
			try {
				const user = await User.findById(payload.id);
				if (!user) {
					return done(new Error("Unauthorized"), false);
				}
				return done(null, user);
			} catch (e) {
				return done(e);
			}
		})
	);
};

module.exports = setJWTStrategy;

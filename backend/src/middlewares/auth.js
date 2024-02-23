import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../models/User.js';
import 'dotenv/config';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.user.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        console.error(error);
        return done(error, false);
    }
}));

export default opts;



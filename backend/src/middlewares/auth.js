import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../models/User.js';
import 'dotenv/config';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, function (jwt_payload, done){
    console.log('AUTH MIDDLEWARE ->', jwt_payload);
    // try {
    //     const user =  User.findById(jwt_payload.user.id);
    //     if (user) {
    //         return done(null, user);
    //     }
    //     return done(null, false);
    // } catch (error) {
    //     console.error(error);
    //     return done(error, false);
    // }

    User.findOne({ id: jwt_payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    } );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}));

//export default passport;



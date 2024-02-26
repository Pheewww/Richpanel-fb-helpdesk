// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import passport from 'passport';
// import User from '../models/User.js';
// import 'dotenv/config';

// const opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET
// };

// passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
//     console.log('// JWT PAYLOAD', jwt_payload);

//     try {
//         const user = await User.findById(jwt_payload.user.id);
//         console.log('// USER FOUND', user);

//         if (user) {
//             return done(null, user);
//         }
//         return done(null, false);
//     } catch (error) {
//         console.error(error);
//         return done(error, false);
//     }
// }));

// //Persists user data inside session
// passport.serializeUser(function (user, done) {
//     console.log('IN SERIALIZE JWT BLOACK', user.id);

//     done(null, user.id);
// });

// //Fetches session details using session id
// passport.deserializeUser(function (id, done) {
//     console.log('IN DESERIALIZE JWT BLOACK', id);

//     UserModel.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

// export default {passport, opts};



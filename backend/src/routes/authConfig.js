// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import User from '../models/User.js';
// import passport from 'passport';
// import 'dotenv/config';



// const confiPassport = (passport) => {
//     let opts = {};
//     opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//     opts.secretOrKey = process.env.JWT_SECRET;

// console.log('// JWT PAYLOAD start');

// passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
//     console.log('// JWT PAYLOAD', jwt_payload);

//     try {
//         const user = await User.findById(jwt_payload.user.email);
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
// };
// export default confiPassport;


import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import 'dotenv/config';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    console.log('TOKEN', token);

  

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send("Invalid Token");
                console.log(err);
            }
            req.user = decoded; 
            console.log('INSIDE jwt verify', req.user);

            next(); 
        });
    };



export default verifyToken;


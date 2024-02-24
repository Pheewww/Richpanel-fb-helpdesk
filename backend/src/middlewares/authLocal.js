import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";


const customFields = {
    usernameField: "username",
}

const verifyCallback = (username,  done) => {
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "Incorrect username." });
        }
        // const isValid = validPassword(password, user.hash, user.salt) //it's a function that check password
        // if (!isValid) {
        //     return done(null, false, { message: "Incorrect password." });
        // }
        // return done(null, user);
    });
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy)


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
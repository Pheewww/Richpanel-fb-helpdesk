import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import fetch from 'node-fetch';
import User from '../models/User.js';

const configurePassport = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'emails'],
    }, async (accessToken, _refreshToken, profile, done) => {
        try {
            // profileFields: ['id', 'displayName', 'photos', 'email']
            console.log('going for new user search');
            

            const emailId = profile.emails[0].value;
            let user = await User.findOne({ email: emailId });
            if (user) {
                // new user in db without Access Tokens initially
                user = await User.create({
                    facebookId: profile.id,
                    displayName: profile.displayName,

                });
                console.log('new user created');


            }

            const emailId = profile.emails[0].value;
            let user1 = await User.findOne({ email: emailId });
            if (user1) {
                // new user in db without Access Tokens initially
                user = await User.findOneAndUpdate({
                    facebookId: profile.id,
                    displayName: profile.displayName,

                });
                console.log('USER NOT FOUND ->new user created');


            }




            console.log('Fetch access tokens');

            const pagesData = await fetch(`https://graph.facebook.com/${profile.id}/accounts?access_token=${accessToken}`)
                .then(res => res.json())
                .catch(err => { throw new Error(err) });

            console.log('Update New User ACCESS TOKENS ');


            if (pagesData.data) {
                user.pageAccessTokens = pagesData.data.map(page => ({
                    pageId: page.id,
                    accessToken: page.access_token,
                    name: page.name,
                }));
                user.pageId = pagesData.data[0].id;
            } else {
                console.log('data from graph api is not received');
            }


            //Get Long_lived Tokens



            //Get Long_lived Tokens


            await user.save();


            console.log('user', user);
            console.log('profile', profile);


            done(null, user);
            console.log('Done user/profile');

        } catch (error) {
            done(error, null);
        }
    }));

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

};


export default configurePassport;
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import fetch from 'node-fetch';
import User from '../models/User.js'; 

const configurePassport = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: 'process.env.FACEBOOK_CLIENT_ID',
        clientSecret: 'process.env.CLIENT_SECRET',
        callbackURL: 'process.env.FACEBOOK_CALLBACK_URL',
        profileFields: ['id', 'displayName', 'emails'], 
    }, async (accessToken, _refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ facebookId: profile.id });
            if (!user) {
                // new user in db without Access Tokens initially
                user = await User.create({
                    facebookId: profile.id,
                    displayName: profile.displayName,
                });
            }

            // Fetch access tokens
            const pagesData = await fetch(`https://graph.facebook.com/${profile.id}/accounts?access_token=${accessToken}`)
                .then(res => res.json())
                .catch(err => { throw new Error(err) });

            // Update 
            user.pageAccessTokens = pagesData.data.map(page => ({
                pageId: page.id,
                accessToken: page.access_token,
                name: page.name,
            }));

            //Get Long_lived Tokens



            //Get Long_lived Tokens


            await user.save();

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));
};


export default configurePassport;
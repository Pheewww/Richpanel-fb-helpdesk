import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import fetch from 'node-fetch';
import User from '../models/User.js'; 

const configurePassport = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: '367835492688307',
        clientSecret: 'f2363a2100baf97f6036e2317ded0174',
        callbackURL: 'http://localhost:5000/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails'], // 'pages' is not directly available in profileFields
    }, async (accessToken, _refreshToken, profile, done) => {
        try {
            // Find the user in the database based on their Facebook ID
            let user = await User.findOne({ facebookId: profile.id });
            if (!user) {
                // If the user doesn't exist, create a new one without Page Access Tokens initially
                user = await User.create({
                    facebookId: profile.id,
                    displayName: profile.displayName,
                });
            }

            // Fetch the pages and their access tokens
            const pagesData = await fetch(`https://graph.facebook.com/${profile.id}/accounts?access_token=${accessToken}`)
                .then(res => res.json())
                .catch(err => { throw new Error(err) });

            // Update the user document with the page access token
            user.pageAccessTokens = pagesData.data.map(page => ({
                pageId: page.id,
                accessToken: page.access_token,
                name: page.name,
            }));
            await user.save();

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));
};


export default configurePassport;
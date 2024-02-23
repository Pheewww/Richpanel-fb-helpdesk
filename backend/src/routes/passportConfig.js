import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import fetch from 'node-fetch';
import User from '../models/User.js'; 

const configurePassport = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id','displayName','emails'], 
    }, async (accessToken, _refreshToken, profile, done) => {
        try {

            console.log('going for new user search');
            let user = await User.findOne({ facebookId: profile.id });
            if (!user) {
                // new user in db without Access Tokens initially
                user = await User.create({
                    facebookId: profile.id,
                    displayName: profile.displayName,

                });
                console.log('new user created');

            }


            console.log('Fetch access tokens');
            
            const pagesData = await fetch(`https://graph.facebook.com/${profile.id}/accounts?access_token=${accessToken}`)
                .then(res => res.json())
                .catch(err => { throw new Error(err) });

            console.log('Update ');
            if (pagesData.data) {
                user.pageAccessTokens = pagesData.data.map(page => ({
                    pageId: page.id,
                    accessToken: page.access_token,
                    name: page.name,
                }));
            } else {
                console.log('data from graph api is not received');
            }


            //Get Long_lived Tokens



            //Get Long_lived Tokens


            await user.save();

            console.log('user', user);
            console.log('profile', profile);

            
            done(null, profile);
            console.log('Done user/profile');

        } catch (error) {
            done(error, null);
        }
    }));
};


export default configurePassport;
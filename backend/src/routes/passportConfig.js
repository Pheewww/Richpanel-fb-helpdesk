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
            // let user = await User.findOne({ facebookId: profile.id });
            // if (!user) {
            //     // new user in db without Access Tokens initially
            //     user = await User.create({
            //         facebookId: profile.id,
            //         displayName: profile.displayName,

            //     });
            //     console.log('new user created');

            // }

            const emailId = profile.emails[0].value;
            let user = await User.findOne({ email: emailId });
            if (!user) {
                // new user in db without Access Tokens initially
                console.log('USER NOT FOUND');
                return res.status(404).send("USER EMAIL NOT FOUND");


            } else {
                user = await User.findOneAndUpdate({
                    facebookId: profile.id,
                    displayName: profile.displayName,

                });
                console.log('new user created');
            }

            


            console.log('Fetch access tokens');
            
            const pagesData = await fetch(`https://graph.facebook.com/${profile.id}/accounts?access_token=${accessToken}`)
                .then(res => res.json())
                .catch(err => { throw new Error(err) });

            console.log('Update New User ACCESS TOKENS ');

            // if (pagesData.data && pagesData.data.length > 0) {
            //     const firstPage = pagesData.data[0]; // Assuming you want to store the first page's data
            //     user.pageId = firstPage.id;
            //     user.accessToken = firstPage.access_token;
            //     user.name = firstPage.name;
            // } else {
            //     console.log('Data from Graph API is not received');
            // }
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


            // user.pageAccessTokens.forEach(async (page) => {
            //     const postData = {
            //         pageId: page.pageId,
            //         accessToken: page.accessToken,
            //         pageName: page.name,
            //         facebookId: profile.id,
            //         displayName: profile.displayName,
            //     };

            //     try {
            //         const response = await fetch('https://www.example.com/user/facebook-page', {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
                           
            //             },
            //             body: JSON.stringify(postData),
            //         });

            //         const responseData = await response.json();
            //         console.log('POST to /user/facebook-page succeeded:', responseData);
            //     } catch (error) {
            //         console.error('Error posting to /user/facebook-page:', error);
            //     }
            // });

            

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
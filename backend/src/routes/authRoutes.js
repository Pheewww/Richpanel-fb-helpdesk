import express from 'express';
import passport from 'passport';
import registerFacebookWebhook from './registerFacebookWebhook.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'manage_pages', 'pages_messaging'] })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const user = await User.findOne({ facebookId: req.user.facebookId });
            //email: req.user.email
            if (!user) {
                console.log('User not found after Facebook auth.');
               // return res.redirect('/login');
            }

            console.log(`User ${user.facebookId} authenticated with Facebook.`);

            for (const page of user.pageAccessTokens) {
                console.log(`Registering webhook for page ID: ${page.pageId}`);
                await registerFacebookWebhook(page.pageId, page.accessToken);
            }

            console.log('All webhooks registered successfully.');
           
                // Successful authentication, redirect to success screen.
                res.redirect('/auth/facebook/success');
            // res.redirect(process.env.POST_LOGIN_REDIRECT_URL); // Note: Corrected to use process.env
        } catch (error) {
            console.error('Error during webhook registration:', error);
            res.redirect('/error');
        }
    }
);


router.get('/success', async (req, res) => {

    const user1 = req.user;
    console.log('// going for page search, also user ->', user1);

    // const userId = req.user._id;
    try {
    //     const user = await User.findById(userId);
    //     console.log('// user ', user);
    //     //console.log('user email', user.email);


    //     if (!user || !user.pageAccessTokens.length) {
    //         return res.status(404).send("No Facebook page connected.");
    //     }


    //     console.log('// Page found ');

    //     // Send back the name of the first connected page
    //     res.json({ pageName: user.pageAccessTokens[0].name });
    const userInfo = {
     id: req.session.passport.user.id,
        displayName: req.session.passport.user.displayName,
        pageName: req.session.user.pageAccessTokens[0].name,
    }
    console.log('user info', userInfo);
        res.json({ pageName: req.session.user.pageAccessTokens[0].name });
        //res.render('pages', { user: userInfo });


    } catch (error) {
        console.error('Error fetching Facebook page:', error);
        res.status(500).send('An error occurred while fetching the Facebook page');
    }
});




export default router;

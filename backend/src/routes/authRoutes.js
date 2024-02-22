import express from 'express';
import passport from 'passport';
import registerFacebookWebhook from './registerFacebookWebhook.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email','manage_pages','pages_messaging'] })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const user = await User.findOne({ facebookId: req.user.facebookId });
            if (!user) {
                console.log('User not found after Facebook auth.');
                return res.redirect('/login');
            }

            console.log(`User ${user.facebookId} authenticated with Facebook.`);

            for (const page of user.pageAccessTokens) {
                console.log(`Registering webhook for page ID: ${page.pageId}`);
                await registerFacebookWebhook(page.pageId, page.accessToken);
            }

            console.log('All webhooks registered successfully.');
            res.redirect(process.env.POST_LOGIN_REDIRECT_URL); // Note: Corrected to use process.env
        } catch (error) {
            console.error('Error during webhook registration:', error);
            res.redirect('/error');
        }
    }
);

export default router;

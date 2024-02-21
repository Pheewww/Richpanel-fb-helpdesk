// Convert require to ES6 imports
import express from 'express';
import passport from 'passport';
import registerFacebookWebhook from './registerFacebookWebhook.js';
import User from '../models/User.js';


const router = express.Router();


router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'manage_pages', 'pages_messaging'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const user = await User.findOne({ facebookId: req.user.facebookId });

            for (const page of user.pageAccessTokens) {
                await registerFacebookWebhook(page.pageId, page.accessToken);
            }

            res.redirect('http://localhost:3000/settings?connected=true');
        } catch (error) {
            console.error('Error during webhook registration:', error);
            res.redirect('/error'); 
        }
    }
);

 export default router  

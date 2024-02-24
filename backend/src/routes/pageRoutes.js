import express from 'express';
import User from '../models/User.js';
import passport from 'passport';
import { Strategy as jwt } from 'passport-jwt';
import opts from '../middlewares/auth.js'



const pageRoutes = express.Router();
pageRoutes.use(passport.initialize());

pageRoutes.get('/user/facebook-page', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const  user1 = req.user;
    console.log('// going for page search, also user ->', user1);

    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        console.log('// user ', user);

        if (!user || !user.pageAccessTokens.length) {
            return res.status(404).send("No Facebook page connected.");
        }

        console.log('// Page found ');

        // Send back the name of the first connected page
        res.json({ pageName: user.pageAccessTokens[0].name });
    } catch (error) {
        console.error('Error fetching Facebook page:', error);
        res.status(500).send('An error occurred while fetching the Facebook page');
    }
});


pageRoutes.post('/api/user/facebook-page/disconnect', async (req, res) => {
    console.log('// going for page disconect');
    const userId = req.user._id;
    const { pageId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        console.log(' // Filter out the disconnected page ');

        user.pageAccessTokens = user.pageAccessTokens.filter(page => page.pageId !== pageId);

        await user.save();

        res.json({ message: 'Facebook page disconnected successfully' });
    } catch (error) {
        console.error('Error disconnecting Facebook page:', error);
        res.status(500).json({ message: 'An error occurred while disconnecting the Facebook page' });
    }
});


export default pageRoutes;
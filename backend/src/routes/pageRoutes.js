import express from 'express';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import passport from 'passport';
import axios from 'axios';
import { Strategy as jwt } from 'passport-jwt';
import opts from '../middlewares/auth.js'




const pageRoutes = express.Router();
pageRoutes.use(passport.initialize());

pageRoutes.get('/user/facebook-page', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const user1 = req.user;
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


pageRoutes.get('/user/conversations/:conversationId', async (req, res) => {



    // const user1 = req.user;
    // console.log('// going for MESSAGE PICKUPS, also user ->', user1);

    const { conversationId } = req.params;
    console.log('// Convo ID-->', conversationId);


    const conversation = await Conversation.findOne({ _id: conversationId });

    console.log('// Convo ', conversation);
    if (!conversation) {
        console.log('// Convo not dound');
        return res.status(404).json({ message: "Conversation not found or you're not a participant." });


    }

    //const sortedMessages = conversation.messages.sort((a, b) => a.timestamp - b.timestamp);
    console.log('// Convo Messages', conversation);
    res.json(conversation);
});

pageRoutes.get('/user/customer/:PSID/:PAGE/profile', async (req, res) => {
    const { PSID, PAGE } = req.params;
    console.log('IN PROFILE BLOCK');


    try {
        const result = await User.findOne({ pageId: PAGE });
        console.log('USER FOUND IN PROFILE BLOCK', result);
        const PAGE_ACCESS = result.pageAccessTokens[0].accessToken;
        const profileResponse = await axios.get(`https://graph.facebook.com/${PSID}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS}`);
        console.log('PROFILE FETCHED', profileResponse);
        const profileData = profileResponse.data;

        // Respond with the fetched profile data
        res.json({
            success: true,
            profile: {
                firstName: profileData.first_name,
                lastName: profileData.last_name,
                profilePic: profileData.profile_pic,
                email: profileData.email || 'email_not_given@fb.com',
                status: 'Active',
            },
        });
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer profile',
        });
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
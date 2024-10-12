import express from 'express';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import passport from 'passport';
import axios from 'axios';
//import { Strategy as jwt } from 'passport-jwt';
//import confiPassport from './authConfig.js';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import verifyToken  from './authConfig.js';
//import jwt from 'jsonwebtoken';



const pageRoutes = express.Router();
pageRoutes.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
pageRoutes.use(bodyParser.urlencoded({ extended: false }));
pageRoutes.use(express.json())
//pageRoutes.use(passport.initialize());

pageRoutes.use(session({
    secret: 'process.env.EXPRESS_SESSION_SECRET',
    resave: true,
    saveUninitialized: true
}));


pageRoutes.use(cookieParser());
//confiPassport(passport);
//pageRoutes.use(passport.session());

pageRoutes.get('/user/facebook-page', verifyToken, async (req, res) => {
    console.log('// GOING FOR FB SEARCH');

    console.log('// in get fb page bloack - req.user->', req.user);


    const userId = req.user.id; 
    console.log('// User ID-->', userId);
    try {
        const user1 = req.user;
        console.log('UserID:', user1);
        console.log('Working on collecting message for frontend');
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        console.log('// User found, Now looking for pageId ');

        const pageId = user.pageAccessTokens[0]?.pageId;
        if (!pageId) {
            return res.status(404).json({ message: "No Facebook page connected for user." });
        }
        console.log('// pageId found above , convo now', pageId);

        res.json({ pageName: user.pageAccessTokens[0].name });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'An error occurred while fetching conversations' });
    }
});


pageRoutes.get('/user/conversations/:conversationId', async (req, res) => {




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



// pageRoutes.post('/api/user/facebook-page/disconnect', async (req, res) => {
//     console.log('// going for page disconect');
//     const userId = req.user._id;
//     const { pageId } = req.body;

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }
//         console.log(' // Filter out the disconnected page ');

//         user.pageAccessTokens = user.pageAccessTokens.filter(page => page.pageId !== pageId);

//         await user.save();

//         res.json({ message: 'Facebook page disconnected successfully' });
//     } catch (error) {
//         console.error('Error disconnecting Facebook page:', error);
//         res.status(500).json({ message: 'An error occurred while disconnecting the Facebook page' });
//     }
// });


export default pageRoutes;
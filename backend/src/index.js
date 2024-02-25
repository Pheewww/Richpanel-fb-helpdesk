import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import configurePassport from './routes/passportConfig.js';
import webhookRoutes from './routes/webhookRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import registerFacebookWebhook from './routes/registerFacebookWebhook.js';
import pageRoutes from './routes/pageRoutes.js'
import User from './models/User.js';
import Conversation from './models/Conversation.js';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// mongoose.connect('mongodb+srv://umang:XZqQmOC7LtUPLCNu@cluster01.2gtklha.mongodb.net?retryWrites=true&w=majority')
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.error('MongoDB connection FAILED', err));


try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
} catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
}

app.use(session({
    secret: 'process.env.EXPRESS_SESSION_SECRET',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);




app.use('/', authRoutes);
app.use('/', webhookRoutes);
app.use('/', pageRoutes);
app.use('/', loginRoutes);

app.get('/test-webhook-registration', async (req, res) => {
    try {
        const testPageId = '189617477577877';
        const testPageAccessToken = 'EAAO89S9DSHkBO1FTW1hIoG23HdiCUeZCLy9y8IhZATm8Rvq59mZCbc5owHB9EDUK3FS8plmOzGfBKQxSOXNGzOALVJok41JNRBsa2nQ2oDzEux4w7BYTOAIK1ADOuAbYvT74mqzwToDOhA8IcPljwBzsqFZCZCq9pcmSgWN6Fo3HalnJuY4ruosD2oy1pQlYcVOT0qNMb3MmjvcLs88HdtBMZD';

        await registerFacebookWebhook(testPageId, testPageAccessToken);
        res.send('Webhook registration initiated. Check server logs for outcome.');
    } catch (error) {
        console.error('Error during webhook registration test:', error);
        res.status(500).send('Error initiating webhook registration.');
    }
});

// Route to search for user by DOB
app.post('/search-by-dob', async (req, res) => {
    console.log('in search dob block');
    const { dateOfBirth } = req.body;
    try {
        const users = await User.find({ dateOfBirth });
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No user found with that date of birth.' });
        }
        res.json(users);
    } catch (error) {
        console.error('Database search error:', error);
        res.status(500).send('An error occurred while searching the database.');
    }
});



//const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.post('/send-message', async (req, res) => {
    const { senderPsid, messageText, conversationId, pageId } = req.body;


    const PAGE_ID = pageId;
    console.log('Page id found', PAGE_ID);

    const user = await User.findById(PAGE_ID);
    console.log('User found', user);

    const PAGE_ACCESS_TOKEN = user.pageAccessTokens[0]?.accessToken;
    console.log('Access Token found', PAGE_ACCESS_TOKEN);


    try {
        const response = await axios.post(`https://graph.facebook.com/v19.0/${PAGE_ID}/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            recipient: { id: senderPsid },
            message: { text: messageText },
            messaging_type: 'RESPONSE',
            tag: 'CONFIRMED_EVENT_UPDATE'
        });

        console.log('Message sent:', response.data);

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }
        console.log('msg in db ');

        const newMessage = {
            text: messageText,
            timestamp: new Date(),
            messageId: 'new-message-id',
            senderId: 'PAGE_ID',
            recipientId: senderPsid,
        };

        conversation.messages.push(newMessage);
        await conversation.save();

        console.log('msg saved in db');


        res.json({ message: 'Message sent and logged successfully.', ...newMessage });
    } catch (error) {
        console.error('Failed to send or log message:', error);
        res.status(500).json({ error: 'Failed to send or log message' });
    }
});


app.get('/conversations', passport.authenticate('jwt', { failureMessage: true }), async (req, res) => {
    try {
        console.log('Working on collecting message for frontend');


         const userId = req.user._id;

        if (!req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        console.log('UserID:', userId);


        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const pageId = user.pageAccessTokens[0]?.pageId;
        console.log('Found Page id', pageId);

        if (!pageId) {
            return res.status(404).json({ message: "No Facebook page connected for user." });
        }

        const conversations = await Conversation.find({ pageId: pageId });
        res.json(conversations);
        console.log('Found convo', conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'An error occurred while fetching conversations' });
    }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});



// // require('dotenv').config({path: './env'})
// import dotenv from "dotenv"
// import connectDB from "./db/index.js";
// import { app } from './app.js'
// dotenv.config({
//     path: './.env'
// })



// connectDB()
//     .then(() => {
//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//         })
//     })
//     .catch((err) => {
//         console.log("MONGO db connection failed !!! ", err);
//     })


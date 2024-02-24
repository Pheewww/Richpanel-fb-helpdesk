import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import expressSession from 'express-session';
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
import './middlewares/authLocal.js'
dotenv.config();



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.use(expressSession({
    secret: 'process.env.EXPRESS_SESSION_SECRET',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
configurePassport(passport);
app.use(passport.authenticate('session'));




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


pageRoutes.get('/facebook-page1', passport.authenticate('local', { session: false }), async (req, res) => {

    const user1 = req.body;
    console.log('// going for page search, also user ->', user1);

    const userId = req.user;
    try {
        const user = await User.findById(userId);
        console.log('// user ', user);
        //console.log('user email', user.email);


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

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.post('/send-message', async (req, res) => {
    const { senderPsid, messageText, conversationId } = req.body;

    try {
        const response = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
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


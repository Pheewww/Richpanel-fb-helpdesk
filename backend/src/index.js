import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import configurePassport from './routes/passportConfig.js';
import webhookRoutes from './routes/webhookRoutes.js';
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

// mongoose.connect('mongodb+srv://umang:XZqQmOC7LtUPLCNu@cluster01.2gtklha.mongodb.net/test?retryWrites=true&w=majority')
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

configurePassport(passport);


app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes); 
app.use('/', webhookRoutes);
app.use('/', pageRoutes);

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



const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.post('/send-message', async (req, res) => {
    const { senderPsid, messageText, conversationId } = req.body;

    try {
        const response = await axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
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


app.get('/api/conversations', async (req, res) => {
    try {
        console.log('Working on collecting message for frontend');
        const userId = req.user._id;
        const conversations = await Conversation.find({ customerId: userId });
        res.json(conversations);
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


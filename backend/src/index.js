import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import expressSession from 'express-session';
import authRoutes from './routes/authRoutes.js';
import configurePassport from './routes/passportConfig.js';
import axios from 'axios';
import webhookRoutes from './routes/webhookRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import registerFacebookWebhook from './routes/registerFacebookWebhook.js';
import pageRoutes from './routes/pageRoutes.js'
import User from './models/User.js';
import Conversation from './models/Conversation.js';
import cors from "cors";
import verifyToken from './routes/authConfig.js';
import dotenv from 'dotenv';
import './middlewares/authLocal.js'
dotenv.config();

// mongoose.connect('mongodb+srv://umang:0bbK5XsETIXE1VVi@cluster01.2gtklha.mongodb.net?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.error('MongoDB connection FAILED', err));

try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
} catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
}


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

app.use(session({
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

app.post('/user/chat/send-message', async (req, res) => {
    console.log('Received request to send message:', req.body);
    const { senderPsid, messageText, conversationId, pageId } = req.body;



    const PAGE_ID = pageId;
    if (!pageId) {
        console.error('Page ID is missing.');
        res.status(400).json({ error: 'Page ID is required.' });
    }

    try {
        const user = await User.findOne({ pageId: PAGE_ID });
        if (!user) {
            console.error('User not found for Page ID:', pageId);
            res.status(404).json({ error: 'User not found.' });
        }
        console.log('User found:', user);

        const PAGE_ACCESS_TOKEN = user.pageAccessTokens[0]?.accessToken;
        if (!PAGE_ACCESS_TOKEN) {
            console.error('Access token not found for user:', user);
            res.status(404).json({ error: 'Access token not found.' });
        }
        console.log('Access Token found:', PAGE_ACCESS_TOKEN);



        const response = await axios.post(`https://graph.facebook.com/v19.0/${PAGE_ID}/messages`, {
            recipient: { id: senderPsid },
            messaging_type: 'MESSAGE_TAG',
            message: { text: messageText },
            tag: 'CONFIRMED_EVENT_UPDATE'
        }, {
            headers: { Authorization: `Bearer ${PAGE_ACCESS_TOKEN}` }
        });

        console.log('Message sent:', response.data);

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            console.error('Conversation not found with ID:', conversationId);
            res.status(404).json({ error: 'Conversation not found.' });
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


app.get('/conversations',  verifyToken, async (req, res) => {
    try {
        console.log('Working on collecting message for frontend');



        const userId = req.user.id;

        if (!req.user.id) {
          return  res.status(401).json({ message: 'User not authenticated' });
        }
        console.log('UserID:', userId);


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
        console.log('conversations', conversations);
        return res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'An error occurred while fetching conversations' });
    }
});






app.post('/data-deletion', async (req, res) => {
    const signedRequest = req.body.signed_request;
    const data = parseSignedRequest(signedRequest, process.env.CLIENT_SECRET);
    if (!data) {
        res.status(400).send('Invalid signed request.');
    }

    const userId = data.user_id;

    try {
        await User.deleteOne({ facebookId: userId });
        await Conversation.deleteMany({ customerId: userId });

        const statusUrl = `https://richpanel-fb-helpdesk-1.onrender.com/connect-page?id=${userId}`;
        const confirmationCode = userId;

        res.json({
            url: statusUrl,
            confirmation_code: confirmationCode,
        });
    } catch (error) {
        console.error('Error deleting user data:', error);
        return res.status(500).send('Internal Server Error');
    }
});

function parseSignedRequest(signedRequest, secret) {
    const [encodedSig, payload] = signedRequest.split('.', 2);

    const sig = base64UrlDecode(encodedSig);
    const data = JSON.parse(base64UrlDecode(payload));

    const expectedSig = jwt.sign(payload, secret, { algorithm: 'HS256' }).split('.')[2];

    if (sig !== expectedSig) {
        console.error('Bad Signed JSON signature!');
        return null;
    }

    return data;
}

function base64UrlDecode(input) {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const buff = Buffer.from(base64, 'base64');
    return buff.toString('ascii');
}




const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});




import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js'; 
import configurePassport from './routes/passportConfig.js'; 
import  webhookRoutes  from './routes/webhookRoutes.js';  
import registerFacebookWebhook  from './routes/registerFacebookWebhook.js';
import User from './models/User.js';
import cors from "cors"



const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


configurePassport(passport); 

mongoose.connect('mongodb+srv://umang:qWqvWBN5XkwXgGBd@cluster01.2gtklha.mongodb.net/', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.use(session({
    secret: 'hhhhpppp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes); // This will mount your auth routes at the root path
app.use('/', webhookRoutes); // This will mount your webhook routes at the root path

// Set up other middleware, routes, etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Register webhooks for each page after the server starts
    const users = await User.find({}); // Get all users
    users.forEach(user => {
        user.pageAccessTokens.forEach(page => {
            registerFacebookWebhook(page.pageId, page.accessToken);
        });
    });
});
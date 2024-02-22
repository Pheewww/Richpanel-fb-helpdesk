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



mongoose.connect('process.env.MONGODB_URI', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.use(session({
    secret: 'process.env.EXPRESS_SESSION_SECRET',
    resave: true,
    saveUninitialized: true
}));

configurePassport(passport); 


app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes); // This will mount your auth routes at the root path
app.use('/', webhookRoutes); // This will mount your webhook routes at the root path

app.get('/test-webhook-registration', async (req, res) => {
    try {
        // Assuming you have a specific Page ID and Access Token for testing
        const testPageId = '189617477577877';
        const testPageAccessToken = 'EAAO89S9DSHkBOyplZAtZCrp5dZBFxE6xZACHhZCCES0ZAuyIzXgyZAZC5S9y2IzcZBZA2shCZBYZCH3Pmdc2yjIBEgVuMqRINQX5O8NJtxxrI550RlKjUwYJu4PtAhXRunjKB2fUHavY0TEIirpiVRnLXqT5fHx8sRxtkDf1LEUvo8xOAjAe8ZAUJgqrhFoXKr02pTGAQNiRYLFPQpitnzFfFMZB4Kf98ZD';

        await registerFacebookWebhook(testPageId, testPageAccessToken);
        res.send('Webhook registration initiated. Check server logs for outcome.');
    } catch (error) {
        console.error('Error during webhook registration test:', error);
        res.status(500).send('Error initiating webhook registration.');
    }
});


// Set up other middleware, routes, etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Register webhooks for each page after the server starts
    // const users = await User.find({}); // Get all users
    // users.forEach(user => {
    //     user.pageAccessTokens.forEach(page => {
    //         registerFacebookWebhook(page.pageId, page.accessToken);
    //     });
    // });
});
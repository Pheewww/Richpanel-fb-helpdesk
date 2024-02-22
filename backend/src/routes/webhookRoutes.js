import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { handleMessage, handlePostback } from '../utils/messageHandlers.js'; // Assuming these are defined in a separate file

const webhookRoutes = express.Router();

// Apply body-parser middleware to parse the JSON body of incoming POST requests
webhookRoutes.use(bodyParser.json());

webhookRoutes.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

webhookRoutes.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            const webhook_event = entry.messaging[0];
            console.log(webhook_event);

            if (webhook_event.message) {
                handleMessage(webhook_event.sender.id, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(webhook_event.sender.id, webhook_event.postback);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Example of a function to call the Send API
const callSendAPI = async (senderPsid, response) => {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    try {
        await axios.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            recipient: {
                id: senderPsid
            },
            message: response
        });

        console.log('Message sent!');
    } catch (error) {
        console.error('Unable to send message:', error);
    }
};

export { callSendAPI };
export default webhookRoutes;

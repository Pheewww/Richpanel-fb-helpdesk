import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import {  handlePostback, processWebhookEvent } from '../utils/messageHandlers.js'; // Assuming these are defined in a separate file

const webhookRoutes = express.Router();

// Apply body-parser middleware to parse the JSON body of incoming POST requests
webhookRoutes.use(bodyParser.json());

webhookRoutes.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = "happy";
    console.log("going");
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    console.log("going1");
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED111');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// webhookRoutes.post('/webhook', (req, res) => {
//     const VERIFY_TOKEN = "happy";
//     const mode = req.query['hub.mode'];
//     const token = req.query['hub.verify_token'];
//     const challenge = req.query['hub.challenge'];
//     if (mode && token) {
//         if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//             console.log('WEBHOOK_VERIFIED111');
//             res.status(200).send(challenge);
//         } else {
//             res.sendStatus(403);
//         }
//     }
// });

webhookRoutes.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            const webhook_event = entry.messaging[0];
            console.log(JSON.stringify(webhook_event));

            if (webhook_event.sender && webhook_event.sender.id) {
                console.log('Sender PSID: ' + webhook_event.sender.id);
                processWebhookEvent(webhook_event)
            }
            else if (webhook_event.postback && webhook_event.sender && webhook_event.sender.id) {
                handlePostback(webhook_event.sender.id, webhook_event.postback);
            } else {
                console.log('Sender ID not found or event type not handled', webhook_event);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});



export default webhookRoutes;

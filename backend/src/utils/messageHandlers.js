import { callSendAPI } from '../routes/webhookRoutes.js';
import Conversation from '../models/Conversation.js'; // import your Conversation model

// This assumes you have a Conversation model with a schema that includes fields for
// customerId, pageId, lastMessageAt, and messages (as an array of message objects).

const processWebhookEvent = async (webhook_event) => {
    const sender_psid = webhook_event.sender.id;
    const message = webhook_event.message;

    try {
        // Find the most recent conversation in the database
        let conversation = await Conversation.findOne({
            customerId: sender_psid
        }).sort({ lastMessageAt: -1 });

        const now = new Date();

        // Check if a new conversation should be started
        if (!conversation || now - conversation.lastMessageAt > 24 * 60 * 60 * 1000) {
            // Start a new conversation - yaha pe new initialize hua h
            conversation = new Conversation({
                pageId: process.env.PAGE_ID,
                customerId: sender_psid,
                lastMessageAt: now,
                messages: []
            });
        }

        // Add message to the conversation (new or existing) -- ye db me add krega
        conversation.messages.push({
            messageId: message.mid,
            text: message.text,
            attachments: message.attachments,
            sentAt: now
        });
        conversation.lastMessageAt = now;
        await conversation.save();

       
    } catch (error) {
        console.error('Failed to process webhook event:', error);
    }
};

// const handleMessage = async (senderPsid, receivedMessage, conversationId) => {
//     try {
//         // Logic to save the message to the conversation in the database -- frontend to user
//         const now = new Date();
//         const conversation = await Conversation.findById(conversationId);
//         if (!conversation) {
//             throw new Error(`Conversation with ID ${conversationId} not found.`);
//         }

//         conversation.messages.push({
//             messageId: receivedMessage.mid,
//             text: receivedMessage.text,
//             //attachments: receivedMessage.attachments,
//             sentAt: now
//         });

//         await conversation.save();

//         const response = {
//             text: `You sent the message: "${receivedMessage.text}"!`
//         };

//         // Send a response message via the Send API
//         await callSendAPI(senderPsid, response);
//     } catch (error) {
//         console.error('Failed to handle message:', error);
//     }
// };

const handlePostback = (senderPsid, receivedPostback) => {
    let response;

    // Get the payload for the postback
    const payload = receivedPostback.payload;

    switch (payload) {
        case 'yes':
            response = { text: 'Thanks!' };
            break;
        case 'no':
            response = { text: 'Oops, try sending another image.' };
            break;
        default:
            response = { text: 'I did not understand that postback.' };
    }

    callSendAPI(senderPsid, response);
};

export { processWebhookEvent, handlePostback };

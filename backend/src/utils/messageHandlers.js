import Conversation from '../models/Conversation.js'; 



const processWebhookEvent = async (webhook_event) => {
    const sender_psid = webhook_event.sender.id;
    const message = webhook_event.message;

    try {
        // Find the most recent conversation in the database
        console.log('Looking the convo in the database');
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
            console.log('this conv is new and got added in database');
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

        console.log('added in the database - BY WebhookProcessEvent');

       
    } catch (error) {
        console.error('Failed to process webhook event:', error);
    }
};


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

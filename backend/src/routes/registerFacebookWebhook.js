import fetch from 'node-fetch';

const registerFacebookWebhook = async (pageId, pageAccessToken) => {
    const webhookUrl = `https://graph.facebook.com/${pageId}/subscribed_apps`;
    const fields = 'messages,messaging_postbacks,conversations,message_deliveries'; // The list of fields you want to subscribe to
    // link - https://developers.facebook.com/docs/messenger-platform/webhooks#events for tags 
    const callbackUrl = process.env.WEBHOOK_CALLBACK_URL; // Your webhook callback URL
    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN; // Your verify token

    const requestBody = {
        access_token: pageAccessToken,
        subscribed_fields: fields.split(','),
        object: 'page',
        callback_url: callbackUrl,
        verify_token: verifyToken,
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
            console.log(`Successfully registered the webhook for page ID: ${pageId}`);
        } else {
            console.error(`Failed to register the webhook for page ID: ${pageId}:`, data);
        }
    } catch (error) {
        console.error('Error registering webhook for page ID: ${pageId}:', error);
    }
};

export default registerFacebookWebhook;

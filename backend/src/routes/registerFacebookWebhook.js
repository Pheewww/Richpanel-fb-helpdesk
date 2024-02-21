import fetch from 'node-fetch';

const registerFacebookWebhook = async (pageId, pageAccessToken) => {
    const webhookUrl = 'https://graph.facebook.com/' + pageId + '/subscribed_apps';
    const fields = 'messages,messaging_postbacks'; // The list of fields you want to subscribe to
    const callbackUrl = process.env.WEBHOOK_CALLBACK_URL; // Your webhook callback URL

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({
                access_token: pageAccessToken,
                subscribed_fields: fields.split(','),
                object: 'page',
                callback_url: callbackUrl,
                verify_token: process.env.WEBHOOK_VERIFY_TOKEN // The verify token should match the one you set when setting up the webhook
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
            console.log(`Successfully registered the webhook for page ID: ${pageId}`);
        } else {
            console.error(`Failed to register the webhook for page ID: ${pageId}:`, data);
        }
    } catch (error) {
        console.error('Error registering webhook: ', error);
    }
};

export default registerFacebookWebhook;